import { ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlockProgressBar } from './BlockProgressBar'
import { StatusBadge } from './StatusBadge'
import { getActivityStatus, journeyPaths } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'

export function FullJourneyBlock({ block, index, snapshot, onActivity }: {
  block: JourneySnapshot['blocks'][number]; index: number; snapshot: JourneySnapshot; onActivity: (id: string) => void
}) {
  const current = block.id === snapshot.context.currentBlockId
  const activities = block.activities.map(activity => ({ ...activity, status: getActivityStatus(activity, snapshot) }))
  const completed = activities.filter(activity => activity.status === 'completed').length
  return <details className={`student-full-block group${current ? ' student-full-block--current' : ''}`} open={current ? true : undefined}>
    <summary className="student-full-block-summary">
      <span className="student-full-block-number">{index + 1}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><Link onClick={event => event.stopPropagation()} to={journeyPaths.home + '?bloco=' + block.id} className="student-full-block-title">{block.title}</Link>{current && <span className="student-full-current-label">Bloco actual</span>}</div>
        <p className="mt-1 text-xs text-slate-500">{block.description}</p>
        <p className="mb-2 mt-3 text-xs text-slate-600">{completed} de {activities.length} actividades concluídas</p>
        <BlockProgressBar activities={activities} />
      </div>
      <span className="student-full-block-state"><StatusBadge status={block.state} /><ChevronDown className="shrink-0 group-open:rotate-180" size={18} aria-hidden /></span>
    </summary>
    <ul className="student-full-activities">{activities.map(activity => <li key={activity.id}>
      <button type="button" className="student-full-activity" onClick={() => onActivity(activity.id)}>
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{activity.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{activity.description}</span></span>
        <StatusBadge status={activity.status} /><ChevronRight className="shrink-0 text-blue-600" size={18} aria-hidden />
      </button>
    </li>)}</ul>
    {!activities.length && <p className="px-5 pb-5 text-sm text-slate-500">Sem actividades neste bloco.</p>}
  </details>
}
