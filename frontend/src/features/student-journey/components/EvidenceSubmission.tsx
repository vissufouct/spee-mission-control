import type { LearningTask } from '../types'
import { resourceUrl } from '../services/learning-resources'
import { DocumentPreview } from './DocumentPreview'

export function EvidenceSubmission({ task }: { task: LearningTask }) {
  if (!task.submission || (!task.resource && !task.submission.file)) return <p className="text-sm text-slate-500">Ainda não existe uma evidência submetida. Este exemplo permite consultar uma submissão preparada no cenário.</p>
  const src = task.submission.file?.dataUrl ?? resourceUrl(task.resource!)
  const format = task.submission.fileName.split('.').at(-1)?.toUpperCase()
  return <section aria-label="Evidência submetida" className="space-y-4">
    <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Submetido · {format}</p>
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div><dt className="text-slate-500">Ficheiro</dt><dd className="break-words font-medium">{task.submission.fileName}</dd></div>
      <div><dt className="text-slate-500">Submetido por</dt><dd>{task.submission.submittedBy}</dd></div>
      <div><dt className="text-slate-500">Data de submissão</dt><dd>{new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Africa/Maputo' }).format(new Date(task.submission.submittedAt))} (Maputo)</dd></div>
    </dl>
    {format === 'PDF' && <DocumentPreview src={src} preview={task.submission.file ? undefined : task.preview} title={task.title} />}
    <div className="flex flex-wrap gap-4 text-sm text-blue-700">{!task.submission.file && <a href={src} target="_blank" rel="noreferrer" className="underline">Abrir ficheiro noutro separador</a>}<a href={src} download={task.submission.fileName} className="underline">Descarregar ficheiro submetido</a></div>
    <p className="text-xs text-slate-500">Submissão local para validar a experiência. Submetido não significa avaliado ou aprovado.</p>
  </section>
}
