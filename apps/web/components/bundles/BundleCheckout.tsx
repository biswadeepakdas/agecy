'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BundleCheckoutProps {
  bundleId: string
  priceUSD: number
  priceINR: number
  originalPriceUSD: number
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

export function BundleCheckout({
  bundleId,
  priceUSD,
  priceINR,
  originalPriceUSD,
  owned,
}: BundleCheckoutProps) {
  const [currency, setCurrency] = useState<'USD' | 'INR'>(() => detectCurrency())
  const [loading, setLoading] = useState(false)

  const savings = originalPriceUSD - priceUSD
  const savingsPct = Math.round((savings / originalPriceUSD) * 100)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const provider = currency === 'INR' ? 'razorpay' : 'stripe'
      const res = await fetch(`/api/checkout/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bundle', id: bundleId }),
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
          description: data.description,
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
      <div className="space-y-3">
        <p className="text-emerald-400 font-semibold text-lg">✓ Owned</p>
        <Button asChild className="w-full">
          <Link href="/dashboard/library">Go to Library</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Savings callout */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 space-y-0.5">
        <p className="text-emerald-400 text-sm font-semibold">
          Save ${(savings / 100).toFixed(0)} ({savingsPct}% off)
        </p>
        <p className="text-xs text-zinc-400">
          vs buying individually (${(originalPriceUSD / 100).toFixed(0)} separately)
        </p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">
          {currency === 'INR'
            ? `₹${(priceINR / 100).toFixed(0)}`
            : `$${(priceUSD / 100).toFixed(0)}`}
        </span>
        {currency === 'USD' && (
          <span className="text-sm text-zinc-500 line-through">
            ${(originalPriceUSD / 100).toFixed(0)}
          </span>
        )}
      </div>

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
    </div>
  )
}
