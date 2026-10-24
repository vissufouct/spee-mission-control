import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** Progressive local history; the viewport stays anchored when older messages are prepended. */
export function ChatHistory<T extends { id: string }>({ messages, renderMessage }: { messages: T[]; renderMessage: (message: T) => ReactNode }) {
  const [limit, setLimit] = useState(20)
  const viewport = useRef<HTMLDivElement>(null)
  const previous = useRef<{ height: number; top: number } | null>(null)
  const atBottom = useRef(true)
  const lastId = messages.at(-1)?.id
  const hasMore = messages.length > limit
  function loadOlder() {
    if (!hasMore || previous.current || !viewport.current) return
    previous.current = { height: viewport.current.scrollHeight, top: viewport.current.scrollTop }
    setLimit(value => value + 20)
  }
  useLayoutEffect(() => {
    const node = viewport.current
    if (!node) return
    if (previous.current) {
      node.scrollTop = previous.current.top + node.scrollHeight - previous.current.height
      previous.current = null
    } else if (atBottom.current) node.scrollTop = node.scrollHeight
  }, [limit, lastId])
  return <div ref={viewport} className="student-chat-history" role="region" aria-label="Histórico da conversa" tabIndex={0} onScroll={event => {
    const node = event.currentTarget
    atBottom.current = node.scrollHeight - node.scrollTop - node.clientHeight < 80
    if (node.scrollTop < 40) loadOlder()
  }}>
    {hasMore && <button type="button" className="block mx-auto text-sm text-blue-700 underline p-2" onClick={loadOlder}>Carregar mensagens anteriores</button>}
    <ul className="space-y-3">{messages.slice(-limit).map(message => <li key={message.id}>{renderMessage(message)}</li>)}</ul>
    {!messages.length && <p className="text-center text-sm text-slate-500 py-8">Ainda não há mensagens nesta actividade.</p>}
  </div>
}
