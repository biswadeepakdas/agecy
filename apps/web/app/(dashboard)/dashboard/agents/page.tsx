'use client'

import { useState, useEffect } from 'react'
import type { Agent } from '@prisma/client'
import { GlassInput } from '@/components/ui/glass-input'
import { TierBadge } from '@/components/ui/tier-badge'
import { AgentCard } from '@/components/agents/AgentCard'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIVISIONS = [
  'ALL',
  'ENGINEERING',
  'DESIGN',
  'MARKETING',
  'SALES',
  'PRODUCT',
  'PROJECT_MANAGEMENT',
  'TESTING',
  'SUPPORT',
  'SPATIAL_COMPUTING',
  'SPECIALIZED',
  'GAME_DEVELOPMENT',
  'ACADEMIC',
  'PAID_MEDIA',
]

const TIERS = ['S', 'A', 'B', 'C']

function formatDivision(div: string) {
  if (div === 'ALL') return 'All'
  return div.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function AgentsPage() {
  const [query, setQuery] = useState('')
  const [division, setDivision] = useState('ALL')
  const [tier, setTier] = useState<string | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const delay = query.length > 0 ? 300 : 0
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (division !== 'ALL') params.set('division', division)
        if (tier) params.set('tier', tier)
        let url: string
        if (query) {
          params.set('q', query)
          url = `/api/agents/search?${params}`
        } else {
          url = `/api/agents?${params}`
        }
        const res = await fetch(url)
        const data = (await res.json()) as { agents: Agent[] }
        setAgents(data.agents ?? [])
      } catch {
        setAgents([])
      } finally {
        setLoading(false)
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [query, division, tier])

  return (
    <div className="px-4 sm:px-6 py-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Agents</h1>
        <p className="text-zinc-500 text-sm mt-1">Browse and install AI agents for your dev tools</p>
      </div>

      {/* Search + Tier filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <GlassInput
            placeholder="Search agents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-zinc-600 shrink-0" />
          <div className="flex gap-1.5 flex-wrap">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTier(tier === t ? null : t)}
                className={cn(
                  'h-8 px-3 text-xs font-semibold rounded-xl border transition-all duration-200',
                  tier === t
                    ? 'text-current border-current'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.14]'
                )}
                style={
                  tier === t
                    ? ({
                        S: { background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.35)', color: '#fbbf24', boxShadow: '0 0 8px rgba(245,158,11,0.2)' },
                        A: { background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.35)', color: '#c084fc' },
                        B: { background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.30)', color: '#93c5fd' },
                        C: { background: 'rgba(113,113,122,0.15)', borderColor: 'rgba(113,113,122,0.35)', color: '#a1a1aa' },
                      }[t] ?? {}
                    )
                    : {}
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Division tabs */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
        <div className="flex gap-1.5 min-w-max">
          {DIVISIONS.map((div) => {
            const isActive = division === div
            return (
              <button
                key={div}
                onClick={() => setDivision(div)}
                className={cn(
                  'shrink-0 h-7 px-3 text-xs font-medium rounded-full border transition-all duration-200',
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-600 hover:text-zinc-300 hover:border-white/[0.12]'
                )}
              >
                {formatDivision(div)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-zinc-600">
          {agents.length} agent{agents.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Agent grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl border border-white/[0.06] animate-pulse"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-white/[0.06] mb-4"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <Search className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-zinc-500 text-sm">No agents found</p>
          <p className="text-zinc-700 text-xs mt-1">Try a different search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}
