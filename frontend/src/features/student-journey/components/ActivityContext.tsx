import { ArrowLeft, ArrowRight, Layers3 } from 'lucide-react'
import type { Activity, JourneySnapshot } from '../types'
import { getActivityBlockContext } from '../services/activity-context'
import { StatusBadge } from './StatusBadge'

export function ActivityContext({ activity, snapshot, onBlock }: { activity: Activity; snapshot: JourneySnapshot; onBlock?: (id: string) => void }) {
  const context = getActivityBlockContext(snapshot, activity.id)
  const groups = [
    { label: 'Bloco anterior', block: context.previous, icon: ArrowLeft, selected: false, empty: 'Este é o primeiro bloco do roteiro.' },
    { label: 'Bloco seleccionado', block: context.current, icon: Layers3, selected: true, empty: 'Bloco não encontrado.' },
    { label: 'Próximo bloco', block: context.next, icon: ArrowRight, selected: false, empty: 'Este é o último bloco do roteiro.' },
  ]
  return <section aria-label="Blocos em contexto" className="mt-6">
    <h3 className="font-semibold mb-3">Esta actividade em contexto</h3>
    <div className="student-context-grid grid gap-3 sm:grid-cols-3">{groups.map(({ label, block, icon: Icon, selected, empty }) => {
      return <div key={label} className={'student-context-card' + (selected ? ' student-context-card--current' : '')}>
        <div className="student-context-header">
          <p className="student-context-label"><Icon size={18} aria-hidden />{label}</p>
          {block && (block.activities.length ? <StatusBadge status={block.state} /> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Brevemente</span>)}
        </div>
        {block ? <>
          <button type="button" className="student-context-link" disabled={!onBlock} aria-label={`Ver bloco: ${block.title}`} onClick={() => onBlock?.(block.id)}>{block.title}</button>
          <p className="mb-3 text-xs text-slate-500">{block.description}</p>
          {!block.activities.length && <p className="mt-3 text-xs text-slate-500">Sem actividades definidas. Não contabilizado no progresso.</p>}
        </> : <p className="text-xs text-slate-500">{empty}</p>}
      </div>
    })}</div>
  </section>
}
