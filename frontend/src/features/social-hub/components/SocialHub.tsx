import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, X, UsersRound, Plus, MessageCircle } from 'lucide-react'
import { useSocial } from '../hooks/SocialProvider'
import { SocialMessageCard } from './SocialMessageCard'
import { SocialComposer } from './SocialComposer'
import { SocialChannelForm } from './SocialChannelForm'
import { PrivateMessagePicker } from './PrivateMessagePicker'
import '../social-hub.css'
import { unreadCounts } from '../services/unreadCounts'
import { conversationMessages } from '../services/conversationMessages'

export function SocialHub() {
  const { query, mutation } = useSocial()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'public' | 'group' | 'direct'>('public')
  const [active, setActive] = useState('community')
  const [creating, setCreating] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [limit, setLimit] = useState(20)
  const messageEnd = useRef<HTMLDivElement>(null)
  const sending = useRef(false)
  const scrollArea = useRef<HTMLDivElement>(null)
  const unreadMarker = useRef<HTMLDivElement>(null)
  const enteredConversation = useRef('')
  const olderPosition = useRef<{ height: number; top: number } | null>(null)
  const snapshot = query.data
  const counts = unreadCounts(snapshot)
  const unread = counts.total
  const invitations = snapshot?.channels.filter(c => c.invited.includes(snapshot.currentUserId)) ?? []
  const channel = snapshot?.channels.find(c => c.id === active && (c.kind === 'public' || c.members.includes(snapshot.currentUserId)))
  const { messages, firstUnread } = conversationMessages(snapshot, channel?.id)
  const channelId = channel?.id
  const start = Math.min(Math.max(0, messages.length - limit), firstUnread < 0 ? messages.length : firstUnread)
  useEffect(() => {
    if (!open || creating) { enteredConversation.current = ''; return }
    if (!channelId) return
    if (enteredConversation.current !== channelId) {
      enteredConversation.current = channelId
      const frame = requestAnimationFrame(() => {
        const target = unreadMarker.current ?? messageEnd.current
        target?.scrollIntoView({ block: unreadMarker.current ? 'start' : 'end' })
      })
      return () => { cancelAnimationFrame(frame); enteredConversation.current = '' }
    }
  }, [open, creating, channelId])
  useEffect(() => {
    if (olderPosition.current && scrollArea.current) {
      scrollArea.current.scrollTop = olderPosition.current.top + scrollArea.current.scrollHeight - olderPosition.current.height
      olderPosition.current = null
    }
  }, [limit])
  useEffect(() => {
    if (sending.current) {
      sending.current = false
      requestAnimationFrame(() => { if (scrollArea.current) scrollArea.current.scrollTop = scrollArea.current.scrollHeight })
    }
  }, [messages.length])
  const loadOlder = () => {
    if (scrollArea.current) olderPosition.current = { height: scrollArea.current.scrollHeight, top: scrollArea.current.scrollTop }
    setLimit(messages.length - start + 20)
  }
  const switchChannel = (id: string) => { setActive(id); setReply(null); setLimit(20); mutation.reset() }
  const name = (id: string) => snapshot?.members.find(m => m.id === id)?.name ?? 'Participante'
  const channelName = channel?.kind === 'direct' ? name(channel.members.find(id => id !== snapshot?.currentUserId) ?? '') : channel?.name
  const dismiss = (value: boolean) => { setOpen(value); mutation.reset() }
  return <Dialog.Root open={open} onOpenChange={dismiss}>
    <Dialog.Trigger asChild><button className="social-hub-launcher" aria-label={`Abrir hub social, ${unread} mensagens por ler${invitations.length ? `, ${invitations.length} convites` : ''}`}><ChevronLeft size={19} /><span aria-hidden>{unread || (invitations.length ? '!' : '•')}</span></button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="social-hub-overlay" /><Dialog.Content className="social-hub-panel">
      <header className="social-hub-header"><div><span className="social-hub-eyebrow">ESPAÇO DOS PARTICIPANTES</span><Dialog.Title><UsersRound size={23} />Hub social <span className="social-count">{unread}</span></Dialog.Title><Dialog.Description>Ideias, perguntas e entreajuda entre turmas.</Dialog.Description></div><Dialog.Close aria-label="Fechar hub social"><X size={22} /></Dialog.Close></header>
      {query.isPending ? <p role="status" className="social-empty">A carregar as conversas…</p> : query.isError ? <div className="social-empty" role="alert"><p>{query.error.message}</p><button onClick={() => { void query.refetch() }}>Tentar novamente</button></div> : snapshot && <>
        <div className="social-hub-tools"><button onClick={() => { setCreating(!creating); mutation.reset() }} aria-expanded={creating}><Plus size={16} />Criar grupo</button><span>{snapshot.members.length} participantes · 3 turmas</span></div>
        <div className="social-hub-tabs" role="group" aria-label="Tipo de conversa">{(['public', 'group', 'direct'] as const).map(kind => <button key={kind} aria-pressed={tab === kind} aria-description={`${counts.kinds[kind]} mensagens por ler${kind === 'group' && invitations.length ? `; ${invitations.length} convites pendentes` : ''}`} onClick={() => { setTab(kind); setCreating(false); switchChannel(snapshot.channels.find(c => c.kind === kind && (kind === 'public' || c.members.includes(snapshot.currentUserId)))?.id ?? '') }}>{kind === 'public' ? 'Comunidade' : kind === 'group' ? 'Grupos' : 'Privadas'} <span aria-hidden className={`social-count${counts.kinds[kind] ? '' : ' social-count--empty'}`}>{counts.kinds[kind]}</span>{kind === 'group' && invitations.length > 0 && <span className="social-invite-dot" aria-hidden title={`${invitations.length} convites pendentes`}>•</span>}</button>)}</div>
        <div className="social-hub-scroll" ref={scrollArea} onScroll={event => { if (event.currentTarget.scrollTop < 24 && start > 0 && !olderPosition.current) loadOlder() }}>
          <p className="social-local-note">Conversa simulada, guardada apenas neste browser.</p>
          {mutation.isError && <div className="social-error" role="alert">{mutation.error.message}<button onClick={() => { void query.refetch(); mutation.reset() }}>Actualizar dados</button></div>}
          {creating ? <SocialChannelForm snapshot={snapshot} pending={mutation.isPending} onCancel={() => setCreating(false)} onCreate={async (name, invitees) => { const result = await mutation.mutateAsync({ type: 'group', name, invitees }); setCreating(false); setTab('group'); switchChannel(result.channels.at(-1)!.id) }} /> : <>
            {tab === 'group' && invitations.map(invitation => <section className="social-invitation" key={invitation.id}><strong>Convite: {invitation.name}</strong><p>De {name(invitation.members[0])}</p><div><button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'invitation', channelId: invitation.id, accept: true }, { onSuccess: () => switchChannel(invitation.id) })}>Aceitar convite</button><button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'invitation', channelId: invitation.id, accept: false })}>Recusar</button></div></section>)}
            {tab === 'direct' && <PrivateMessagePicker snapshot={snapshot} pending={mutation.isPending} onChoose={async memberId => {
              const result = await mutation.mutateAsync({ type: 'direct', memberId })
              switchChannel(result.channels.find(c => c.kind === 'direct' && c.members.includes(memberId))!.id)
            }} />}
            {tab !== 'public' && <div className="social-channel-list" aria-label="Conversas disponíveis">{snapshot.channels.filter(c => c.kind === tab && c.members.includes(snapshot.currentUserId)).map(c => <button key={c.id} aria-pressed={c.id === active} aria-description={`${counts.channels[c.id] ?? 0} mensagens por ler`} onClick={() => switchChannel(c.id)}>{c.kind === 'direct' ? name(c.members.find(id => id !== snapshot.currentUserId)!) : c.name} <span aria-hidden className={`social-count${counts.channels[c.id] ? '' : ' social-count--empty'}`}>{counts.channels[c.id] ?? 0}</span></button>)}</div>}
            {channel ? <><div className="social-conversation-title"><h3><MessageCircle size={17} />{channelName}</h3><button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'read', channelId: channel.id })}>Marcar como lida</button></div>
              {channel.kind === 'group' && <p className="social-local-note">Membros: {channel.members.map(name).join(', ')}{channel.invited.length > 0 && ` · Convites pendentes: ${channel.invited.map(name).join(', ')}`}</p>}
              {start > 0 && <button className="social-load-more" onClick={loadOlder}>Mostrar mensagens anteriores</button>}
              {!messages.length && <p className="social-empty">Ainda não há mensagens. Comece a conversa.</p>}
              <div className="social-messages" aria-label="Mensagens">{messages.slice(start).map(message => <div key={message.id}>{message.id === messages[firstUnread]?.id && <div className="social-unread-marker" ref={unreadMarker}>Mensagens por ler</div>}<SocialMessageCard message={message} snapshot={snapshot} disabled={mutation.isPending} onReply={() => { setReply(message.id); document.getElementById('social-message')?.focus() }} onReact={emoji => mutation.mutate({ type: 'react', messageId: message.id, emoji })} /></div>)}</div><div ref={messageEnd} />
            </> : <p className="social-empty">Escolha uma conversa ou crie um grupo para começar.</p>}
          </>}
        </div>
        {!creating && channel && <SocialComposer key={channel.id} pending={mutation.isPending} replyName={reply ? name(snapshot.messages.find(m => m.id === reply)?.authorId ?? '') : undefined} onCancelReply={() => setReply(null)} onSend={async (text, gif) => { sending.current = true; try { await mutation.mutateAsync({ type: 'post', channelId: channel.id, text, gif, replyTo: reply }); setReply(null) } catch (error) { sending.current = false; throw error } }} />}
      </>}
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
