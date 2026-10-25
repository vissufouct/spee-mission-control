import { useState } from 'react'
import { ParticipantPicker } from './ParticipantPicker'
import type { SocialSnapshot } from '../schemas/social.schema'

export function PrivateMessagePicker({ snapshot, pending, onChoose }: { snapshot: SocialSnapshot; pending: boolean; onChoose: (id: string) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  return <section className="social-private-picker" aria-label="Nova mensagem privada">
    <button type="button" className="social-private-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fechar pesquisa de participantes' : 'Nova mensagem privada'}</button>
    {open && <ParticipantPicker members={snapshot.members.filter(member => member.id !== snapshot.currentUserId)} disabled={pending} onChoose={id => {
      void onChoose(id).then(() => setOpen(false)).catch(() => { /* Keep the search; the hub displays the repository error. */ })
    }} />}
  </section>
}
