import type { Activity, JourneySnapshot } from '../types'
import { getActivityStatus } from '../services/journey.selectors'
import { StatusBadge } from './StatusBadge'
import { Button } from '@/shared/components/ui/button'
export function ActivityContext({ activity, snapshot, onActivity, onCurrentActivity }: { activity: Activity; snapshot: JourneySnapshot; onActivity?: (id: string) => void; onCurrentActivity?: () => void }) {
  const all = snapshot.blocks.flatMap(b => b.activities)
  const groups = [
    { label: 'Vem de', ids: activity.previousIds ?? [] },
    { label: 'Actividade actual', ids: [activity.id] },
    { label: 'Desbloqueia', ids: activity.nextIds ?? [] },
  ]
  return <section aria-label="Actividades em contexto" className="mt-6">
    <h3 className="font-semibold mb-3">Esta actividade em contexto</h3>
    <div className="grid gap-3 sm:grid-cols-3">{groups.map(group => <div key={group.label} className="rounded-md border bg-slate-50 p-4">
      <p className="text-xs text-slate-500 mb-3">{group.label}</p>
      {group.ids.length ? group.ids.map(id => {
        const item = all.find(a => a.id === id)
        if (!item) return null
        const status = getActivityStatus(item, snapshot)
        const label = status === 'completed' || status === 'blocked' ? 'Ver' : status === 'in-progress' ? 'Continuar actividade' : 'Iniciar actividade'
        const current = id === activity.id
        return <div key={id} className="mb-4"><button type="button" className="text-left text-sm font-semibold text-blue-700 underline mb-2 disabled:no-underline disabled:text-slate-800" disabled={current || !onActivity} aria-current={current ? 'page' : undefined} onClick={() => onActivity?.(id)}>{item.title}</button><div><StatusBadge status={status} /></div><Button variant="outline" className="mt-3" aria-label={`${label}: ${item.title}`} disabled={current ? !onCurrentActivity : !onActivity} onClick={() => current ? onCurrentActivity?.() : onActivity?.(id)}>{label}</Button></div>
      }) : <p className="text-xs text-slate-500">Sem ligação definida.</p>}
    </div>)}</div>
    <section aria-label="Participantes da actividade" className="mt-5">
      <div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold">Participantes da actividade</h4><span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">Dados simulados</span></div>
      {activity.simulatedParticipants?.length ? <ul className="mt-3 grid gap-3 sm:grid-cols-3">{activity.simulatedParticipants.map(person => <li key={person.name} className="rounded-md border border-slate-200 p-4"><p className="text-sm font-semibold">{person.name}</p><p className="mt-1 text-sm text-slate-600">{person.contribution}</p></li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Sem participantes simulados nesta actividade.</p>}
      <p className="mt-2 text-xs text-slate-500">Exemplo fictício para validar a interface. A identificação e a participação reais serão definidas na integração com o simulador.</p>
    </section>
  </section>
}
