import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { useConversations } from '../hooks/useConversations'
import { useJourneyMutation } from '../hooks/useJourney'
import { journeyPaths } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'
export function NotificationBar({ snapshot }: { snapshot: JourneySnapshot }) {
  const [channel, setChannel] = useState<'teacher' | 'group' | null>(null)
  const query = useConversations()
  const mutation = useJourneyMutation()
  const isOpen = (id: string) => !snapshot.resolvedNotifications.some(n => n.id === id && n.recipient === snapshot.context.studentName)
  const teacher = (query.data ?? []).filter(m => m.incoming && isOpen(m.id))
  const group = snapshot.groupMessages.filter(m => m.author !== snapshot.context.studentName && (!m.assignee || m.assignee === snapshot.context.studentName) && isOpen(m.id))
  const items = channel === 'teacher' ? teacher : group
  return <section className="mb-5 flex flex-wrap gap-3" aria-label="Notificações">
    <Button variant="outline" onClick={() => setChannel('teacher')}>Orientações do docente ({teacher.length})</Button>
    <Button variant="outline" onClick={() => setChannel('group')}>Conversas do grupo ({group.length})</Button>
    {query.error && <p role="alert">Não foi possível carregar as orientações. <button onClick={() => void query.refetch()}>Tentar novamente</button></p>}
    <Dialog open={channel !== null} onOpenChange={open => { if (!open) setChannel(null) }} title={channel === 'teacher' ? 'Orientações do docente' : 'Conversas do grupo'} description="Abra a actividade para consultar a conversa. Marque a notificação como resolvida quando estiver tratada.">
      <ul className="space-y-4 mt-4">{items.map(m => <li key={m.id} className="rounded border p-4"><strong>{m.author}</strong><p className="my-2 whitespace-pre-wrap">{m.message}</p><div className="flex flex-wrap gap-3"><Link className="text-blue-700 underline" to={journeyPaths.activity(m.activityId) + '?canal=' + channel} onClick={() => setChannel(null)}>Abrir actividade</Link><button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'resolve-notification', id: m.id, revision: snapshot.revision })}>Marcar como resolvida</button></div></li>)}</ul>
      {!items.length && <p className="py-5">Sem notificações por resolver.</p>}
      {mutation.error && <p role="alert">{mutation.error.message}</p>}
    </Dialog>
  </section>
}
