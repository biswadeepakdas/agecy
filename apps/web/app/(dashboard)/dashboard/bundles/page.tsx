export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { BundleCard } from '@/components/bundles/BundleCard'

export default async function BundlesPage() {
  const bundles = await prisma.bundle.findMany({
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
  })

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Bundles</h1>
        <p className="text-zinc-400 text-sm mt-1">Save by bundling agents together</p>
      </div>

      {bundles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-sm">No bundles available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  )
}
