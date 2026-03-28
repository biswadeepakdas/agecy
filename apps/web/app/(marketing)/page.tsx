import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    // DB may be unavailable at build time — render with empty data
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">⚡ Agecy</span>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/agents">
              <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                Browse
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-white text-zinc-900 hover:bg-zinc-100">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs px-3 py-1">
            Now in beta · 144+ agents available
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            The AI Agent Marketplace<br />
            <span className="text-zinc-400">for Developers</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Production-ready agents for Claude Code, Cursor, Copilot, Aider, and Windsurf.
            Install in seconds, ship in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/dashboard/agents">
              <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 w-full sm:w-auto px-8">
                Browse Agents
              </Button>
            </Link>
            <Link href="/dashboard/agents?tab=bundles">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 w-full sm:w-auto px-8">
                View Bundles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '144+', label: 'Agents' },
            { value: '13', label: 'Divisions' },
            { value: '5', label: 'Tools Supported' },
            { value: 'Save 40%+', label: 'with Bundles' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Bundles */}
      {featuredBundles.length > 0 && (
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Featured Bundles</h2>
              <p className="text-zinc-400 mt-2">Curated collections that save you 40%+ vs buying individually</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBundles.map((bundle) => {
                const savings = savingsPct(bundle.originalPriceUSD, bundle.priceUSD)
                return (
                  <Link key={bundle.id} href={`/dashboard/bundles/${bundle.slug}`}>
                    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-3xl">{bundle.emoji}</span>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0">
                            {savings}% off
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-white mt-2">{bundle.name}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">{bundle.tagline}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-white">{formatUSD(bundle.priceUSD)}</span>
                          <span className="text-sm text-zinc-500 line-through">{formatUSD(bundle.originalPriceUSD)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="px-4 py-20 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Browse & Choose', desc: 'Filter 144+ agents by division, tier, and tool compatibility. Find exactly what you need.' },
              { step: '2', title: 'One-Click Purchase', desc: 'Secure checkout with Stripe or Razorpay. Buy individual agents or save with bundles.' },
              { step: '3', title: 'Install in Seconds', desc: 'Drop into Claude Code, Cursor, or any MCP-compatible tool. Ready to ship immediately.' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300 mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier S Showcase */}
      {tierSAgents.length > 0 && (
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 mb-4">Tier S</Badge>
              <h2 className="text-3xl font-bold text-white">Premium Agents</h2>
              <p className="text-zinc-400 mt-2">The most capable, production-tested agents in the marketplace</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tierSAgents.map((agent) => (
                <Link key={agent.id} href={`/dashboard/agents/${agent.slug}`}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-500/30 transition-colors cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{agent.emoji}</span>
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">S</Badge>
                      </div>
                      <h3 className="font-semibold text-white text-sm mt-2">{agent.name}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{agent.description}</p>
                      <div className="mt-3">
                        <span className="text-sm font-semibold text-white">
                          {agent.priceUSD ? formatUSD(agent.priceUSD) : 'Free'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">⚡ Agecy</span>
            <p className="text-xs text-zinc-500 mt-1">Built for developers who ship with AI</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <a href="https://github.com" className="hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="https://twitter.com" className="hover:text-zinc-300 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
