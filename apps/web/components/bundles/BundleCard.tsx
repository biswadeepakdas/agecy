import Link from 'next/link'
import type { Bundle } from '@prisma/client'
import { cn } from '@/lib/utils'

interface BundleCardProps {
  bundle: Bundle
}

export function BundleCard({ bundle }: BundleCardProps) {
  const savings = bundle.originalPriceUSD - bundle.priceUSD
  const savingsPct = Math.round((savings / bundle.originalPriceUSD) * 100)
  const isFeatured = bundle.isFeatured

  return (
    <Link href={`/dashboard/bundles/${bundle.slug}`} className="block h-full">
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden h-full flex flex-col',
          'border transition-all duration-300 ease-out cursor-pointer',
          'hover:-translate-y-0.5',
          'glass-shimmer',
          isFeatured
            ? 'bg-gradient-to-br from-amber-500/[0.06] to-white/[0.02] border-amber-500/20 hover:border-amber-500/35 hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)]'
            : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.14] hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]'
        )}
        style={{ backdropFilter: 'blur(24px) saturate(1.5)' }}
      >
        {/* Catch-light */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" aria-hidden="true" />

        <div className="p-5 flex flex-col flex-1">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <span className="text-3xl leading-none">{bundle.emoji}</span>
            <div className="flex items-center gap-2">
              {isFeatured && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  Featured
                </span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                {savingsPct}% off
              </span>
            </div>
          </div>

          {/* Name + tagline */}
          <h3 className="font-semibold text-zinc-100 text-sm leading-snug mb-1">{bundle.name}</h3>
          <p className="text-xs text-zinc-500 leading-relaxed flex-1 line-clamp-2">{bundle.tagline}</p>

          {/* Audience */}
          {bundle.targetAudience && (
            <p className="text-[10px] text-zinc-700 mt-2">For: {bundle.targetAudience}</p>
          )}

          {/* Pricing */}
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-baseline gap-2">
            <span className="text-base font-bold text-amber-400">
              ${(bundle.priceUSD / 100).toFixed(0)}
            </span>
            <span className="text-xs text-zinc-600 line-through">
              ${(bundle.originalPriceUSD / 100).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
