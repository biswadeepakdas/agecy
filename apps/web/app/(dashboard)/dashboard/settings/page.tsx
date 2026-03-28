export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { GlassCard } from '@/components/ui/glass-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Shield } from 'lucide-react'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = session.user

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <GlassCard className="overflow-visible">
        <div className="p-6 space-y-5">
          {/* Section header */}
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <User className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Profile</span>
          </div>

          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 shrink-0">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User'} />
                <AvatarFallback className="bg-amber-500/15 text-amber-400 font-bold text-lg border border-amber-500/20">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              {/* Ambient glow for avatar */}
              <div className="absolute -inset-1 rounded-full bg-amber-500/[0.07] blur-md -z-10" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-white text-base">{user.name ?? 'Unknown'}</p>
              <p className="text-sm text-zinc-500">{user.email ?? 'No email'}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                Free Plan
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2 pt-1">
            {[
              {
                icon: User,
                label: 'Display name',
                value: user.name ?? '—',
              },
              {
                icon: Mail,
                label: 'Email address',
                value: user.email ?? '—',
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span className="text-xs text-zinc-500">{label}</span>
                </div>
                <span className="text-xs text-zinc-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Account security */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Shield className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Authentication</span>
        </div>
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="text-xs text-zinc-500">Connected via GitHub OAuth</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Active
          </span>
        </div>
      </GlassCard>
    </div>
  )
}
