import type { Activity, JourneySnapshot } from '../types'
import { getActivityStatus } from '../services/journey.selectors'
import { StatusBadge } from './StatusBadge'
export function ActivityContext({ activity, snapshot, onActivity }: { activity: Activity; snapshot: JourneySnapshot; onActivity?: (id: string) => void }) {
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
        return item ? <div key={id} className="mb-3"><button type="button" className="text-left text-sm font-semibold text-blue-700 underline mb-2 disabled:no-underline disabled:text-slate-800" disabled={id === activity.id || !onActivity} aria-current={id === activity.id ? 'page' : undefined} onClick={() => onActivity?.(id)}>{item.title}</button><div><StatusBadge status={getActivityStatus(item, snapshot)} /></div></div> : null
      }) : <p className="text-xs text-slate-500">Sem ligação definida.</p>}
    </div>)}</div>
    <p className="mt-2 text-xs text-slate-500">A identificação dos participantes será definida na integração com o simulador.</p>
  </section>
}
