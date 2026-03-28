export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { GlassCard } from '@/components/ui/glass-card'
import { TierBadge } from '@/components/ui/tier-badge'
import { AgentCard } from '@/components/agents/AgentCard'
import { BundleCheckout } from '@/components/bundles/BundleCheckout'

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  const bundle = await prisma.bundle.findUnique({
    where: { slug },
    include: {
      items: {
        include: { agent: true },
      },
    },
  })
  if (!bundle) notFound()

  const owned = session?.user?.id
    ? !!(await prisma.purchase.findFirst({
        where: {
          userId: session.user.id,
          bundleId: bundle.id,
          status: 'COMPLETED',
        },
      }))
    : false

  const savings = bundle.originalPriceUSD - bundle.priceUSD
  const savingsPct = Math.round((savings / bundle.originalPriceUSD) * 100)

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/bundles"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to bundles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero block */}
          <GlassCard
            variant={bundle.isFeatured ? 'glow' : 'default'}
            className="p-6"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl leading-none">{bundle.emoji}</span>
              <div className="space-y-1.5 min-w-0">
                {bundle.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <Sparkles className="w-2.5 h-2.5" />
                    Featured Bundle
                  </span>
                )}
                <h1 className="text-2xl font-bold text-white">{bundle.name}</h1>
                <p className="text-zinc-400 text-sm">{bundle.tagline}</p>
              </div>
            </div>
          </GlassCard>

          {bundle.description && (
            <p className="text-sm text-zinc-400 leading-relaxed">{bundle.description}</p>
          )}

          {/* Savings callout */}
          <div
            className="relative rounded-2xl overflow-hidden border border-emerald-500/20 p-5"
            style={{ backdropFilter: 'blur(24px)', background: 'rgba(52,211,153,0.04)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" aria-hidden="true" />
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-emerald-400 font-bold text-lg">
                  Save ${(savings / 100).toFixed(0)} — {savingsPct}% off
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  vs buying {bundle.items.length} agents individually ($
                  {(bundle.originalPriceUSD / 100).toFixed(0)})
                </p>
              </div>
              <div className="text-3xl font-bold text-white">
                ${(bundle.priceUSD / 100).toFixed(0)}
              </div>
            </div>
          </div>

          {/* Included agents */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest">
                Included Agents ({bundle.items.length})
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bundle.items.map(({ agent }) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>

          {/* Tier distribution */}
          {bundle.items.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-600">Tiers included:</span>
              {Array.from(new Set(bundle.items.map((i) => i.agent.tier))).map((t) => (
                <TierBadge key={t} tier={t} size="xs" />
              ))}
            </div>
          )}
        </div>

        {/* Right: checkout */}
        <div>
          <BundleCheckout
            bundleId={bundle.id}
            priceUSD={bundle.priceUSD}
            priceINR={bundle.priceINR}
            originalPriceUSD={bundle.originalPriceUSD}
            owned={owned}
          />
        </div>
      </div>
    </div>
  )
}
