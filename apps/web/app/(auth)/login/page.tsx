export const dynamic = 'force-dynamic'

import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#09090B' }}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[100px]" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Agecy</h1>
            <p className="text-zinc-500 text-sm mt-0.5">The AI agent marketplace for developers</p>
          </div>
        </div>

        {/* Glass card */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.08] p-6 space-y-5"
          style={{
            backdropFilter: 'blur(24px) saturate(1.5)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          {/* Catch-light */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" aria-hidden="true" />

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Sign in</h2>
            <p className="text-xs text-zinc-500">Connect with GitHub to access your agents</p>
          </div>

          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/dashboard/agents' })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-medium
                bg-white/[0.06] border border-white/[0.10] text-zinc-200
                hover:bg-white/[0.10] hover:border-white/[0.16] hover:text-white
                transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  )
}
