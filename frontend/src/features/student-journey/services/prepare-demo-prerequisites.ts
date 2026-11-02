import type { JourneySnapshot } from '../types'

/** Explicit presentation setup, never inferred from opening a task or following a link. */
export function prepareDemoPrerequisites(snapshot: JourneySnapshot) {
  if (!snapshot.context.roadmapVersion) return
  const tasks = snapshot.blocks.flatMap(block => block.activities.flatMap(activity => activity.tasks ?? []))
  const prerequisites = new Set(tasks.flatMap(task => task.dependsOn ?? []))
  for (const task of tasks) {
    if (!prerequisites.has(task.id) || task.status === 'completed') continue
    if (task.kind === 'evidence') {
      if (!task.submission && !task.resource?.match(/\.(pdf|docx|xlsx)$/)) throw new Error('O pré-requisito de demonstração não tem ficheiro de exemplo.')
      task.submission ??= { fileName: task.resource!.split('/').at(-1)!, submittedBy: snapshot.context.studentName, submittedAt: '2026-11-02T08:00:00.000Z' }
    }
    if (task.kind === 'quiz') task.answers = Object.fromEntries((task.questions ?? []).map(question => [question.id, question.correct]))
    task.status = 'completed'
    task.completedAt = '2026-11-02T08:00:00.000Z'
  }
}
