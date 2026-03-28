"use client"

import { useState, useEffect } from 'react'
import type { Agent } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AgentCard } from '@/components/agents/AgentCard'
import { Search, SlidersHorizontal } from 'lucide-react'

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
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Agents</h1>
        <p className="text-zinc-400 text-sm mt-1">Browse and install AI agents for your dev tools</p>
      </div>

      {/* Search + Tier filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <Input
            placeholder="Search agents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0" />
          <div className="flex gap-1.5">
            {TIERS.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={tier === t ? 'default' : 'outline'}
                onClick={() => setTier(tier === t ? null : t)}
                className={
                  tier === t
                    ? 'bg-zinc-700 text-white border-zinc-600 h-8 px-2.5 text-xs'
                    : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white h-8 px-2.5 text-xs'
                }
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Division tabs (scrollable) */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-1.5 min-w-max pb-1">
          {DIVISIONS.map((div) => (
            <Button
              key={div}
              size="sm"
              variant="ghost"
              onClick={() => setDivision(div)}
              className={
                division === div
                  ? 'bg-zinc-800 text-white h-7 px-3 text-xs rounded-full shrink-0'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 h-7 px-3 text-xs rounded-full shrink-0'
              }
            >
              {formatDivision(div)}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-zinc-500">
          {agents.length} agent{agents.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Agent grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-sm">No agents found</p>
          <p className="text-zinc-600 text-xs mt-1">Try a different search or division filter</p>
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
