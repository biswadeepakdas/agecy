export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
      <Link
        href="/dashboard/bundles"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to bundles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bundle info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl leading-none">{bundle.emoji}</span>
            <div className="space-y-1">
              {bundle.isFeatured && (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                  Featured
                </Badge>
              )}
              <h1 className="text-2xl font-bold text-white">{bundle.name}</h1>
              <p className="text-zinc-400">{bundle.tagline}</p>
            </div>
          </div>

          {bundle.description && (
            <p className="text-zinc-400 leading-relaxed">{bundle.description}</p>
          )}

          {/* Savings callout */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <p className="text-emerald-400 font-semibold">
              Save ${(savings / 100).toFixed(0)} ({savingsPct}% off)
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              vs buying {bundle.items.length} agents individually ($
              {(bundle.originalPriceUSD / 100).toFixed(0)})
            </p>
          </div>

          {/* Included agents */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              Included Agents ({bundle.items.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bundle.items.map(({ agent }) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>

        {/* Checkout */}
        <div>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <BundleCheckout
                bundleId={bundle.id}
                priceUSD={bundle.priceUSD}
                priceINR={bundle.priceINR}
                originalPriceUSD={bundle.originalPriceUSD}
                owned={owned}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
