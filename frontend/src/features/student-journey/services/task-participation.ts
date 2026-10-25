import type { LearningTask } from '../types'

/** Descriptive examples are not a source of confirmed progress or authorship. */
export function getTaskParticipants(task: LearningTask) {
  return task.status === 'completed' || task.status === 'in-progress' ? task.simulatedParticipants ?? [] : []
}
