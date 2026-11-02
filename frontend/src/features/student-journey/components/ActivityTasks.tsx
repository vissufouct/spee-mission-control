import { resourceTitle } from '@/shared/lib/resource-title'
import { FileText, ListChecks, PlayCircle, Link as LinkIcon, CircleHelp } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { ParticipantInfo } from './ParticipantInfo'
import { getTaskParticipants } from '../services/task-participation'
import { taskAction, quizScore } from '../services/learning-tasks'
import type { LearningTask } from '../types'

const icons = { operation: ListChecks, quiz: CircleHelp, pdf: FileText, video: PlayCircle, url: LinkIcon, evidence: FileText }
const formats = { operation: 'Operação', quiz: 'Quiz', pdf: 'PDF obrigatório', video: 'Vídeo obrigatório', url: 'Página obrigatória', evidence: 'Submissão de evidência' }
export function ActivityTasks({ tasks, onOpen }: { tasks: LearningTask[]; onOpen?: (task: LearningTask) => void }) {
  return <section id="activity-criteria" className="mt-6" aria-label="Tarefas da actividade">
    <h3 className="mb-3 font-semibold">Tarefas da actividade</h3>
    {!tasks.length && <p className="text-sm text-slate-500">Ainda não existem tarefas nesta actividade.</p>}
    <div className="student-task-list">
    {tasks.length > 0 && <div className="student-task-columns" aria-hidden="true"><span>Tarefa</span><span>Participantes</span><span>Estado</span><span>Acção</span></div>}
    <ul className="student-completion-list">{tasks.map(task => {
      const Icon = icons[task.kind]
      return <li key={task.id} className="student-task-row">
        <div className="student-task-description"><Icon className="shrink-0 text-blue-600" size={21} aria-hidden />
        <div className="min-w-0"><h4 className="text-sm font-semibold">{resourceTitle(task)}</h4><p className="mt-1 text-xs text-slate-500">{formats[task.kind]}{task.kind === 'evidence' && ` · ${(task.accepts ?? ['pdf']).join(' / ').toUpperCase()}`}{task.kind === 'quiz' && task.status === 'completed' && ` · Pontuação: ${quizScore(task).correct}/${quizScore(task).total} (${quizScore(task).percent}%)`}</p></div></div>
        <section className="student-task-participants" aria-label={`Participantes: ${resourceTitle(task)}`}>
          <span className="student-task-cell-label">Participantes</span>
          <ParticipantInfo participants={getTaskParticipants(task)} showLabel={false} />
        </section>
        {task.kind === 'evidence' && task.submission ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">Submetido</span> : <StatusBadge status={task.status} />}
        <Button size="sm" variant="outline" className="student-task-action" disabled={!onOpen} onClick={() => onOpen?.(task)} aria-label={`${taskAction(task)}: ${resourceTitle(task)}`}>{taskAction(task)}</Button>
      </li>
    })}</ul>
    </div>
    {tasks.length > 0 && <p className="mt-2 text-xs text-slate-500">Participação ilustrativa por tarefa. A identificação e a participação reais serão definidas na integração com o simulador.</p>}
  </section>
}
