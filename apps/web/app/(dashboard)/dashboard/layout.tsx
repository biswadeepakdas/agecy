export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { SidebarNav } from './sidebar-nav'

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-amber-400 text-lg">⚡</span>
          <span className="font-bold text-white tracking-tight">Agecy</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-auto py-2">
        <SidebarNav />
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const user = session.user

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#09090B' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 border-r border-white/[0.06] shrink-0 relative"
        style={{
          backdropFilter: 'blur(24px) saturate(1.2)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {/* Right-edge catch-light */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent pointer-events-none" aria-hidden="true" />

        <SidebarContent />

        {/* User pill at bottom */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xs font-semibold">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-zinc-600 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
        style={{ backdropFilter: 'blur(24px)', background: 'rgba(9,9,11,0.85)' }}
      >
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-zinc-500 hover:text-zinc-200 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05]">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-56 p-0 border-white/[0.08]"
            style={{ background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(24px)' }}
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-1.5 font-bold text-white">
          <span className="text-amber-400">⚡</span>
          <span>Agecy</span>
        </Link>
        <div className="ml-auto">
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ''} />
            <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-[57px]">
        {children}
      </main>
    </div>
  )
}
