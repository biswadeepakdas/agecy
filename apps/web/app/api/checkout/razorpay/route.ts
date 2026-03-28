export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { razorpay } from '@/lib/razorpay'
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

  if (checkoutRatelimit) {
    const { success } = await checkoutRatelimit.limit(session.user.id)
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }
  }

  if (!razorpay) {
    return NextResponse.json({ error: 'Razorpay not configured' }, { status: 503 })
  }

  const body: unknown = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { type, id } = parsed.data

  let name: string
  let description: string
  let amount: number

  if (type === 'agent') {
    const agent = await prisma.agent.findUnique({ where: { id } })
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    const owned = await checkOwnership(session.user.id, agent.slug)
    if (owned) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

    name = agent.name
    description = agent.description.slice(0, 255)
    amount = agent.priceINR ?? 0
  } else {
    const bundle = await prisma.bundle.findUnique({ where: { id } })
    if (!bundle) return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })

    const existing = await prisma.purchase.findFirst({
      where: { userId: session.user.id, bundleId: bundle.id, status: 'COMPLETED' },
    })
    if (existing) return NextResponse.json({ error: 'Already purchased' }, { status: 400 })

    name = bundle.name
    description = bundle.tagline
    amount = bundle.priceINR
  }

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `${type}_${id}`.slice(0, 40),
    notes: { userId: session.user.id, type, id },
  })

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    name,
    description,
    prefill: { email: session.user.email ?? '' },
  })
}
