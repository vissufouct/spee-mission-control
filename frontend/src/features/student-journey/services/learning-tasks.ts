import { registrationSchema } from '../schemas/journey.schema'
import type { Activity, JourneySnapshot, LearningTask } from '../types'

/** Operational evidence remains authoritative; quiz/material completion is separate. */
export function getLearningTasks(activity: Activity, snapshot: JourneySnapshot): LearningTask[] {
  const all = snapshot.blocks.flatMap(block => block.activities.flatMap(item => item.tasks ?? []))
  return (activity.tasks ?? (activity.steps ?? []).map((title, index): LearningTask => ({
    id: `${activity.id}-${index}`, title, description: activity.description, kind: 'operation', required: true,
    status: activity.status === 'completed' ? 'completed' : activity.status === 'blocked' ? 'blocked' : 'not-started',
  }))).map(task => {
    if (snapshot.context.roadmapVersion) {
      const missing = (task.dependsOn ?? []).filter(id => all.find(item => item.id === id)?.status !== 'completed')
      if (missing.length && task.status !== 'completed') {
        const titles = missing.slice(0, 3).map(id => all.find(item => item.id === id)?.title ?? id)
        const remaining = missing.length > 3 ? `; e mais ${missing.length - 3} tarefas anteriores` : ''
        return { ...task, status: 'blocked' as const, description: `Antes de continuar, conclua: ${titles.join('; ')}${remaining}. Consulte o percurso completo para ver as tarefas pendentes.` }
      }
      return task
    }
    if (activity.id !== 'registar-empresa' || task.kind !== 'operation') return task
    const confirmed = snapshot.registration?.status === 'confirmed'
    const filled = registrationSchema.safeParse(snapshot.registration?.data).success
    const status = task.id === 'registration-data'
      ? confirmed || filled ? 'completed' : snapshot.registration ? 'in-progress' : 'not-started'
      : task.id === 'registration-submit'
        ? confirmed ? 'completed' : filled ? 'in-progress' : 'blocked'
        : confirmed ? 'completed' : 'blocked'
    return { ...task, status }
  })
}

export function quizPassed(task: LearningTask, answers: Record<string, number>) {
  const answered = !!task.questions?.length && task.questions.every(question => Number.isInteger(answers[question.id]) && answers[question.id] >= 0 && answers[question.id] < question.options.length)
  if (!answered) return false
  return task.quizMode === 'diagnostic' || quizScore({ ...task, answers }).percent >= (task.passPercent ?? 100)
}

export function quizScore(task: LearningTask) {
  const total = task.questions?.length ?? 0
  const correct = task.questions?.filter(question => task.answers?.[question.id] === question.correct).length ?? 0
  return { correct, total, percent: total ? Math.round(correct / total * 100) : 0 }
}

export function taskAction(task: LearningTask) {
  if (task.status === 'blocked') return 'Ver condição'
  if (task.kind === 'evidence') return task.submission ? 'Ver submissão' : 'Submeter evidência'
  if (task.status === 'completed') return task.kind === 'quiz' ? 'Ver respostas' : 'Ver'
  if (task.kind === 'quiz') return 'Responder ao quiz'
  if (task.kind === 'video') return 'Ver vídeo'
  if (task.kind === 'pdf') return 'Ler PDF'
  if (task.kind === 'url') return 'Consultar página'
  return task.status === 'in-progress' ? 'Continuar tarefa' : 'Iniciar tarefa'
}
