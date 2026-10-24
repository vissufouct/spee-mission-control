import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NotificationTile } from './NotificationTile'
import { pendingNotifications } from '../services/notifications'
import { Dialog } from '@/shared/components/ui/dialog'
import { useConversations } from '../hooks/useConversations'
import { useJourneyMutation } from '../hooks/useJourney'
import { journeyPaths } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'
export function NotificationBar({ snapshot }: { snapshot: JourneySnapshot }) {
  const [channel, setChannel] = useState<'teacher' | 'group' | null>(null)
  const query = useConversations()
  const mutation = useJourneyMutation()
  const { teacher, group } = pendingNotifications(snapshot, query.data ?? [])
  const items = channel === 'teacher' ? teacher : group
  return <section className="student-notifications" aria-label="Notificações">
    <NotificationTile title="Orientações do docente" items={teacher} loading={query.isPending} onOpen={() => setChannel('teacher')} />
    <NotificationTile title="Conversas do grupo" items={group} onOpen={() => setChannel('group')} />
    {query.error && <p role="alert">Não foi possível carregar as orientações. <button onClick={() => void query.refetch()}>Tentar novamente</button></p>}
    <Dialog open={channel !== null} onOpenChange={open => { if (!open) setChannel(null) }} title={channel === 'teacher' ? 'Orientações do docente' : 'Conversas do grupo'} description="Abra a actividade para consultar a conversa. Marque a notificação como resolvida quando estiver tratada.">
      <ul className="space-y-4 mt-4">{items.map(m => <li key={m.id} className="rounded border p-4"><strong>{m.author}</strong><p className="my-2 whitespace-pre-wrap">{m.message}</p><div className="flex flex-wrap gap-3"><Link preventScrollReset className="text-blue-700 underline" to={journeyPaths.activity(m.activityId) + '?canal=' + channel} onClick={() => setChannel(null)}>Abrir actividade</Link><button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'resolve-notification', id: m.id, revision: snapshot.revision })}>Marcar como resolvida</button></div></li>)}</ul>
      {!items.length && <p className="py-5">Sem notificações por resolver.</p>}
      {mutation.error && <p role="alert">{mutation.error.message}</p>}
    </Dialog>
  </section>
}
