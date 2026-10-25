import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import type { LearningTask } from '../types'
import { quizScore } from '../services/learning-tasks'
import { EvidenceSubmission } from './EvidenceSubmission'
import { EvidenceTaskForm } from './EvidenceTaskForm'
import { DocumentPreview } from './DocumentPreview'
import { resourceUrl } from '../services/learning-resources'
import type { EvidenceFile } from '../services/JourneyRepository'
import { Play } from 'lucide-react'

export function LearningTaskDialog({ task, reason, pending, error, onClose, onComplete }: {
  task: LearningTask; reason?: string; pending: boolean; error?: string; onClose: () => void; onComplete: (answers?: Record<string, number>, file?: EvidenceFile) => void
}) {
  const [viewed, setViewed] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const form = useForm<Record<string, string>>({ defaultValues: Object.fromEntries(Object.entries(task.answers ?? {}).map(([key, value]) => [key, String(value)])) })
  const completed = task.status === 'completed'
  const score = quizScore(task)
  const blocked = task.status === 'blocked'
  const src = task.resource ? resourceUrl(task.resource) : undefined
  return <Dialog className="student-learning-dialog" open title={task.title} description={blocked ? 'Esta tarefa tem pré-requisitos por concluir.' : task.description} onOpenChange={open => { if (!open && !pending) onClose() }}>
    <div className="mt-5 space-y-4">
      {blocked ? <p className="rounded-lg bg-slate-50 p-4 text-sm">{reason ?? 'Conclua as tarefas operacionais anteriores antes de executar esta tarefa.'}</p> : task.kind === 'quiz' ?
        <form className="space-y-4" onSubmit={form.handleSubmit(values => onComplete(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)]))))}>
          {completed && <div className="rounded-lg bg-blue-50 p-4 text-sm"><p className="font-semibold">Pontuação obtida: {score.correct}/{score.total} ({score.percent}%)</p>{task.quizMode === 'diagnostic' && <p className="mt-1">Diagnóstico simulado de conhecimentos; não é uma classificação da capacidade empreendedora.</p>}</div>}
          {!completed && task.quizMode !== 'diagnostic' && <p className="text-sm text-slate-600">Aprovação: pelo menos {task.passPercent ?? 100}% de respostas correctas. Pode voltar a tentar.</p>}
          {task.questions?.map((question, index) => <fieldset key={question.id} disabled={completed || pending} className="rounded-lg border border-slate-200 p-4">
            <legend className="px-1 text-sm font-semibold">{index + 1}. {question.prompt}</legend>
            {question.options.map((option, optionIndex) => <label key={option} className="mt-2 flex items-start gap-2 text-sm"><input type="radio" value={optionIndex} {...form.register(question.id, { required: 'Seleccione uma resposta.' })} className="mt-1" />{option}</label>)}
            {form.formState.errors[question.id] && <p role="alert" className="mt-2 text-sm text-red-700">Seleccione uma resposta.</p>}
            {completed && <p className="mt-2 text-xs text-slate-600">{task.answers?.[question.id] === question.correct ? 'Resposta correcta.' : `Resposta a rever. Resposta correcta: ${question.options[question.correct]}`}</p>}
          </fieldset>)}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {completed ? <p role="status" className="text-sm text-emerald-800">Quiz concluído. {score.correct === score.total ? 'Todas as respostas estão correctas.' : 'Consulte as respostas e os aspectos a rever.'}</p> : <Button disabled={pending}>{pending ? 'A guardar…' : 'Validar respostas'}</Button>}
        </form> : task.kind === 'evidence' ? <>
          {completed ? <EvidenceSubmission task={task} /> : <EvidenceTaskForm task={task} pending={pending} error={error} onSubmit={file => onComplete(undefined, file)} />}
        </> : <>
          {task.kind === 'video' && task.cover && <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50"><img src={resourceUrl(task.cover)} alt={`Ilustração: ${task.title}`} className="aspect-video w-full object-cover" /><div className="space-y-3 p-4"><p className="text-sm font-semibold">Vídeo previsto · capa ilustrativa</p><p className="text-sm text-slate-600">Nesta versão, a capa representa o vídeo que será disponibilizado. Pode simular a sua visualização para testar o percurso.</p><Button variant="outline" onClick={() => setViewed(true)} disabled={viewed || completed}><Play size={16} />{viewed || completed ? 'Visualização simulada' : 'Simular visualização'}</Button></div></div>}
          {task.kind === 'video' && !task.cover && <video className="w-full rounded-lg" controls preload="metadata" src={src} onEnded={() => setViewed(true)} onError={() => setMediaError(true)} aria-label={task.title} />}
          {(task.kind === 'pdf' || task.kind === 'url') && <>{!task.resource?.startsWith('https://') && (task.kind === 'pdf' ? <DocumentPreview src={src!} preview={task.preview} title={task.title} /> : <iframe className="student-task-resource" src={src} title={task.title} />)}{task.resource?.startsWith('https://') && <p className="rounded-lg bg-blue-50 p-4 text-sm">Recurso externo de referência. Consulte a página no seu portal de origem e regresse para confirmar a leitura.</p>}<div className="flex flex-wrap gap-4 text-sm text-blue-700"><a href={src} target="_blank" rel="noreferrer" className="underline">Abrir material noutro separador</a>{task.kind === 'pdf' && !task.resource?.startsWith('https://') && <a href={src} download className="underline">Descarregar PDF</a>}</div></>}
          {task.kind === 'operation' && <p className="rounded-lg bg-blue-50 p-4 text-sm">Operação simulada: confirme explicitamente o resultado desta tarefa. Na integração, esta confirmação será substituída pela evidência do módulo do simulador.</p>}
          {mediaError && <p role="alert" className="text-sm text-red-700">Não foi possível carregar o vídeo. Feche e volte a abrir a tarefa para tentar novamente.</p>}
          {!completed && <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} disabled={pending || (task.kind === 'video' && !viewed)} className="mt-1" />{task.kind === 'operation' ? 'Confirmo o resultado desta operação simulada.' : 'Confirmo que consultei o material obrigatório.'}</label>}
          {task.kind === 'video' && !task.cover && !viewed && !completed && <p className="text-xs text-slate-500">A confirmação fica disponível no final do vídeo.</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {completed ? <p role="status" className="text-sm text-emerald-800">Tarefa concluída.</p> : <Button disabled={pending || !acknowledged || mediaError} onClick={() => onComplete()}>{pending ? 'A guardar…' : 'Confirmar conclusão da tarefa'}</Button>}
        </>}
      <div className="flex justify-end border-t border-slate-100 pt-4"><Button variant="outline" disabled={pending} onClick={onClose}>Fechar</Button></div>
    </div>
  </Dialog>
}
