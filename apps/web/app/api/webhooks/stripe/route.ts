export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { userId, type, id } = (session.metadata ?? {}) as Record<string, string>

    if (!userId || !type || !id) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    await prisma.purchase.create({
      data: {
        userId,
        ...(type === 'agent' ? { agentId: id } : { bundleId: id }),
        amount: session.amount_total ?? 0,
        currency: (session.currency ?? 'usd').toUpperCase(),
        paymentProvider: 'STRIPE',
        paymentId: (session.payment_intent as string | null) ?? session.id,
        status: 'COMPLETED',
      },
    })
  }

  return NextResponse.json({ received: true })
}
