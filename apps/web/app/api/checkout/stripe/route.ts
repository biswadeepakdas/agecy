export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { checkoutRatelimit } from '@/lib/redis'
import { checkOwnership } from '@/lib/ownership'

const bodySchema = z.object({
  type: z.enum(['agent', 'bundle']),
  id: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { success } = await checkoutRatelimit.limit(session.user.id)
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const body: unknown = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { type, id } = parsed.data
  const baseUrl = process.env.NEXTAUTH_URL ?? ''

  if (type === 'agent') {
    const agent = await prisma.agent.findUnique({ where: { id } })
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    const owned = await checkOwnership(session.user.id, agent.slug)
    if (owned) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: agent.name },
            unit_amount: agent.priceUSD ?? 0,
          },
          quantity: 1,
        },
      ],
      metadata: { userId: session.user.id, type: 'agent', id: agent.id },
      success_url: `${baseUrl}/dashboard/library?success=1`,
      cancel_url: `${baseUrl}/dashboard/agents/${agent.slug}`,
    })

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  }

  // bundle
  const bundle = await prisma.bundle.findUnique({ where: { id } })
  if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })

  const existing = await prisma.purchase.findFirst({
    where: { userId: session.user.id, bundleId: bundle.id, status: 'COMPLETED' },
  })
  if (existing) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: bundle.name },
          unit_amount: bundle.priceUSD,
        },
        quantity: 1,
      },
    ],
    metadata: { userId: session.user.id, type: 'bundle', id: bundle.id },
    success_url: `${baseUrl}/dashboard/library?success=1`,
    cancel_url: `${baseUrl}/dashboard/bundles/${bundle.slug}`,
  })

  if (!checkoutSession.url) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }

  return NextResponse.json({ url: checkoutSession.url })
}
