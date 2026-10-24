import { Bell, ChevronDown, MessageSquare, NotebookPen, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useConversations } from '../hooks/useConversations'
import { pendingNotifications } from '../services/notifications'
import type { JourneySnapshot } from '../types'

export function ActivityNotifications({ snapshot, activityId, children }: { snapshot: JourneySnapshot; activityId: string; children: ReactNode }) {
  const query = useConversations()
  const all = pendingNotifications(snapshot, query.data ?? [])
  const activity = pendingNotifications(snapshot, query.data ?? [], activityId)
  const badges = [
    { label: 'Docente', count: all.teacher.length, icon: NotebookPen, remote: true },
    { label: 'Grupo', count: all.group.length, icon: Users, remote: false },
    { label: 'Actividade', count: activity.teacher.length + activity.group.length, icon: MessageSquare, remote: true },
  ]
  return <details className="student-notification-group" aria-label="Notificações e conversas">
    <summary>
      <span className="student-notification-group-title"><Bell size={18} aria-hidden />Notificações e conversas</span>
      <span className="student-notification-group-badges">{badges.map(({ label, count, icon: Icon, remote }) => <span className="student-notification-summary-badge" key={label}><Icon size={15} aria-hidden />{label}<span className="student-chat-badge">{remote && query.isPending ? '…' : remote && query.isError ? '!' : count}</span></span>)}</span>
      <ChevronDown className="student-disclosure-chevron" size={18} aria-hidden />
    </summary>
    {query.isError && <p role="alert" className="px-4 pb-3 text-sm text-red-700">Não foi possível carregar as orientações. <button className="underline" onClick={() => void query.refetch()}>Tentar novamente</button></p>}
    <div className="student-notification-group-content">{children}</div>
  </details>
}
