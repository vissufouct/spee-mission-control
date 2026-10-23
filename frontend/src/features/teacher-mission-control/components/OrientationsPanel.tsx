import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { useTeacherMutation } from '../hooks/useTeacher'
import { OrientationForm } from './OrientationForm'
import { formatInstant } from '../services/teacher.selectors'
import type { Company, Orientation, OrientationInput, TeacherSnapshot } from '../types'

export function OrientationsPanel({ company, snapshot }: { company: Company; snapshot: TeacherSnapshot }) {
  const [editing, setEditing] = useState<Orientation | 'new' | null>(null)
  const [confirmation, setConfirmation] = useState<{ note: Orientation; action: 'record' | 'remove' } | null>(null)
  const [feedback, setFeedback] = useState('')
  const mutation = useTeacherMutation()
  const notes = snapshot.orientations.filter(n => n.companyId === company.id)
  const audit = snapshot.audit.filter(e => e.companyId === company.id)
  const startEdit = (value: Orientation | 'new') => { mutation.reset(); setEditing(value); setFeedback('') }
  const save = (input: OrientationInput) => mutation.mutate({ type: 'save', input, revision: snapshot.revision, id: editing && editing !== 'new' ? editing.id : undefined }, {
    onSuccess: () => { setEditing(null); setFeedback('Rascunho guardado neste browser.') },
  })
  const confirm = () => { if (confirmation) mutation.mutate({ type: confirmation.action, id: confirmation.note.id, revision: snapshot.revision }, {
    onSuccess: () => { setFeedback(confirmation.action === 'remove' ? 'Rascunho eliminado. O histórico foi preservado.' : 'Orientação registada localmente. Não foi enviada qualquer mensagem.'); setConfirmation(null) },
  }) }
  const actionLabels = { created: 'Rascunho criado', updated: 'Rascunho alterado', removed: 'Rascunho eliminado', recorded: 'Orientação registada' }
  return <section className="spee-panel teacher-section">
    <div className="teacher-section-heading"><h2>Orientações do docente</h2><Button size="sm" onClick={() => startEdit('new')}>Nova orientação</Button></div>
    <p className="teacher-hint">Experiência local de acompanhamento. Não altera estados, resultados ou progresso.</p>
    {feedback && <p className="teacher-feedback" role="status">{feedback}</p>}
    {notes.length ? <ul className="teacher-notes">{notes.map(note => <li key={note.id}><div><strong>{note.subject}</strong><span className="teacher-note-state">{note.status === 'draft' ? 'Rascunho' : 'Registada · só consulta'}</span><p className="teacher-note-message">{note.message}</p><small>{company.activities.find(a => a.id === note.activityId)?.title} · {note.author} · {formatInstant(note.updatedAt)}</small><p className="teacher-hint">Motivo: {note.reason}</p></div><div className="teacher-actions">{note.status === 'draft' && <><Button variant="outline" size="sm" onClick={() => startEdit(note)}>Editar</Button><Button variant="outline" size="sm" onClick={() => { mutation.reset(); setConfirmation({ note, action: 'remove' }) }}>Eliminar</Button><Button size="sm" onClick={() => { mutation.reset(); setConfirmation({ note, action: 'record' }) }}>Registar orientação</Button></>}</div></li>)}</ul> : <div className="teacher-empty"><p>Ainda não existem orientações para esta empresa.</p><p>Comece por um rascunho com o contexto e o motivo.</p></div>}
    <details className="teacher-audit"><summary>Histórico das orientações ({audit.length})</summary>{audit.length ? <ul>{[...audit].reverse().map(event => <li key={event.id}><strong>{actionLabels[event.action]}</strong> · {event.actor} · {formatInstant(event.occurredAt)}<p>{event.reason}</p></li>)}</ul> : <p>Sem alterações registadas.</p>}</details>
    <Dialog open={!!editing} onOpenChange={open => { if (!open && !mutation.isPending) setEditing(null) }} title={editing === 'new' ? 'Nova orientação' : 'Editar orientação'} description={company.name}>
      {editing && <OrientationForm key={editing === 'new' ? 'new' : editing.id} company={company} initial={editing === 'new' ? undefined : editing} pending={mutation.isPending} error={mutation.error?.message} onSave={save} onCancel={() => setEditing(null)} />}
    </Dialog>
    <Dialog open={!!confirmation} onOpenChange={open => { if (!open && !mutation.isPending) setConfirmation(null) }} title={confirmation?.action === 'remove' ? 'Eliminar rascunho?' : 'Registar orientação local?'} description={confirmation?.note.subject}>
      <div className="teacher-stack mt-5"><p>{confirmation?.action === 'remove' ? 'O rascunho será eliminado deste browser. O histórico da intervenção será mantido.' : 'A orientação ficará em modo de consulta e não poderá ser editada ou eliminada. Não será enviada uma mensagem ao estudante, nem alterado o seu progresso.'}</p>
        {mutation.error && <p role="alert" className="text-red-700">{mutation.error.message}</p>}
        <div className="teacher-actions"><Button variant="outline" disabled={mutation.isPending} onClick={() => setConfirmation(null)}>Cancelar</Button><Button disabled={mutation.isPending} onClick={confirm}>{mutation.isPending ? 'A guardar…' : confirmation?.action === 'remove' ? 'Confirmar eliminação' : 'Confirmar registo local'}</Button></div>
      </div>
    </Dialog>
  </section>
}
