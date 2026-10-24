import { useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { NotificationTile } from './NotificationTile'
import { pendingNotifications } from '../services/notifications'
import { ChatHistory } from './ChatHistory'
import { useConversations, useSendTeacherMessage } from '../hooks/useConversations'
import { useJourneyMutation } from '../hooks/useJourney'
import type { JourneySnapshot } from '../types'
const schema = z.object({ message: z.string().trim().min(3, 'Escreva pelo menos 3 caracteres.').max(2000), assignee: z.string() })
export function ConversationPanel({ snapshot, activityId, initialChannel = 'teacher', initialOpen = false }: { snapshot: JourneySnapshot; activityId: string; initialChannel?: 'teacher' | 'group'; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  const id = useId()
  const [channel, setChannel] = useState(initialChannel)
  const [feedback, setFeedback] = useState('')
  const query = useConversations()
  const teacher = useSendTeacherMessage()
  const local = useJourneyMutation()
  const drafts = useRef({ teacher: { message: '', assignee: '' }, group: { message: '', assignee: '' } })
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { message: '', assignee: '' } })
  function selectChannel(value: 'teacher' | 'group') {
    drafts.current[channel] = getValues()
    reset(drafts.current[value]); setChannel(value); setFeedback(''); teacher.reset(); local.reset()
  }
  const pending = teacher.isPending || local.isPending
  const messages = channel === 'teacher' ? (query.data ?? []).filter(m => m.activityId === activityId) : snapshot.groupMessages.filter(m => m.activityId === activityId)
  const activityTitle = snapshot.blocks.flatMap(b => b.activities).find(a => a.id === activityId)?.title ?? activityId
  const notifications = pendingNotifications(snapshot, query.data ?? [], activityId)
  const previews = [...notifications.teacher, ...notifications.group].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const counts = { teacher: notifications.teacher.length, group: notifications.group.length }
  async function send(values: z.infer<typeof schema>) {
    try {
      if (channel === 'teacher') await teacher.mutateAsync({ activityId, message: values.message })
      else await local.mutateAsync({ type: 'group-message', activityId, message: values.message, assignee: values.assignee || null, revision: snapshot.revision })
      reset(); setFeedback('Mensagem enviada.')
    } catch { /* Mutation error remains visible; keep the draft. */ }
  }
  return <>
    <NotificationTile title="Conversas desta actividade" items={previews} loading={query.isPending} onOpen={() => setOpen(true)} />
    <Dialog open={open} onOpenChange={setOpen} title={'Conversas da actividade: ' + activityTitle} className="student-chat-dialog">
    <div className="flex gap-2 border-b py-3" role="tablist" aria-label="Canal da conversa">{(['teacher', 'group'] as const).map(value => <button key={value} id={id + value} role="tab" type="button" aria-selected={value === channel} aria-controls={id + '-panel'} tabIndex={value === channel ? 0 : -1} className="student-chat-tab" onKeyDown={event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault()
        const next = event.key === 'Home' ? 'teacher' : event.key === 'End' ? 'group' : channel === 'teacher' ? 'group' : 'teacher'
        selectChannel(next); document.getElementById(id + next)?.focus()
      }
    }} disabled={pending} onClick={() => selectChannel(value)}>{value === 'teacher' ? 'Docente' : 'Grupo da empresa'} <span className="student-chat-badge">{counts[value]}</span></button>)}</div>
    <div role="tabpanel" id={id + '-panel'} aria-labelledby={id + channel} className="student-chat-content">
    <p className="text-xs text-slate-500">{channel === 'group' ? 'Conversa privada entre membros da empresa. O docente não tem acesso.' : 'Todos os membros da empresa podem consultar e responder neste chat com o docente.'}</p>
    {channel === 'teacher' && query.isPending && <p role="status">A carregar conversa…</p>}
    {query.error && channel === 'teacher' && <p role="alert">{query.error.message}</p>}
    <ChatHistory<(typeof messages)[number]> key={channel + String(open)} messages={messages} renderMessage={m => <article className={'student-chat-bubble ' + ('incoming' in m ? m.incoming ? 'student-chat-teacher' : 'student-chat-student' : m.author === snapshot.context.studentName ? 'student-chat-own' : '')}><strong>{m.author}</strong>{'incoming' in m && <span className="ml-2 text-xs">{m.incoming ? 'Docente' : 'Estudante'}</span>}<p className="my-2 whitespace-pre-wrap">{m.message}</p><time className="block text-xs opacity-70">{new Date(m.createdAt).toLocaleString('pt-PT')}</time>{'assignee' in m && m.assignee && <div className="mt-3 border-t pt-2"><p>Responsável: {m.assignee} · {m.doneAt ? 'Feito' : 'Por fazer'}</p>{!m.doneAt && m.assignee === snapshot.context.studentName && <Button size="sm" disabled={pending} onClick={() => local.mutate({ type: 'complete-task', id: m.id, revision: snapshot.revision })}>Marcar como feito</Button>}</div>}</article>} />
    <form className="space-y-3" onSubmit={handleSubmit(send)}>
      <label className="block text-sm">Mensagem<textarea className="mt-1 w-full rounded border p-2" rows={2} {...register('message')} aria-invalid={!!errors.message} /></label>
      {errors.message && <p role="alert">{errors.message.message}</p>}
      {channel === 'group' && <label className="block text-sm">Responsável pela tarefa<select aria-label="Responsável pela tarefa" className="mt-1 w-full rounded border p-2" {...register('assignee')}><option value="">Conversa sem tarefa</option>{snapshot.members.map(name => <option key={name}>{name}</option>)}</select></label>}
      <Button disabled={pending} type="submit">{pending ? 'A enviar…' : 'Enviar mensagem'}</Button>
    </form>
    {(teacher.error || local.error) && <p role="alert" className="text-red-700">{teacher.error?.message || local.error?.message}</p>}
    {feedback && <p role="status">{feedback}</p>}
    </div></Dialog>
  </>
}
