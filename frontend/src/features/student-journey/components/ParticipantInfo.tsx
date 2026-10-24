import { useId, useState } from 'react'
import { Info } from 'lucide-react'

export function ParticipantInfo({ participants }: { participants: { name: string; contribution: string }[] }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const names = participants.map(({ name }) => {
    const parts = name.trim().split(/\s+/)
    return parts.length > 1 ? `${parts[0]} ${parts.at(-1)![0]}.` : name
  })
  return <div className="student-participant" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <span><strong>Participantes:</strong> {names.length ? new Intl.ListFormat('pt-PT', { type: 'conjunction' }).format(names) : 'Sem participantes indicados.'}</span>
    {names.length > 0 && <button type="button" className="student-participant-info" aria-label="Informação sobre os participantes" aria-describedby={open ? id : undefined} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => setOpen(true)} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false) } }}><Info size={16} aria-hidden /></button>}
    {open && names.length > 0 && <div id={id} role="tooltip" className="student-participant-tooltip"><ul className="space-y-2">{participants.map(person => <li key={person.name}><strong>{person.name}</strong><p>{person.contribution}</p></li>)}</ul></div>}
  </div>
}
