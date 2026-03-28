'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Package, Library, Settings, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard/agents', label: 'Agents', icon: Bot },
  { href: '/dashboard/bundles', label: 'Bundles', icon: Package },
  { href: '/dashboard/library', label: 'Library', icon: Library },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/cli-auth', label: 'CLI Auth', icon: Terminal },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-0.5 px-2 py-3">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              isActive
                ? [
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                    'shadow-[inset_0_1px_0_rgba(245,158,11,0.1)]',
                  ]
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
            )}
          >
            <Icon
              className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-400' : 'text-zinc-600')}
            />
            <span>{label}</span>
            {isActive && (
              <div className="ml-auto w-1 h-3.5 rounded-full bg-amber-400/50" aria-hidden="true" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
