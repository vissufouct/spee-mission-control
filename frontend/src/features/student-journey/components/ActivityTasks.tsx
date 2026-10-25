import { FileText, ListChecks, PlayCircle, Link as LinkIcon, CircleHelp } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { taskAction, quizScore } from '../services/learning-tasks'
import type { LearningTask } from '../types'

const icons = { operation: ListChecks, quiz: CircleHelp, pdf: FileText, video: PlayCircle, url: LinkIcon, evidence: FileText }
const formats = { operation: 'Operação', quiz: 'Quiz', pdf: 'PDF obrigatório', video: 'Vídeo obrigatório', url: 'Página obrigatória', evidence: 'Submissão de evidência · PDF' }
export function ActivityTasks({ tasks, onOpen }: { tasks: LearningTask[]; onOpen?: (task: LearningTask) => void }) {
  return <section id="activity-criteria" className="mt-6" aria-label="Tarefas da actividade">
    <h3 className="mb-3 font-semibold">Tarefas da actividade</h3>
    {!tasks.length && <p className="text-sm text-slate-500">Ainda não existem tarefas nesta actividade.</p>}
    <ul className="student-completion-list">{tasks.map(task => {
      const Icon = icons[task.kind]
      return <li key={task.id} className="student-task-row">
        <Icon className="shrink-0 text-blue-600" size={21} aria-hidden />
        <div className="min-w-0 flex-1"><h4 className="text-sm font-semibold">{task.title}</h4><p className="mt-1 text-xs text-slate-500">{formats[task.kind]}{task.kind === 'quiz' && task.status === 'completed' && ` · Pontuação: ${quizScore(task).correct}/${quizScore(task).total} (${quizScore(task).percent}%)`}</p></div>
        {task.kind === 'evidence' && task.submission ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">Submetido</span> : <StatusBadge status={task.status} />}
        <Button size="sm" variant={task.status === 'completed' || task.status === 'blocked' ? 'outline' : 'default'} disabled={!onOpen} onClick={() => onOpen?.(task)} aria-label={`${taskAction(task)}: ${task.title}`}>{taskAction(task)}</Button>
      </li>
    })}</ul>
  </section>
}
