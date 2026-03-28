export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, HardDrive, Layers, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { checkOwnership } from '@/lib/ownership'
import { GlassCard } from '@/components/ui/glass-card'
import { TierBadge } from '@/components/ui/tier-badge'
import { AgentPricingCard } from '@/components/agents/AgentPricingCard'

const TOOL_STYLES: Record<string, string> = {
  'Claude Code': 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  'Cursor': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  'Copilot': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  'Aider': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  'Windsurf': 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
}

function formatDivision(div: string) {
  return div.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  const agent = await prisma.agent.findUnique({ where: { slug } })
  if (!agent) notFound()

  const owned = session?.user?.id ? await checkOwnership(session.user.id, slug) : false

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to agents
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero block */}
          <GlassCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <span className="text-5xl leading-none">{agent.emoji}</span>
                {agent.tier === 'S' && (
                  <div className="absolute -inset-2 rounded-full bg-amber-500/10 blur-md -z-10" aria-hidden="true" />
                )}
              </div>
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <TierBadge tier={agent.tier} size="md" />
                  <span className="text-xs text-zinc-600 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-lg">
                    {formatDivision(agent.division)}
                  </span>
                  {owned && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.15)]">
                      ✓ Owned
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
              </div>
            </div>
          </GlassCard>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm text-zinc-400 leading-relaxed">{agent.description}</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: HardDrive, label: 'File size', value: formatFileSize(agent.fileSize) },
              { icon: Layers, label: 'Division', value: formatDivision(agent.division) },
              { icon: Sparkles, label: 'Tier', value: `Tier ${agent.tier}` },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="relative rounded-xl p-3 border border-white/[0.07] text-center overflow-hidden"
                style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
                <Icon className="w-4 h-4 text-zinc-600 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-zinc-200">{value}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {agent.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium bg-white/[0.04] border border-white/[0.07] text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Works with */}
          {agent.tools.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">Works with</p>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((tool) => {
                  const style = TOOL_STYLES[tool] ?? 'bg-zinc-700/40 border-zinc-600/40 text-zinc-400'
                  return (
                    <span
                      key={tool}
                      className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-medium border ${style}`}
                    >
                      {tool}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: pricing */}
        <div>
          <AgentPricingCard
            agent={{
              id: agent.id,
              name: agent.name,
              isFree: agent.isFree,
              priceUSD: agent.priceUSD,
              priceINR: agent.priceINR,
            }}
            owned={owned}
          />
        </div>
      </div>
    </div>
  )
}
