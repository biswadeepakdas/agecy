import { Skeleton } from '@/components/ui/skeleton'

export default function AgentsLoading() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-24 bg-zinc-800" />
        <Skeleton className="h-4 w-64 bg-zinc-800" />
      </div>

      {/* Search + filter skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 bg-zinc-800" />
        <Skeleton className="h-9 w-32 bg-zinc-800" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full bg-zinc-800" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-8 w-8 bg-zinc-800" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-6 bg-zinc-800" />
                <Skeleton className="h-5 w-20 bg-zinc-800" />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4 bg-zinc-800" />
            <Skeleton className="h-3 w-full bg-zinc-800" />
            <Skeleton className="h-3 w-4/5 bg-zinc-800" />
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-12 bg-zinc-800" />
              <Skeleton className="h-4 w-12 bg-zinc-800" />
            </div>
            <Skeleton className="h-4 w-10 bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
