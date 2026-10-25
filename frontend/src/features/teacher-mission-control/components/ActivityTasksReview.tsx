import type { TeacherActivity } from '../types'
import { TeacherStatusBadge } from './TeacherStatusBadge'
import { formatInstant } from '../services/teacher.selectors'

const formats = { operation: 'Operação', quiz: 'Quiz', pdf: 'PDF obrigatório', video: 'Vídeo obrigatório', url: 'Página obrigatória', evidence: 'Submissão de evidência' }

export function ActivityTasksReview({ tasks }: { tasks: TeacherActivity['tasks'] }) {
  if (!tasks?.length) return <section><h3 className="font-semibold">Tarefas da actividade</h3><p className="mt-2 text-sm text-slate-500">Ainda não existem dados de realização das tarefas para esta empresa.</p></section>
  return <section aria-label="Realização das tarefas" className="space-y-3">
    <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">Tarefas da actividade</h3><span className="text-xs text-slate-600">({tasks.filter(task => task.status === 'completed').length} de {tasks.length} concluídas)</span></div>
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">{tasks.map(task => {
      const correct = task.questions?.filter(question => task.answers?.[question.id] === question.correct).length ?? 0
      const total = task.questions?.length ?? 0
      return <li key={task.id} className="space-y-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold">{task.title}</h4>{task.submission ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">Submetido</span> : <TeacherStatusBadge status={task.status} />}</div>
        <p className="text-xs text-slate-500">{formats[task.kind]}{task.completedAt && ` · ${formatInstant(task.completedAt)}`}</p>
        {task.status === 'blocked' && <p className="text-xs text-slate-600">{task.description}</p>}
        {task.kind === 'quiz' && task.answers && total > 0 && <details className="rounded-lg bg-blue-50 p-3 text-sm">
          <summary className="cursor-pointer text-blue-700 focus-visible:outline-2">Pontuação: {correct}/{total} ({Math.round(correct / total * 100)}%) · Ver respostas</summary>
          <ol className="mt-3 space-y-3">{task.questions?.map(question => <li key={question.id}><p className="font-medium">{question.prompt}</p><p>Resposta: {question.options[task.answers![question.id]] ?? 'Sem resposta'}</p><p className="text-xs text-slate-600">{task.answers![question.id] === question.correct ? 'Correcta' : `Resposta correcta: ${question.options[question.correct]}`}</p></li>)}</ol>
        </details>}
        {task.submission && <p className="text-xs text-slate-600">{task.submission.fileName} · {task.submission.submittedBy} · {formatInstant(task.submission.submittedAt)}</p>}
        {(task.resource || task.submission?.file) && (task.kind !== 'evidence' || task.submission) && <a className="inline-block text-sm text-blue-700 underline underline-offset-2" href={task.submission?.file?.dataUrl ?? (task.resource?.startsWith('https://') ? task.resource : import.meta.env.BASE_URL + task.resource)} download={task.submission?.file ? task.submission.fileName : undefined} target={task.submission?.file ? undefined : '_blank'} rel="noreferrer">{task.submission?.file ? 'Descarregar ficheiro submetido' : task.kind === 'evidence' ? 'Consultar ficheiro submetido' : 'Consultar material'}<span className="sr-only">: {task.title}{!task.submission?.file && ' (novo separador)'}</span></a>}
      </li>
    })}</ul>
    <p className="text-xs text-slate-500">Consulta da realização dos estudantes. Submissão não equivale a avaliação ou aprovação.</p>
  </section>
}
