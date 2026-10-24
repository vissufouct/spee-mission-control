import { Check, Clock3, LockKeyhole, Play } from 'lucide-react'
import { getBlockSummary } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'
export function BlockSummary({ snapshot, blockId }: { snapshot: JourneySnapshot; blockId?: string }) {
  const summary = getBlockSummary(snapshot, blockId)
  const entries = [
    { count: summary.completed, label: summary.completed === 1 ? 'concluída' : 'concluídas', icon: Check, style: 'bg-emerald-600 text-white' },
    { count: summary.inProgress, label: 'em curso', icon: Clock3, style: 'bg-amber-500 text-white' },
    { count: summary.available, label: 'por iniciar', icon: Play, style: 'bg-cyan-50 text-cyan-700' },
    { count: summary.blocked, label: summary.blocked === 1 ? 'bloqueada' : 'bloqueadas', icon: LockKeyhole, style: 'bg-slate-100 text-slate-500' },
  ]
  return <section className="min-w-0" aria-label="Resumo do bloco"><h3 className="sr-only">Resumo do bloco</h3>
    <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-xs">{entries.map(({ label, count, icon: Icon, style }) => <li key={label} className="flex items-center gap-2"><span className={`grid size-7 shrink-0 place-items-center rounded-full ${style}`}><Icon size={15} aria-hidden /></span><span>{count} {label}</span></li>)}</ul>
  </section>
}
