import type { Activity, JourneySnapshot } from '../types'
import { getActivityStatus } from '../services/journey.selectors'
import { StatusBadge } from './StatusBadge'
import { Button } from '@/shared/components/ui/button'
import { FileCheck2, Settings2, UnlockKeyhole, Users } from 'lucide-react'
export function ActivityContext({ activity, snapshot, onActivity, onCurrentActivity }: { activity: Activity; snapshot: JourneySnapshot; onActivity?: (id: string) => void; onCurrentActivity?: () => void }) {
  const all = snapshot.blocks.flatMap(b => b.activities)
  const groups = [
    { label: 'Vem de', ids: activity.previousIds ?? [], icon: FileCheck2, current: false },
    { label: 'Actividade actual', ids: [activity.id], icon: Settings2, current: true },
    { label: 'Desbloqueia', ids: activity.nextIds ?? [], icon: UnlockKeyhole, current: false },
  ]
  return <section aria-label="Actividades em contexto" className="mt-6">
    <h3 className="font-semibold mb-3">Esta actividade em contexto</h3>
    <div className="student-context-grid grid gap-3 sm:grid-cols-3">{groups.map(group => <div key={group.label} className={'student-context-card' + (group.current ? ' student-context-card--current' : '')}>
      <p className="student-context-label"><group.icon size={18} aria-hidden />{group.label}</p>
      {group.ids.length ? group.ids.map(id => {
        const item = all.find(a => a.id === id)
        if (!item) return null
        const status = getActivityStatus(item, snapshot)
        const label = status === 'completed' || status === 'blocked' ? 'Ver' : status === 'in-progress' ? 'Continuar actividade' : 'Iniciar actividade'
        const current = id === activity.id
        return <div key={id} className="student-context-item"><button type="button" className="student-context-link" disabled={current || !onActivity} aria-current={current ? 'page' : undefined} onClick={() => onActivity?.(id)}>{item.title}</button><div className="flex flex-wrap items-center gap-2"><StatusBadge status={status} />{!!item.simulatedParticipants?.length && <span className="student-demo-badge">Dados simulados</span>}</div>
          <section aria-label={`Participantes: ${item.title}`} className="mt-4 border-t border-slate-200 pt-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><Users size={17} className="text-blue-600" aria-hidden />Participantes</h4>
            {item.simulatedParticipants?.length ? <ul className="mt-2 space-y-3">{item.simulatedParticipants.map(person => <li key={person.name}><p className="text-sm font-semibold">{person.name}</p><p className="mt-1 text-xs leading-5 text-slate-600">{person.contribution}</p></li>)}</ul> : <p className="mt-2 text-xs text-slate-500">Sem participantes simulados nesta actividade.</p>}
          </section>
          <Button variant={current && status !== 'completed' && status !== 'blocked' ? 'default' : 'outline'} className="student-context-action mt-4" aria-label={`${label}: ${item.title}`} disabled={current ? !onCurrentActivity : !onActivity} onClick={() => current ? onCurrentActivity?.() : onActivity?.(id)}>{label}</Button>
        </div>
      }) : <p className="text-xs text-slate-500">Sem ligação definida.</p>}
    </div>)}</div>
    <p className="mt-2 text-xs text-slate-500">Participantes fictícios para validar a interface. A identificação e a participação reais serão definidas na integração com o simulador.</p>
  </section>
}
