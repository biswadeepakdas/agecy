import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export function GlassInput({ className, icon, ...props }: GlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'w-full rounded-xl px-4 py-2.5 text-sm text-zinc-100',
          'bg-white/[0.04] border border-white/[0.08]',
          'placeholder:text-zinc-600',
          'outline-none ring-0',
          'focus:border-amber-500/40 focus:bg-white/[0.06]',
          'transition-all duration-200',
          icon && 'pl-9',
          className
        )}
        style={{ backdropFilter: 'blur(16px)' }}
        {...props}
      />
    </div>
  )
}
