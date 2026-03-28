import { cn } from '@/lib/utils'

const TIER_CONFIG = {
  S: {
    classes: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    glow: 'shadow-[0_0_10px_rgba(245,158,11,0.35)]',
  },
  A: {
    classes: 'bg-purple-500/15 border-purple-500/35 text-purple-400',
    glow: '',
  },
  B: {
    classes: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    glow: '',
  },
  C: {
    classes: 'bg-zinc-700/50 border-zinc-600/40 text-zinc-400',
    glow: '',
  },
} as const

interface TierBadgeProps {
  tier: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function TierBadge({ tier, size = 'sm', className }: TierBadgeProps) {
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.C

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold border rounded-md tracking-wider',
        config.classes,
        tier === 'S' && config.glow,
        size === 'xs' && 'px-1.5 py-0 text-[9px]',
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {tier}
    </span>
  )
}
