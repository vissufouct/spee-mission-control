import type { Activity, JourneySnapshot } from '../types'
import { getLearningTasks } from './learning-tasks'
import { getActivityStatus } from './journey.selectors'

export function getActivityCriteria(activity: Activity, snapshot: JourneySnapshot) {
  const tasks = getLearningTasks(activity, snapshot)
  return { confirmed: tasks.filter(task => task.status === 'completed').length, total: tasks.length }
}

export function getNextActivity(activity: Activity, snapshot: JourneySnapshot) {
  const activities = snapshot.blocks.flatMap(block => block.activities)
  return activity.nextIds?.map(id => activities.find(item => item.id === id)).find(item => item && ['not-started', 'in-progress'].includes(getActivityStatus(item, snapshot)))
}

export function getNextAction(activity: Activity, snapshot: JourneySnapshot) {
  const status = getActivityStatus(activity, snapshot)
  if (status === 'blocked' || status === 'completed') return undefined
  const task = getLearningTasks(activity, snapshot).find(item => item.status !== 'completed' && item.status !== 'blocked')
  if (!task) return undefined
  return { title: task.title, id: task.id, target: 'criteria' as const, label: 'Ver tarefa' }
}
