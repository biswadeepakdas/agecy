import Link from 'next/link'
import type { Agent } from '@prisma/client'
import { TierBadge } from '@/components/ui/tier-badge'
import { cn } from '@/lib/utils'

function formatDivision(div: string) {
  return div.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const isSTier = agent.tier === 'S'

  return (
    <Link href={`/dashboard/agents/${agent.slug}`} className="block h-full">
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden h-full flex flex-col',
          'bg-white/[0.03] border transition-all duration-300 ease-out cursor-pointer',
          'hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]',
          'glass-shimmer',
          isSTier
            ? 'border-amber-500/20 hover:border-amber-500/35 hover:shadow-[0_20px_40px_rgba(245,158,11,0.12)]'
            : 'border-white/[0.08] hover:border-white/[0.14]'
        )}
        style={{ backdropFilter: 'blur(24px) saturate(1.5)' }}
      >
        {/* Top catch-light */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" aria-hidden="true" />

        {/* S-tier ambient glow */}
        {isSTier && (
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" aria-hidden="true" />
        )}

        <div className="p-4 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="text-3xl leading-none">{agent.emoji}</span>
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
              <TierBadge tier={agent.tier} />
              <span className="text-[10px] text-zinc-600 bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                {formatDivision(agent.division)}
              </span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-zinc-100 text-sm leading-snug mb-2">{agent.name}</h3>

          {/* Description */}
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">{agent.description}</p>

          {/* Tags */}
          {agent.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {agent.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-white/[0.04] border border-white/[0.07] text-zinc-500"
                >
                  {tag}
                </span>
              ))}
              {agent.tags.length > 3 && (
                <span className="text-[10px] text-zinc-700 px-1 py-0.5">
                  +{agent.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-white/[0.05]">
            {agent.isFree ? (
              <span className="text-sm font-semibold text-emerald-400">Free</span>
            ) : agent.priceUSD ? (
              <span className="text-sm font-bold text-amber-400">
                ${(agent.priceUSD / 100).toFixed(0)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
