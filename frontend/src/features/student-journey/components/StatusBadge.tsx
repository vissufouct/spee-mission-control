import { Ban, Check, Clock3, LockKeyhole, Play } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { ActivityStatus } from '../types'
const states = {
  completed: { label: 'Concluído', icon: Check, style: 'bg-emerald-50 text-emerald-800', circle: 'bg-emerald-600 text-white' },
  'in-progress': { label: 'Em curso', icon: Clock3, style: 'bg-amber-50 text-amber-800', circle: 'bg-amber-500 text-white' },
  available: { label: 'Disponível', icon: Play, style: 'bg-cyan-50 text-cyan-800', circle: 'bg-cyan-100 text-cyan-700' },
  blocked: { label: 'Bloqueado', icon: LockKeyhole, style: 'bg-slate-100 text-slate-600', circle: 'bg-slate-200 text-slate-600' },
  unavailable: { label: 'Não disponível', icon: Ban, style: 'bg-slate-100 text-slate-600', circle: 'bg-slate-200 text-slate-600' },
}
export function StatusBadge({ status, compact = false }: { status: ActivityStatus; compact?: boolean }) {
  const normalized = status === 'not-started' || status === 'unavailable' ? 'available' : status === 'returned' ? 'in-progress' : status
  const { icon: Icon, style, circle } = states[normalized]
  const label = normalized === 'available' ? 'Por iniciar' : states[normalized].label
  return <span className={cn('inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap', style)}>
    <span className={cn('grid size-5 place-items-center rounded-full', circle)}><Icon size={13} aria-hidden /></span>
    {compact ? <span className="sr-only">{label}</span> : label}
  </span>
}
