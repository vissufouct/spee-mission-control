import { MessageSquare, type LucideIcon } from 'lucide-react'
export function NotificationTile({ title, items, onOpen, loading = false, icon: Icon = MessageSquare }: {
  title: string; items: { id: string; author: string; message: string; activityTitle: string }[]; onOpen: () => void; loading?: boolean; icon?: LucideIcon
}) {
  return <button type="button" className="student-notification-tile" aria-label={title + ' (' + items.length + ')'} onClick={onOpen}>
    <span className="flex items-center justify-between gap-3 font-semibold text-sm"><span className="flex items-center gap-2"><Icon size={19} className="shrink-0 text-blue-600" aria-hidden />{title}</span><span className="student-chat-badge">{loading ? '…' : items.length}</span></span>
    {loading ? <span className="block mt-3 text-xs text-slate-500">A carregar…</span> : items.length ? <span className="block mt-2 divide-y">{items.slice(0, 3).map(m => <span key={m.id} className="block py-2 text-xs text-slate-600"><span className="block font-semibold text-blue-700 mb-1">{m.activityTitle}</span><strong>{m.author}</strong><span className="block truncate">{m.message}</span></span>)}</span> : <span className="block mt-3 text-xs text-slate-500">Sem notificações pendentes.</span>}
  </button>
}
