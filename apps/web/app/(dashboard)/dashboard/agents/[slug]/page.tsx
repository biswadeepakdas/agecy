export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { checkOwnership } from '@/lib/ownership'
import { Badge } from '@/components/ui/badge'
import { AgentPricingCard } from '@/components/agents/AgentPricingCard'

const TIER_STYLES: Record<string, string> = {
  S: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  A: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  B: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  C: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
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

  const owned = session?.user?.id
    ? await checkOwnership(session.user.id, slug)
    : false

  const tierStyle = TIER_STYLES[agent.tier] ?? TIER_STYLES.C

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to agents
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl leading-none">{agent.emoji}</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={tierStyle}>{agent.tier}</Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                  {formatDivision(agent.division)}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
            </div>
          </div>

          <p className="text-zinc-400 leading-relaxed">{agent.description}</p>

          <p className="text-xs text-zinc-500">File size: {formatFileSize(agent.fileSize)}</p>

          {agent.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-zinc-800 text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {agent.tools.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Works with</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-zinc-800/50 border border-zinc-700 text-zinc-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing */}
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
