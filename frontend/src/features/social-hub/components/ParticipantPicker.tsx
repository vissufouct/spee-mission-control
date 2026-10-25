import { useId, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { SocialSnapshot } from '../schemas/social.schema'
import { searchParticipants } from '../services/participant-search'

type Member = SocialSnapshot['members'][number]
type Props = {
  members: Member[]
  selected?: string[]
  multiple?: boolean
  disabled?: boolean
  onChoose: (id: string) => void
}

export function ParticipantPicker({ members, selected = [], multiple = false, disabled = false, onChoose }: Props) {
  const id = useId()
  const [search, setSearch] = useState('')
  const matches = searchParticipants(members, search)
  return <div className="social-participant-picker">
    <label htmlFor={id}>Pesquisar participantes por nome ou turma</label>
    <div className="social-participant-search"><Search size={16} aria-hidden /><input id={id} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nome ou turma…" aria-controls={id + '-results'} autoComplete="off" /></div>
    {multiple && selected.length > 0 && <div className="social-selected-members" aria-label="Participantes seleccionados">{members.filter(member => selected.includes(member.id)).map(member => <button key={member.id} type="button" disabled={disabled} onClick={() => onChoose(member.id)} aria-label={`Retirar ${member.name} · ${member.className}`}><span>{member.name} · {member.className}</span><X size={13} aria-hidden /></button>)}</div>}
    <p className="social-picker-caption" role="status">{matches.length} {matches.length === 1 ? 'participante encontrado' : 'participantes encontrados'}{multiple ? ` · ${selected.length} ${selected.length === 1 ? 'seleccionado' : 'seleccionados'}` : ''}</p>
    <ul id={id + '-results'} className="social-participant-results" aria-label="Resultados da pesquisa de participantes">{matches.map(member => <li key={member.id}>{multiple
      ? <label><input type="checkbox" checked={selected.includes(member.id)} disabled={disabled} onChange={() => onChoose(member.id)} /><span>{member.name} · {member.className}</span></label>
      : <button type="button" disabled={disabled} onClick={() => onChoose(member.id)} aria-label={`Conversar com ${member.name} · ${member.className}`}><span>{member.name}</span><small>{member.className}</small></button>
    }</li>)}</ul>
    {matches.length === 0 && <p className="social-picker-caption">Nenhum participante encontrado. Experimente outro nome ou turma.</p>}
  </div>
}
