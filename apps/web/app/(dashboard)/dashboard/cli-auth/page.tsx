export const dynamic = 'force-dynamic'

import crypto from 'crypto'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { redis } from '@/lib/redis'
import { GlassCard } from '@/components/ui/glass-card'
import { Terminal, RefreshCw, Clock } from 'lucide-react'

export default async function CliAuthPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  if (!redis) redirect('/dashboard')

  const token = crypto.randomBytes(32).toString('hex')
  await redis.set(`cli-token:${token}`, session.user.id, { ex: 600 })

  const command = `agecy auth --token ${token}`

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">CLI Authentication</h1>
        <p className="text-zinc-500 text-sm mt-1">Generate a one-time token to authenticate the Agecy CLI</p>
      </div>

      {/* Token card */}
      <GlassCard className="p-6 space-y-5">
        {/* Icon + title */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-500/20"
            style={{ background: 'rgba(245,158,11,0.08)' }}
          >
            <Terminal className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Your One-Time Token</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-500/80">Expires in 10 minutes</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed">
          Run the command below in your terminal to authenticate. This token is single-use and expires after 10 minutes.
        </p>

        {/* Code block */}
        <div
          className="relative rounded-xl border border-white/[0.08] overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          {/* Bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[10px] text-zinc-700 font-mono">terminal</span>
          </div>
          <div className="px-4 py-4 font-mono text-sm">
            <span className="text-zinc-600 select-none">$ </span>
            <span className="text-emerald-400 break-all">{command}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/cli-auth"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium
              bg-white/[0.04] border border-white/[0.08] text-zinc-400
              hover:bg-white/[0.07] hover:text-zinc-300 transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Token
          </a>
          <p className="text-xs text-zinc-600">Select the command above to copy it</p>
        </div>

        <p className="text-xs text-zinc-700">
          Refresh this page to generate a new token. Tokens can only be used once.
        </p>
      </GlassCard>

      {/* How it works */}
      <GlassCard className="p-5 space-y-3">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">How it works</h3>
        <div className="space-y-2.5">
          {[
            { n: '1', text: 'Install the CLI: npm install -g agecy' },
            { n: '2', text: 'Run the auth command above in your terminal' },
            { n: '3', text: 'Use agecy install <slug> to install agents' },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.07] text-[10px] font-bold text-zinc-500 flex items-center justify-center shrink-0 mt-0.5">
                {step.n}
              </span>
              <p className="text-xs text-zinc-500 font-mono">{step.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
