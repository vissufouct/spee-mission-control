import { Check, Clock3, LockKeyhole, Play, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { getBlockSummary } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'
export function BlockSummary({ snapshot, onFullPath }: { snapshot: JourneySnapshot; onFullPath: () => void }) {
  const summary = getBlockSummary(snapshot)
  const entries = [
    { count: summary.completed, label: summary.completed === 1 ? 'concluída' : 'concluídas', icon: Check, style: 'bg-emerald-600 text-white' },
    { count: summary.inProgress, label: 'em curso', icon: Clock3, style: 'bg-amber-500 text-white' },
    { count: summary.available, label: summary.available === 1 ? 'disponível' : 'disponíveis', icon: Play, style: 'bg-cyan-50 text-cyan-700' },
    { count: summary.blocked, label: summary.blocked === 1 ? 'bloqueada' : 'bloqueadas', icon: LockKeyhole, style: 'bg-slate-100 text-slate-500' },
  ]
  return <aside className="spee-panel self-start p-5" aria-label="Resumo do bloco"><h2 className="mb-5 text-lg font-semibold">Resumo do bloco</h2>
    <ul className="space-y-4">{entries.map(({ label, count, icon: Icon, style }) => <li key={label} className="flex items-center gap-4"><span className={`grid size-9 place-items-center rounded-full ${style}`}><Icon size={19} /></span><span>{count} {label}</span></li>)}</ul>
    <div className="mt-6 border-t pt-5"><Button variant="outline" className="w-full" onClick={onFullPath}>Ver percurso completo <ChevronRight /></Button></div>
  </aside>
}
