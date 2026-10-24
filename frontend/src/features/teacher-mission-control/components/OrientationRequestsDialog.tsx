import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { useTeacherMutation } from '../hooks/useTeacher'
import { requestReplySchema } from '../schemas/teacher.schema'
import { formatInstant } from '../services/teacher.selectors'
import type { RequestReply, TeacherSnapshot } from '../types'

const requestStatus = {
  'awaiting-teacher': 'Aguarda resposta do docente',
  'awaiting-student': 'Aguarda resposta do estudante',
  concluded: 'Concluído',
}

export function OrientationRequestsDialog({ snapshot, companyId, open, onOpenChange }: {
  snapshot: TeacherSnapshot; companyId?: string; open: boolean; onOpenChange: (open: boolean) => void
}) {
  const requests = useMemo(() => snapshot.orientationRequests
    .filter(request => !companyId || request.companyId === companyId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [snapshot.orientationRequests, companyId])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = requests.find(request => request.id === selectedId) ?? requests[0]
  const mutation = useTeacherMutation()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestReply>({
    resolver: zodResolver(requestReplySchema), defaultValues: { message: '' },
  })
  const reply = (input: RequestReply) => {
    if (!selected) return
    mutation.mutate({ type: 'reply-request', id: selected.id, input, revision: snapshot.revision }, {
      onSuccess: () => reset({ message: '' }),
    })
  }
  const conclude = () => {
    if (!selected) return
    mutation.mutate({ type: 'conclude-request', id: selected.id, revision: snapshot.revision })
  }
  const company = selected ? snapshot.companies.find(item => item.id === selected.companyId) : undefined
  const activity = company?.activities.find(item => item.id === selected?.activityId)
  return <Dialog className="teacher-dialog max-w-5xl" open={open} onOpenChange={onOpenChange} title="Pedidos de orientação" description={companyId ? 'Conversas desta empresa' : 'Pedidos recebidos em todas as turmas'}>
    <div className="teacher-request-layout">
      <nav className="teacher-request-list" aria-label="Lista de pedidos de orientação">
        {requests.map(request => {
          const requestCompany = snapshot.companies.find(item => item.id === request.companyId)
          return <button key={request.id} aria-current={request.id === selected?.id} onClick={() => { mutation.reset(); setSelectedId(request.id) }}>
            <strong>{request.subject}</strong><span>{requestCompany?.name}</span><small>{requestStatus[request.status]}</small>
          </button>
        })}
        {!requests.length && <p className="teacher-empty">Ainda não existem pedidos de orientação.</p>}
      </nav>
      {selected && <section className="teacher-request-thread" aria-label={'Conversa sobre ' + selected.subject}>
        <header><div><h3>{selected.subject}</h3><p>{company?.name} · {activity?.title}</p></div><span className={'teacher-request-state teacher-request-state--' + selected.status}>{requestStatus[selected.status]}</span></header>
        <ol className="teacher-request-messages">{selected.messages.map(message => <li key={message.id} className={'teacher-request-message teacher-request-message--' + message.role}><strong>{message.author}</strong><p>{message.message}</p><small>{formatInstant(message.occurredAt)}</small></li>)}</ol>
        {selected.status !== 'concluded' ? <form className="teacher-form" onSubmit={handleSubmit(reply)}>
          <label>Resposta<textarea rows={4} {...register('message')} aria-invalid={!!errors.message} placeholder="Escreva uma orientação ligada a esta actividade." />{errors.message && <span role="alert">{errors.message.message}</span>}</label>
          {mutation.error && <p role="alert">{mutation.error.message}</p>}
          <div className="teacher-actions"><Button type="button" variant="outline" disabled={mutation.isPending} onClick={conclude}>Marcar como concluído</Button><Button disabled={mutation.isPending}>{mutation.isPending ? 'A guardar…' : 'Responder'}</Button></div>
        </form> : <p className="teacher-feedback">Conversa concluída. O histórico foi preservado.</p>}
      </section>}
    </div>
  </Dialog>
}
