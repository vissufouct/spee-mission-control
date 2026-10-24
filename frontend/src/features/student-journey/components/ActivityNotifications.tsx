import { Bell, MessageSquare, NotebookPen, Users } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog } from '@/shared/components/ui/dialog'
import { useConversations } from '../hooks/useConversations'
import { useJourneyMutation } from '../hooks/useJourney'
import { pendingNotifications } from '../services/notifications'
import { journeyPaths } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'

export function ActivityNotifications({ snapshot, activityId }: { snapshot: JourneySnapshot; activityId?: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const id = useId()
  const query = useConversations()
  const mutation = useJourneyMutation()
  const all = pendingNotifications(snapshot, query.data ?? [])
  const activity = pendingNotifications(snapshot, query.data ?? [], activityId)
  const tabs = [
    { label: 'Docente', items: all.teacher, icon: NotebookPen },
    { label: 'Grupo', items: all.group, icon: Users },
    ...(activityId ? [{ label: 'Actividade', items: [...activity.teacher, ...activity.group].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), icon: MessageSquare }] : []),
  ]
  const total = tabs.reduce((sum, tab) => sum + tab.items.length, 0)
  const count = (value: number) => query.isPending ? '…' : query.isError ? '!' : value
  return <>
    <button type="button" className="student-notification-launcher" aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <span className="flex items-center gap-2 font-semibold"><Bell size={18} aria-hidden />Notificações e conversas <span className="student-chat-badge" aria-label={query.isPending ? 'A carregar total de notificações' : query.isError ? 'Total de notificações indisponível' : total + ' notificações pendentes no total'}>{count(total)}</span></span>
      <span className="mt-2 flex flex-wrap gap-2">{tabs.map(({ label, items, icon: Icon }) => <span className="student-notification-summary-badge" key={label}><Icon size={15} aria-hidden />{label}<span className="student-chat-badge">{count(items.length)}</span></span>)}</span>
    </button>
    <Dialog open={open} onOpenChange={setOpen} title="Notificações e conversas">
      <div role="tablist" aria-label="Canais de notificações" className="my-4 flex flex-wrap gap-2">{tabs.map((tab, index) => <button type="button" role="tab" id={id + index} aria-controls={id + '-panel'} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} className="student-chat-tab" key={tab.label} onClick={() => setSelected(index)} onKeyDown={event => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
        setSelected(next); document.getElementById(id + next)?.focus()
      }}>{tab.label} <span className="student-chat-badge">{count(tab.items.length)}</span></button>)}</div>
      <div role="tabpanel" id={id + '-panel'} aria-labelledby={id + selected}>
        {query.isPending && <p role="status">A carregar notificações…</p>}
        {query.isError && <p role="alert">Não foi possível carregar as orientações. <button onClick={() => void query.refetch()}>Tentar novamente</button></p>}
        <ul className="space-y-3">{tabs[selected].items.map(message => <li key={message.id} className="rounded border p-3">
          <p className="font-semibold text-blue-700">{message.activityTitle}</p><strong>{message.author}</strong><p className="my-2 whitespace-pre-wrap">{message.message}</p>
          <div className="flex flex-wrap gap-4 text-sm"><Link to={journeyPaths.activity(message.activityId) + '?canal=' + ('incoming' in message ? 'teacher' : 'group')} onClick={() => setOpen(false)} className="text-blue-700 underline">Abrir conversa</Link><button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'resolve-notification', id: message.id, revision: snapshot.revision })}>Marcar como resolvida</button></div>
        </li>)}</ul>
        {!query.isPending && !query.isError && !tabs[selected].items.length && <p>Sem notificações por resolver.</p>}
        {activityId && <Link className="mt-4 block text-blue-700 underline" onClick={() => setOpen(false)} to={journeyPaths.activity(activityId) + '?canal=' + (selected === 1 ? 'group' : 'teacher')}>Consultar histórico da actividade</Link>}
        {mutation.error && <p role="alert">{mutation.error.message}</p>}
      </div>
    </Dialog>
  </>
}
