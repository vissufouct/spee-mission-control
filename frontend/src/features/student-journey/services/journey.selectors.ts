import type { Activity, ActivityStatus, JourneySnapshot } from '../types'
import { confirmedProgress } from '@/shared/lib/progress'
import { getLearningTasks } from './learning-tasks'

export function getActivityStatus(activity: Activity, snapshot: JourneySnapshot): ActivityStatus {
  if (activity.tasks?.length) {
    const tasks = getLearningTasks(activity, snapshot).filter(task => task.required)
    if (tasks.length && tasks.every(task => task.status === 'completed')) return 'completed'
    if (tasks.some(task => task.status === 'completed' || task.status === 'in-progress')) return 'in-progress'
    if (tasks.length && tasks.every(task => task.status === 'blocked')) return 'blocked'
    return 'not-started'
  }
  if (activity.id !== 'registar-empresa') return activity.status === 'returned' ? 'in-progress' : ['available', 'unavailable'].includes(activity.status) ? 'not-started' : activity.status
  return snapshot.registration?.status === 'confirmed' ? 'completed' : snapshot.registration ? 'in-progress' : 'not-started'
}
export function getProgress(snapshot: JourneySnapshot) {
  const activities = snapshot.blocks.flatMap(block => block.activities)
  const completed = activities.filter(activity => getActivityStatus(activity, snapshot) === 'completed').length
  return { completed, total: activities.length, percent: confirmedProgress(completed, activities.length) }
}
export function getCurrentBlock(snapshot: JourneySnapshot) {
  return snapshot.blocks.find(block => block.id === snapshot.context.currentBlockId)!
}
export function getBlockSummary(snapshot: JourneySnapshot, blockId = snapshot.context.currentBlockId) {
  const activities = (snapshot.blocks.find(block => block.id === blockId) ?? getCurrentBlock(snapshot)).activities
  return {
    total: activities.length,
    completed: activities.filter(a => getActivityStatus(a, snapshot) === 'completed').length,
    inProgress: activities.filter(a => getActivityStatus(a, snapshot) === 'in-progress').length,
    available: activities.filter(a => getActivityStatus(a, snapshot) === 'not-started').length,
    blocked: activities.filter(a => getActivityStatus(a, snapshot) === 'blocked').length,
  }
}
export const journeyPaths = {
  activity: (id: string) => '/estudante/percurso/actividades/' + encodeURIComponent(id),
  home: '/estudante/percurso',
  full: '/estudante/percurso/completo',
  registration: '/estudante/percurso/registar-empresa',
} as const
