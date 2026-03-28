import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl px-6 py-7 text-center overflow-hidden',
        'bg-white/[0.03] border border-white/[0.08]',
        className
      )}
      style={{ backdropFilter: 'blur(24px) saturate(1.5)' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden="true"
      />
      <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-xs text-zinc-500 uppercase tracking-widest">{label}</div>
    </div>
  )
}
