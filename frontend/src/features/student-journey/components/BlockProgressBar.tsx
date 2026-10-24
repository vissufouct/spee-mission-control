import type { ActivityStatus } from '../types'

const states = {
  completed: { label: 'Concluído', colour: 'bg-emerald-600' },
  'in-progress': { label: 'Em curso', colour: 'bg-amber-500' },
  'not-started': { label: 'Por iniciar', colour: 'bg-cyan-100' },
  blocked: { label: 'Bloqueado', colour: 'bg-slate-200' },
}
export function BlockProgressBar({ activities }: { activities: { id: string; title: string; status: ActivityStatus }[] }) {
  const completed = activities.filter(activity => activity.status === 'completed').length
  const segments = activities.map(activity => {
    const status = activity.status === 'returned' ? 'in-progress' : activity.status === 'available' || activity.status === 'unavailable' ? 'not-started' : activity.status
    return { ...activity, ...states[status] }
  })
  return <div role="progressbar" aria-label="Progresso do bloco" aria-valuemin={0} aria-valuemax={Math.max(1, activities.length)} aria-valuenow={completed} aria-valuetext={segments.length ? `${completed} de ${segments.length} actividades concluídas. ${segments.map(segment => `${segment.title}: ${segment.label}`).join('; ')}` : 'Sem actividades neste bloco'} className="flex h-3 w-full gap-1 overflow-hidden rounded-full bg-slate-100">
    {segments.map(segment => <span key={segment.id} title={`${segment.title}: ${segment.label}`} aria-hidden="true" className={`min-w-0 flex-1 ${segment.colour}`} />)}
  </div>
}
