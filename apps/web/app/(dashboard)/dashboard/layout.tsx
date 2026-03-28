export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Bot, Package, Library, Settings, Terminal, Menu,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/dashboard/agents', label: 'Agents', icon: Bot },
  { href: '/dashboard/bundles', label: 'Bundles', icon: Package },
  { href: '/dashboard/library', label: 'Library', icon: Library },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/cli-auth', label: 'CLI Auth', icon: Terminal },
]

function SidebarContent({ pathname }: { pathname?: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <span>⚡</span>
          <span>Agecy</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
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
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-zinc-800 bg-zinc-900/50 shrink-0">
        <SidebarContent />
        {/* User info at bottom */}
        <div className="px-3 py-4 border-t border-zinc-800">
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="bg-zinc-700 text-zinc-200 text-xs">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white w-8 h-8">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0 bg-zinc-900 border-zinc-800">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href="/" className="font-bold text-white">⚡ Agecy</Link>
        <div className="ml-auto">
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ''} />
            <AvatarFallback className="bg-zinc-700 text-zinc-200 text-xs">
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
