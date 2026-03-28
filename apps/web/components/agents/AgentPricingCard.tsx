'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'

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
        const RazorpayConstructor = (
          window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }
        ).Razorpay
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
      <GlassCard variant="glow" className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          <span className="text-emerald-400 font-semibold text-sm">Owned</span>
        </div>
        <p className="text-xs text-zinc-500">This agent is in your library and ready to install.</p>
        <Link
          href="/dashboard/library"
          className="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-medium bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 transition-colors duration-200"
        >
          Go to Library
        </Link>
      </GlassCard>
    )
  }

  if (agent.isFree) {
    return (
      <GlassCard variant="glow" className="p-6 space-y-4">
        <div>
          <span className="text-emerald-400 text-3xl font-bold tracking-tight">Free</span>
        </div>
        <button className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 transition-all duration-200">
          Add to Library
        </button>
      </GlassCard>
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
    <GlassCard variant="premium" className="p-6 space-y-5">
      {/* Price */}
      <div>
        <span className="text-4xl font-bold text-white tracking-tight">{priceDisplay ?? '—'}</span>
        <p className="text-xs text-zinc-600 mt-1">One-time purchase · Lifetime access</p>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950
          hover:from-amber-400 hover:to-amber-300 hover:shadow-[0_8px_24px_rgba(245,158,11,0.35)]"
      >
        {loading
          ? 'Loading…'
          : currency === 'INR'
            ? 'Buy with Razorpay'
            : 'Buy with Stripe'}
      </button>

      {/* Currency toggle */}
      <div className="text-center">
        <button
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
          onClick={() => setCurrency((c) => (c === 'INR' ? 'USD' : 'INR'))}
        >
          {currency === 'INR' ? 'Switch to USD (Stripe)' : 'Switch to INR (Razorpay)'}
        </button>
      </div>
    </GlassCard>
  )
}
