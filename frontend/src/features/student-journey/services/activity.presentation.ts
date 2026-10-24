import type { Activity, JourneySnapshot } from '../types'
import { registrationSchema } from '../schemas/journey.schema'
import { getActivityStatus } from './journey.selectors'

export function getActivityCriteria(activity: Activity, snapshot: JourneySnapshot) {
  const total = activity.steps?.length ?? (activity.id === 'registar-empresa' ? 3 : 0)
  const completed = getActivityStatus(activity, snapshot) === 'completed'
  const confirmed = completed ? total : activity.id === 'registar-empresa' && registrationSchema.safeParse(snapshot.registration?.data).success ? Math.min(1, total) : 0
  return { confirmed, total }
}

export function getNextActivity(activity: Activity, snapshot: JourneySnapshot) {
  const activities = snapshot.blocks.flatMap(block => block.activities)
  return activity.nextIds?.map(id => activities.find(item => item.id === id)).find(item => item && ['not-started', 'in-progress'].includes(getActivityStatus(item, snapshot)))
}

export function getNextAction(activity: Activity, snapshot: JourneySnapshot) {
  const status = getActivityStatus(activity, snapshot)
  if (status === 'blocked' || status === 'completed') return undefined
  const { confirmed } = getActivityCriteria(activity, snapshot)
  const title = activity.steps?.[confirmed]
  if (!title) return undefined
  return { title, id: activity.id, target: activity.id === 'registar-empresa' ? 'registration' as const : 'criteria' as const, label: status === 'in-progress' ? 'Continuar actividade' : 'Iniciar actividade' }
}
