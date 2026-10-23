import { Bot, FileCheck2, UsersRound } from 'lucide-react'
import type { Company, TeacherEvent } from '../types'
import { formatInstant, statusLabels } from '../services/teacher.selectors'
export function EventTrail({ company, events, onOpen }: { company: Company; events: TeacherEvent[]; onOpen: (activityId: string, resultId?: string) => void }) {
  return <ol className="teacher-timeline">{events.length ? events.map(event => {
    const Icon = event.role === 'system' ? Bot : event.category === 'collective' ? UsersRound : FileCheck2
    const activity = company.activities.find(a => a.id === event.activityId)!
    return <li key={event.id}><span className="teacher-event-icon"><Icon size={17} /></span><div><p><strong>{event.role === 'system' ? 'Sistema' : company.participants.filter(p => event.actorIds.includes(p.id)).map(p => p.name).join(' + ')}</strong> · {event.message}</p><small>{formatInstant(event.occurredAt)} · {activity.module} · {event.previousStatus ? statusLabels[event.previousStatus] + ' → ' : ''}{statusLabels[event.newStatus]}</small><button className="teacher-text-link" onClick={() => onOpen(activity.id, event.resultId ?? undefined)}>{event.resultId ? 'Consultar resultado' : 'Consultar actividade'}</button></div></li>
  }) : <li className="teacher-empty">Sem eventos confirmados nesta categoria.</li>}</ol>
}
