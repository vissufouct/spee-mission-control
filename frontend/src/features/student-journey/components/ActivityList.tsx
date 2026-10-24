import { CalendarDays, FileCheck2, FilePenLine, Info, UsersRound } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { getActivityStatus } from '../services/journey.selectors'
import type { Activity, JourneySnapshot } from '../types'
export type ActivityFilter = 'all' | 'not-started' | 'in-progress' | 'blocked' | 'completed'
const filters: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: 'Todas' }, { value: 'not-started', label: 'Por iniciar' }, { value: 'completed', label: 'Concluídas' },
  { value: 'in-progress', label: 'Em curso' }, { value: 'blocked', label: 'Bloqueadas' },
]
const icons = { 'reserva-nome': FileCheck2, 'registar-empresa': FilePenLine, 'convidar-socios': UsersRound, 'inicio-actividades': CalendarDays }
export function ActivityList({ activities, snapshot, filter, onFilter, onOpen }: {
  activities: Activity[]; snapshot: JourneySnapshot; filter: ActivityFilter; onFilter: (filter: ActivityFilter) => void; onOpen: (activity: Activity) => void
}) {
  const visible = activities.filter(activity => filter === 'all' || getActivityStatus(activity, snapshot) === filter)
  return <section className="spee-panel p-5">
    <h2 className="mb-4 text-lg font-semibold">Actividades deste bloco</h2>
    <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar actividades por estado">{filters.map(item => <button key={item.value} onClick={() => onFilter(item.value)} aria-pressed={filter === item.value} className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${filter === item.value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{item.label}</button>)}</div>
    {visible.length === 0 ? <div className="py-10 text-center"><p className="font-medium">Não existem actividades neste estado.</p><Button variant="ghost" onClick={() => onFilter('all')} className="mt-2">Mostrar todas as actividades</Button></div> :
      <ul className="divide-y divide-slate-100">{visible.map(activity => {
        const status = getActivityStatus(activity, snapshot)
        const Icon = icons[activity.id as keyof typeof icons] ?? FileCheck2
        const blocked = status === 'blocked' || status === 'unavailable'
        return <li key={activity.id} className="journey-activity-row">
          <span className={`grid size-11 shrink-0 place-items-center rounded-full ${status === 'completed' ? 'bg-emerald-50 text-emerald-700' : status === 'in-progress' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-cyan-700'}`}><Icon size={23} /></span>
          <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{activity.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{activity.description}</p>{activity.reason && <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500"><Info size={13} />{activity.reason}</p>}</div>
          <StatusBadge status={status} />
          <Button onClick={() => onOpen(activity)} variant={status === 'completed' || blocked ? 'outline' : 'default'} size="sm" className="journey-activity-action" aria-label={`${status === 'completed' ? 'Ver' : blocked ? 'Consultar bloqueio de' : status === 'in-progress' ? 'Continuar' : 'Iniciar'} ${activity.title}`}>
            {status === 'completed' ? 'Ver' : blocked ? 'Ver condição' : status === 'in-progress' ? 'Continuar' : 'Iniciar actividade'}
          </Button>
        </li>
      })}</ul>}
  </section>
}
