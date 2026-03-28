import Link from 'next/link'
import type { Bundle } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BundleCardProps {
  bundle: Bundle
}

export function BundleCard({ bundle }: BundleCardProps) {
  const savings = bundle.originalPriceUSD - bundle.priceUSD
  const savingsPct = Math.round((savings / bundle.originalPriceUSD) * 100)

  return (
    <Link href={`/dashboard/bundles/${bundle.slug}`}>
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-2xl leading-none">{bundle.emoji}</span>
            {bundle.isFeatured && (
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs shrink-0">
                Featured
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm mt-2 leading-tight">{bundle.name}</h3>
          <p className="text-xs text-zinc-400">{bundle.tagline}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {bundle.targetAudience && (
            <p className="text-xs text-zinc-500">For: {bundle.targetAudience}</p>
          )}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">
              ${(bundle.priceUSD / 100).toFixed(0)}
            </span>
            <span className="text-xs text-zinc-500 line-through">
              ${(bundle.originalPriceUSD / 100).toFixed(0)}
            </span>
            <span className="text-xs text-emerald-400">Save {savingsPct}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
