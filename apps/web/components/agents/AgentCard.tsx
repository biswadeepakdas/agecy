import Link from 'next/link'
import type { Agent } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const TIER_STYLES: Record<string, string> = {
  S: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  A: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  B: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  C: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

const TIER_BORDER: Record<string, string> = {
  S: 'hover:border-yellow-500/30',
  A: 'hover:border-purple-500/30',
  B: 'hover:border-blue-500/30',
  C: 'hover:border-zinc-500/30',
}

function formatDivision(div: string) {
  return div.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const tierStyle = TIER_STYLES[agent.tier] ?? TIER_STYLES.C
  const tierBorder = TIER_BORDER[agent.tier] ?? TIER_BORDER.C

  return (
    <Link href={`/dashboard/agents/${agent.slug}`}>
      <Card
        className={cn(
          'bg-zinc-900 border-zinc-800 transition-colors cursor-pointer h-full',
          tierBorder
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-2xl leading-none">{agent.emoji}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge className={cn('text-xs', tierStyle)}>
                {agent.tier}
              </Badge>
              <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500 max-w-[90px] truncate">
                {formatDivision(agent.division)}
              </Badge>
            </div>
          </div>
          <h3 className="font-semibold text-white text-sm mt-2 leading-tight">{agent.name}</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{agent.description}</p>

          {/* Tags */}
          {agent.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {agent.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-400"
                >
                  {tag}
                </span>
              ))}
              {agent.tags.length > 3 && (
                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] text-zinc-600">
                  +{agent.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="pt-1">
            {agent.isFree ? (
              <span className="text-sm font-semibold text-emerald-400">Free</span>
            ) : agent.priceUSD ? (
              <span className="text-sm font-semibold text-white">${(agent.priceUSD / 100).toFixed(0)}</span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
