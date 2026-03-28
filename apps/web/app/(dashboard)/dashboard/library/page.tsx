export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { Agent } from '@prisma/client'
import { GlassCard } from '@/components/ui/glass-card'
import { TierBadge } from '@/components/ui/tier-badge'
import { InstallDialog } from './install-dialog'
import { ShoppingBag } from 'lucide-react'

export default async function LibraryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const purchases = await prisma.purchase.findMany({
    where: {
      userId: session.user.id,
      status: 'COMPLETED',
    },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
  })

  // Deduplicate agents (bundle purchases may bring multiple of same agent)
  const agentMap = new Map<string, Agent>()
  for (const purchase of purchases) {
    if (purchase.agent && !agentMap.has(purchase.agent.id)) {
      agentMap.set(purchase.agent.id, purchase.agent)
    }
  }
  const ownedAgents = Array.from(agentMap.values())

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Your Library</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {ownedAgents.length > 0
              ? `${ownedAgents.length} agent${ownedAgents.length !== 1 ? 's' : ''} owned`
              : 'No agents yet'}
          </p>
        </div>
      </div>

      {ownedAgents.length === 0 ? (
        /* Empty state */
        <div className="py-8">
          <GlassCard className="max-w-sm mx-auto p-10 text-center">
            <div
              className="w-16 h-16 rounded-2xl border border-white/[0.07] flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <ShoppingBag className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="font-semibold text-white mb-2">No agents yet</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              Browse the marketplace and purchase agents to see them here.
            </p>
            <Link
              href="/dashboard/agents"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950
                hover:from-amber-400 hover:to-amber-300
                hover:shadow-[0_8px_24px_rgba(245,158,11,0.3)]
                transition-all duration-200"
            >
              Browse Agents
            </Link>
          </GlassCard>
        </div>
      ) : (
        /* Owned agents grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ownedAgents.map((agent) => (
            <div
              key={agent.id}
              className="relative rounded-2xl overflow-hidden border border-white/[0.08] flex flex-col"
              style={{
                backdropFilter: 'blur(24px) saturate(1.5)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {/* Catch-light */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" aria-hidden="true" />

              {/* Owned badge */}
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                  ✓
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl leading-none">{agent.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TierBadge tier={agent.tier} size="xs" />
                    </div>
                    <h3 className="font-semibold text-zinc-100 text-sm leading-snug truncate">
                      {agent.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">
                  {agent.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                  <Link
                    href={`/dashboard/agents/${agent.slug}`}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    View details →
                  </Link>
                  <InstallDialog
                    agentName={agent.name}
                    agentEmoji={agent.emoji}
                    agentSlug={agent.slug}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
