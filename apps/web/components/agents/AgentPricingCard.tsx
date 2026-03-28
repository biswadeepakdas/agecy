'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AgentPricingCardProps {
  agent: {
    id: string
    name: string
    isFree: boolean
    priceUSD: number | null
    priceINR: number | null
  }
  owned: boolean
}

function detectCurrency(): 'USD' | 'INR' {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const isIndia = tz.includes('Asia/Calcutta') || tz.includes('Asia/Kolkata')
  return isIndia ? 'INR' : 'USD'
}

async function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export function AgentPricingCard({ agent, owned }: AgentPricingCardProps) {
  const [currency, setCurrency] = useState<'USD' | 'INR'>(() => detectCurrency())
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const provider = currency === 'INR' ? 'razorpay' : 'stripe'
      const res = await fetch(`/api/checkout/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'agent', id: agent.id }),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        alert((data.error as string) || 'Checkout failed')
        return
      }
      if (provider === 'stripe') {
        window.location.href = data.url as string
      } else {
        await loadRazorpayScript()
        const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }).Razorpay
        const rzp = new RazorpayConstructor({
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: data.name,
          description: `${agent.name} — AI Agent`,
          order_id: data.orderId,
          prefill: data.prefill,
          callback_url: '/dashboard/library?success=1',
        })
        rzp.open()
      }
    } finally {
      setLoading(false)
    }
  }

  if (owned) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="pt-6 space-y-4">
          <p className="text-emerald-400 font-semibold text-lg">✓ Owned</p>
          <Button asChild className="w-full">
            <Link href="/dashboard/library">Go to Library</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (agent.isFree) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-emerald-400 text-3xl font-bold">Free</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Add to Library
          </Button>
        </CardContent>
      </Card>
    )
  }

  const priceDisplay =
    currency === 'INR'
      ? agent.priceINR != null
        ? `₹${(agent.priceINR / 100).toFixed(0)}`
        : null
      : agent.priceUSD != null
        ? `$${(agent.priceUSD / 100).toFixed(0)}`
        : null

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white text-3xl font-bold">
          {priceDisplay ?? 'Contact us'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" onClick={handleCheckout} disabled={loading}>
          {loading
            ? 'Loading...'
            : currency === 'INR'
              ? 'Buy with Razorpay'
              : 'Buy with Stripe'}
        </Button>
        <div className="text-center">
          <button
            className="text-xs text-zinc-500 hover:text-zinc-300 underline"
            onClick={() => setCurrency((c) => (c === 'INR' ? 'USD' : 'INR'))}
          >
            {currency === 'INR' ? 'Switch to USD' : 'Switch to INR'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
