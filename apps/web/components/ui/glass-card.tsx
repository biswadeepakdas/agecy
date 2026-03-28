import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glow' | 'premium'
  hover?: boolean
  as?: ElementType
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  hover = false,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'border',
        variant === 'default' && 'bg-white/[0.03] border-white/[0.08]',
        variant === 'glow' && 'bg-white/[0.04] border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.08)]',
        variant === 'premium' &&
          'bg-gradient-to-br from-amber-500/[0.07] to-white/[0.02] border-amber-500/25 shadow-[0_0_40px_rgba(245,158,11,0.12)]',
        hover && [
          'cursor-pointer transition-all duration-300 ease-out',
          'hover:bg-white/[0.05] hover:border-white/[0.14]',
          'hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.45)]',
        ],
        variant === 'glow' && hover && 'hover:shadow-[0_24px_48px_rgba(245,158,11,0.12)]',
        variant === 'premium' && hover && 'hover:shadow-[0_24px_48px_rgba(245,158,11,0.2)] hover:border-amber-500/35',
        className
      )}
      style={{ backdropFilter: 'blur(24px) saturate(1.5)' }}
    >
      {/* Top edge catch-light */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </Tag>
  )
}
