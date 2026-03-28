import Link from 'next/link'
import { prisma } from '@/lib/db'
import { GlassCard } from '@/components/ui/glass-card'
import { TierBadge } from '@/components/ui/tier-badge'
import { StatCard } from '@/components/ui/stat-card'

export const dynamic = 'force-dynamic'

function formatUSD(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function savingsPct(original: number, price: number) {
  return Math.round(((original - price) / original) * 100)
}

export default async function HomePage() {
  let featuredBundles: Awaited<ReturnType<typeof prisma.bundle.findMany>> = []
  let tierSAgents: Awaited<ReturnType<typeof prisma.agent.findMany>> = []

  try {
    ;[featuredBundles, tierSAgents] = await Promise.all([
      prisma.bundle.findMany({ where: { isFeatured: true }, take: 3 }),
      prisma.agent.findMany({ where: { tier: 'S' } }),
    ])
  } catch {
    // DB may be unavailable at build time
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ backdropFilter: 'blur(24px) saturate(1.5)', background: 'rgba(9,9,11,0.75)' }}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-amber-400 text-lg">⚡</span>
            <span className="font-bold text-white tracking-tight text-base">Agecy</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/agents"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 hover:bg-amber-500/25 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Radial amber glow */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-amber-400/[0.03] blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
            {/* Left: text */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Now in beta · 144+ agents available
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                  The AI agent<br />
                  marketplace for{' '}
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                    Developers
                  </span>
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed max-w-[480px]">
                  Production-ready agents for Claude Code, Cursor, Copilot, Aider, and Windsurf.
                  Install in seconds, ship in minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/dashboard/agents"
                  className="px-6 py-3 text-sm font-semibold rounded-xl
                    bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950
                    hover:from-amber-400 hover:to-amber-300
                    hover:shadow-[0_8px_32px_rgba(245,158,11,0.4)]
                    transition-all duration-300"
                >
                  Browse Agents
                </Link>
                <Link
                  href="/dashboard/bundles"
                  className="px-6 py-3 text-sm font-medium rounded-xl
                    bg-white/[0.04] border border-white/[0.10] text-zinc-300
                    hover:bg-white/[0.07] hover:border-white/[0.16] hover:text-white
                    transition-all duration-200"
                >
                  View Bundles
                </Link>
              </div>
            </div>

            {/* Right: floating agent preview card */}
            <div className="hidden lg:block relative">
              {/* Ambient glow behind card */}
              <div
                className="absolute inset-0 bg-amber-500/10 blur-[60px] rounded-full scale-90 animate-glow-pulse pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="relative rounded-2xl border border-amber-500/25 p-5 animate-float"
                style={{
                  backdropFilter: 'blur(24px) saturate(1.5)',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                }}
              >
                {/* catch-light */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent rounded-t-2xl" aria-hidden="true" />

                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl leading-none">🚀</span>
                  <TierBadge tier="S" size="md" />
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="font-semibold text-white text-sm">Senior Engineer Agent</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Full-stack development with production patterns, code review, and architecture guidance.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['react', 'typescript', 'api-design'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-lg font-bold text-amber-400">$29</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-800/60 border border-zinc-700/40 px-2 py-0.5 rounded-md">
                    ENGINEERING
                  </span>
                </div>

                {/* Second smaller card floating behind */}
                <div
                  className="absolute -bottom-6 -right-8 w-44 rounded-xl border border-white/[0.07] p-3 -z-10 animate-float-sm"
                  style={{
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl leading-none">🎨</span>
                    <TierBadge tier="A" size="xs" />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium">UI Designer Agent</p>
                  <p className="text-[10px] text-amber-400 font-bold mt-1">$19</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: '144+', label: 'Agents' },
            { value: '13', label: 'Divisions' },
            { value: '5', label: 'Tools Supported' },
            { value: '40%+', label: 'Bundle Savings' },
          ].map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* ── Featured Bundles ───────────────────────────────────────────────── */}
      {featuredBundles.length > 0 && (
        <section className="px-5 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
                Curated Bundles
              </span>
              <h2 className="text-3xl font-bold text-white mt-2">Save 40%+ with Bundles</h2>
              <p className="text-zinc-500 mt-1.5 text-sm">Handpicked collections for every use case</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredBundles.map((bundle) => {
                const savings = savingsPct(bundle.originalPriceUSD, bundle.priceUSD)
                return (
                  <Link key={bundle.id} href={`/dashboard/bundles/${bundle.slug}`}>
                    <GlassCard variant="glow" hover className="p-5 h-full flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span className="text-3xl leading-none">{bundle.emoji}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                          {savings}% off
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{bundle.name}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed flex-1 line-clamp-2">
                        {bundle.tagline}
                      </p>
                      <div className="flex items-baseline gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                        <span className="text-base font-bold text-amber-400">
                          {formatUSD(bundle.priceUSD)}
                        </span>
                        <span className="text-xs text-zinc-600 line-through">
                          {formatUSD(bundle.originalPriceUSD)}
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Tier S Showcase ────────────────────────────────────────────────── */}
      {tierSAgents.length > 0 && (
        <section className="px-5 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    Tier S
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white">Premium Agents</h2>
                <p className="text-zinc-500 mt-1.5 text-sm">
                  The most capable, production-tested agents in the marketplace
                </p>
              </div>
              <Link
                href="/dashboard/agents"
                className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tierSAgents.map((agent) => (
                <Link key={agent.id} href={`/dashboard/agents/${agent.slug}`}>
                  <GlassCard variant="premium" hover className="p-4 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl leading-none">{agent.emoji}</span>
                      <TierBadge tier="S" />
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-snug mb-1.5">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">
                      {agent.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/[0.05]">
                      <span className="text-sm font-bold text-amber-400">
                        {agent.priceUSD ? formatUSD(agent.priceUSD) : 'Free'}
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="px-5 py-24 relative">
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Simple Process
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div
              className="hidden sm:block absolute top-9 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px"
              style={{
                background:
                  'linear-gradient(90deg, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0.1) 50%, rgba(245,158,11,0.3) 100%)',
              }}
              aria-hidden="true"
            />
            {[
              {
                step: '1',
                title: 'Browse & Choose',
                desc: 'Filter 144+ agents by division, tier, and tool compatibility. Find exactly what you need.',
              },
              {
                step: '2',
                title: 'One-Click Purchase',
                desc: 'Secure checkout with Stripe or Razorpay. Buy individual agents or save with bundles.',
              },
              {
                step: '3',
                title: 'Install & Ship',
                desc: 'Drop into Claude Code, Cursor, or any MCP-compatible tool. Ready to ship immediately.',
              },
            ].map((item, i) => (
              <div key={item.step} className="text-center space-y-4 relative">
                <div
                  className="w-[72px] h-[72px] mx-auto rounded-2xl flex items-center justify-center text-lg font-bold relative"
                  style={{
                    backdropFilter: 'blur(24px)',
                    background:
                      i === 1
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.08) 100%)'
                        : 'rgba(255,255,255,0.04)',
                    border: i === 1 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: i === 1 ? '0 0 24px rgba(245,158,11,0.15)' : undefined,
                    color: i === 1 ? '#F59E0B' : '#a1a1aa',
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="px-5 py-10">
        <div
          className="max-w-6xl mx-auto rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/[0.06]"
          style={{ backdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span className="font-bold text-white text-sm">Agecy</span>
            </div>
            <p className="text-xs text-zinc-600 mt-1">Built for developers who ship with AI</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-zinc-600">
            <a href="https://github.com" className="hover:text-zinc-400 transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com" className="hover:text-zinc-400 transition-colors">
              Twitter
            </a>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
