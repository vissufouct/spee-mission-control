import { useId, useRef, useState } from 'react'
import { Info } from 'lucide-react'

export function ParticipantInfo({ participants, showLabel = true }: { participants: { name: string; contribution: string }[]; showLabel?: boolean }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const names = participants.map(({ name }) => {
    const parts = name.trim().split(/\s+/)
    return parts.length > 1 ? `${parts[0]} ${parts.at(-1)![0]}.` : name
  })
  return <div className="student-participant" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); trigger.current?.focus(); setOpen(false) } }}>
    <span>{showLabel && <strong>Participantes: </strong>}{names.length ? new Intl.ListFormat('pt-PT', { type: 'conjunction' }).format(names) : <span aria-label="Sem participantes indicados">{showLabel ? 'Sem participantes indicados.' : '—'}</span>}</span>
    {names.length > 0 && <button ref={trigger} type="button" className="student-participant-info" aria-label="Informação sobre os participantes" aria-describedby={open ? id : undefined} onFocus={() => setOpen(true)} onClick={() => setOpen(true)}><Info size={16} aria-hidden /></button>}
    {open && names.length > 0 && <div id={id} role="tooltip" tabIndex={0} className="student-participant-tooltip"><ul className="space-y-2">{participants.map(person => <li key={person.name}><strong>{person.name}</strong><p>{person.contribution}</p></li>)}</ul></div>}
  </div>
}
