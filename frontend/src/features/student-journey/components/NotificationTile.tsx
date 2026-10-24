export function NotificationTile({ title, items, onOpen, loading = false }: {
  title: string; items: { id: string; author: string; message: string }[]; onOpen: () => void; loading?: boolean
}) {
  return <button type="button" className="student-notification-tile" aria-label={title + ' (' + items.length + ')'} onClick={onOpen}>
    <span className="flex items-center justify-between gap-3 font-semibold text-sm"><span>{title}</span><span className="student-chat-badge">{loading ? '…' : items.length}</span></span>
    {loading ? <span className="block mt-3 text-xs text-slate-500">A carregar…</span> : items.length ? <span className="block mt-2 divide-y">{items.slice(0, 3).map(m => <span key={m.id} className="block py-2 text-xs text-slate-600"><strong>{m.author}</strong><span className="block truncate">{m.message}</span></span>)}</span> : <span className="block mt-3 text-xs text-slate-500">Sem notificações pendentes.</span>}
  </button>
}
