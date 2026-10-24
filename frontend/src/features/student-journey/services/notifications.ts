import type { JourneySnapshot } from '../types'
import type { TeacherMessage } from './ConversationGateway'

export function pendingNotifications(snapshot: JourneySnapshot, messages: TeacherMessage[], activityId?: string) {
  const unresolved = (id: string) => !snapshot.resolvedNotifications.some(n => n.id === id && n.recipient === snapshot.context.studentName)
  const relevant = (m: { id: string; activityId: string }) => (!activityId || m.activityId === activityId) && unresolved(m.id)
  const newest = <T extends { createdAt: string }>(items: T[]) => items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const activities = new Map(snapshot.blocks.flatMap(b => b.activities).map(a => [a.id, a.title]))
  const withActivity = <T extends { activityId: string }>(message: T) => ({
    ...message, activityTitle: activities.get(message.activityId) ?? 'Actividade não disponível',
  })
  return {
    teacher: newest(messages.filter(m => m.incoming && relevant(m))).map(withActivity),
    group: newest(snapshot.groupMessages.filter(m => m.author !== snapshot.context.studentName && (!m.assignee || m.assignee === snapshot.context.studentName) && relevant(m))).map(withActivity),
  }
}
