import type { Activity, JourneySnapshot } from '../types'
import { getActivityStatus } from '../services/journey.selectors'
import { StatusBadge } from './StatusBadge'
import { ArrowLeft, ArrowRight, Settings2 } from 'lucide-react'
import { ParticipantInfo } from './ParticipantInfo'
import { getActivityCriteria } from '../services/activity.presentation'
import { getActivityContext } from '../services/activity-context'
export function ActivityContext({ activity, snapshot, onActivity }: { activity: Activity; snapshot: JourneySnapshot; onActivity?: (id: string) => void }) {
  const context = getActivityContext(snapshot, activity.id)
  const groups = [
    { label: 'Actividade anterior', item: context.previous, icon: ArrowLeft, current: false, empty: 'Esta é a primeira actividade do roteiro.' },
    { label: 'Actividade actual', item: context.current, icon: Settings2, current: true, empty: 'Actividade não encontrada.' },
    { label: 'Próxima actividade', item: context.next, icon: ArrowRight, current: false, empty: 'Não há outra actividade definida no roteiro.' },
  ]
  return <section aria-label="Actividades em contexto" className="mt-6">
    <h3 className="font-semibold mb-3">Esta actividade em contexto</h3>
    <div className="student-context-grid grid gap-3 sm:grid-cols-3">{groups.map(group => {
      const item = group.item?.activity
      const criteria = item ? getActivityCriteria(item, snapshot) : undefined
      return <div key={group.label} className={'student-context-card' + (group.current ? ' student-context-card--current' : '')}>
      <p className="student-context-label"><group.icon size={18} aria-hidden />{group.label}</p>
      {item && criteria ? <div className="student-context-item"><p className="mb-2 text-xs text-slate-500">{group.item?.blockTitle}</p><div className="student-context-heading"><button type="button" className="student-context-link" disabled={group.current || !onActivity} aria-current={group.current ? 'page' : undefined} onClick={() => onActivity?.(item.id)}>{item.title}</button></div><div className="flex flex-wrap items-center gap-2"><StatusBadge status={getActivityStatus(item, snapshot)} />{criteria.total > 0 && <span className="text-xs text-slate-600" aria-label={`${criteria.confirmed} de ${criteria.total} tarefas concluídas`}>({criteria.confirmed} de {criteria.total})</span>}</div>
          <section aria-label={`Participantes: ${item.title}`} className="mt-4 border-t border-slate-200 pt-3">
            <ParticipantInfo participants={item.simulatedParticipants ?? []} />
          </section>
        </div> : <p className="text-xs text-slate-500">{group.empty}</p>}
    </div>})}</div>
    <p className="mt-2 text-xs text-slate-500">Participantes fictícios para validar a interface. A identificação e a participação reais serão definidas na integração com o simulador.</p>
  </section>
}
