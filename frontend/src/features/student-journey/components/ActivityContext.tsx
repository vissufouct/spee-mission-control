import { ArrowLeft, ArrowRight, Layers3 } from 'lucide-react'
import type { Activity, JourneySnapshot } from '../types'
import { getActivityStatus } from '../services/journey.selectors'
import { getActivityCriteria } from '../services/activity.presentation'
import { getActivityBlockContext } from '../services/activity-context'
import { StatusBadge } from './StatusBadge'
import { BlockProgressBar } from './BlockProgressBar'
import { ParticipantInfo } from './ParticipantInfo'

export function ActivityContext({ activity, snapshot, onBlock }: { activity: Activity; snapshot: JourneySnapshot; onBlock?: (id: string) => void }) {
  const context = getActivityBlockContext(snapshot, activity.id)
  const criteria = getActivityCriteria(activity, snapshot)
  const groups = [
    { label: 'Bloco anterior', block: context.previous, icon: ArrowLeft, selected: false, empty: 'Este é o primeiro bloco do roteiro.' },
    { label: 'Bloco seleccionado', block: context.current, icon: Layers3, selected: true, empty: 'Bloco não encontrado.' },
    { label: 'Próximo bloco', block: context.next, icon: ArrowRight, selected: false, empty: 'Este é o último bloco do roteiro.' },
  ]
  return <section aria-label="Blocos em contexto" className="mt-6">
    <h3 className="font-semibold mb-3">Esta actividade em contexto</h3>
    <div className="student-context-grid grid gap-3 sm:grid-cols-3">{groups.map(({ label, block, icon: Icon, selected, empty }) => {
      const activities = block?.activities.map(item => ({ id: item.id, title: item.title, status: getActivityStatus(item, snapshot) })) ?? []
      const completed = activities.filter(item => item.status === 'completed').length
      return <div key={label} className={'student-context-card' + (selected ? ' student-context-card--current' : '')}>
        <p className="student-context-label"><Icon size={18} aria-hidden />{label}</p>
        {block ? <>
          <button type="button" className="student-context-link" disabled={!onBlock} aria-label={`Ver bloco: ${block.title}`} onClick={() => onBlock?.(block.id)}>{block.title}</button>
          <p className="mb-3 text-xs text-slate-500">{block.description}</p>
          {activities.length ? <>
            <StatusBadge status={block.state} />
            <p className="my-2 text-xs text-slate-600">{completed} de {activities.length} actividades concluídas</p>
            <BlockProgressBar activities={activities} />
          </> : <><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Brevemente</span><p className="mt-3 text-xs text-slate-500">Sem actividades definidas. Não contabilizado no progresso.</p></>}
          {selected && <div className="student-context-item mt-4 border-t border-slate-200 pt-3">
            <p className="mb-1 text-xs text-slate-500">Actividade seleccionada</p>
            <p className="mb-2 text-sm font-semibold">{activity.title}</p>
            <div className="flex flex-wrap items-center gap-2"><StatusBadge status={getActivityStatus(activity, snapshot)} />{criteria.total > 0 && <span className="text-xs text-slate-600" aria-label={`${criteria.confirmed} de ${criteria.total} tarefas concluídas`}>({criteria.confirmed} de {criteria.total})</span>}</div>
            <section aria-label={`Participantes: ${activity.title}`} className="mt-4 border-t border-slate-200 pt-3"><ParticipantInfo participants={activity.simulatedParticipants ?? []} /></section>
          </div>}
        </> : <p className="text-xs text-slate-500">{empty}</p>}
      </div>
    })}</div>
    <p className="mt-2 text-xs text-slate-500">Participantes fictícios para validar a interface. A identificação e a participação reais serão definidas na integração com o simulador.</p>
  </section>
}
