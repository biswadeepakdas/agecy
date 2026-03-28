export const runtime = 'nodejs'

import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('x-razorpay-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')

  if (expectedSig !== sig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body) as {
    event: string
    payload: {
      payment: {
        entity: {
          id: string
          amount: number
          currency: string
          notes: Record<string, string>
        }
      }
    }
  }

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const { userId, type, id } = payment.notes ?? {}

    if (!userId || !type || !id) {
      return NextResponse.json({ error: 'Missing notes' }, { status: 400 })
    }

    await prisma.purchase.create({
      data: {
        userId,
        ...(type === 'agent' ? { agentId: id } : { bundleId: id }),
        amount: payment.amount,
        currency: payment.currency ?? 'INR',
        paymentProvider: 'RAZORPAY',
        paymentId: payment.id,
        status: 'COMPLETED',
      },
    })
  }

  return NextResponse.json({ received: true })
}
