export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { BundleCard } from '@/components/bundles/BundleCard'
import { Package } from 'lucide-react'

export default async function BundlesPage() {
  const bundles = await prisma.bundle.findMany({
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
  })

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Agent Bundles</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Curated collections — save 40%+ vs buying individually
        </p>
      </div>

      {bundles.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-white/[0.06] mb-4"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <Package className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-zinc-500 text-sm">No bundles available yet</p>
        </div>
      ) : (
        <>
          {/* Featured section */}
          {bundles.some((b) => b.isFeatured) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Featured</span>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundles.filter((b) => b.isFeatured).map((bundle) => (
                  <BundleCard key={bundle.id} bundle={bundle} />
                ))}
              </div>
            </div>
          )}

          {/* All bundles */}
          {bundles.some((b) => !b.isFeatured) && (
            <div className="space-y-3">
              {bundles.some((b) => b.isFeatured) && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">All Bundles</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundles.filter((b) => !b.isFeatured).map((bundle) => (
                  <BundleCard key={bundle.id} bundle={bundle} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
