import type { Activity, ActivityStatus, JourneySnapshot } from '../types'
import { confirmedProgress } from '@/shared/lib/progress'

export function getActivityStatus(activity: Activity, snapshot: JourneySnapshot): ActivityStatus {
  if (activity.id !== 'registar-empresa') return activity.status
  return snapshot.registration?.status === 'confirmed' ? 'completed' : snapshot.registration ? 'in-progress' : 'available'
}
export function getProgress(snapshot: JourneySnapshot) {
  const activities = snapshot.blocks.flatMap(block => block.activities)
  const completed = activities.filter(activity => getActivityStatus(activity, snapshot) === 'completed').length
  return { completed, total: activities.length, percent: confirmedProgress(completed, activities.length) }
}
export function getCurrentBlock(snapshot: JourneySnapshot) {
  return snapshot.blocks.find(block => block.id === snapshot.context.currentBlockId)!
}
export function getBlockSummary(snapshot: JourneySnapshot) {
  const activities = getCurrentBlock(snapshot).activities
  return {
    total: activities.length,
    completed: activities.filter(a => getActivityStatus(a, snapshot) === 'completed').length,
    inProgress: activities.filter(a => getActivityStatus(a, snapshot) === 'in-progress').length,
    available: activities.filter(a => getActivityStatus(a, snapshot) === 'available').length,
    blocked: activities.filter(a => getActivityStatus(a, snapshot) === 'blocked').length,
  }
}
export const journeyPaths = {
  home: '/estudante/percurso',
  full: '/estudante/percurso/completo',
  registration: '/estudante/percurso/registar-empresa',
} as const
