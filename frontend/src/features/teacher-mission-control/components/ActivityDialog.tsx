import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { TeacherStatusBadge } from './TeacherStatusBadge'
import { EventTrail } from './EventTrail'
import type { Company } from '../types'
import { formatInstant } from '../services/teacher.selectors'
export type ActivitySelection = { activityId: string; resultId?: string }
export function ActivityDialog({ company, selection, onSelect }: { company: Company; selection: ActivitySelection | null; onSelect: (value: ActivitySelection | null) => void }) {
  const activity = company.activities.find(a => a.id === selection?.activityId)
  const result = company.results.find(r => r.id === selection?.resultId && r.activityId === activity?.id)
  return <Dialog open={!!activity} onOpenChange={open => { if (!open) onSelect(null) }} title={result?.title ?? activity?.title ?? 'Actividade'} description={company.name + ' · ' + (activity?.module ?? '')}>
    {activity && <div className="teacher-stack mt-6">
      {result ? <>
        <Button variant="outline" size="sm" className="self-start" onClick={() => onSelect({ activityId: activity.id })}>Voltar à actividade</Button>
        <p className="teacher-disclaimer">SIMULAÇÃO LOCAL — SEM VALIDADE OFICIAL</p>
        <p className="text-sm text-slate-600">{result.description}</p>
        <dl className="teacher-result-fields"><div><dt>Referência</dt><dd>{result.reference}</dd></div><div><dt>Confirmado em</dt><dd>{formatInstant(result.confirmedAt)}</dd></div>{result.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
      </> : <>
        <TeacherStatusBadge status={activity.status} />
        <div><h3 className="font-semibold">Contexto e próximo passo</h3><p className="mt-2 text-sm text-slate-600">{activity.nextStep}</p></div>
        <p className="text-sm">Participação confirmada: {company.participants.filter(p => activity.participantIds.includes(p.id)).map(p => p.name).join(', ') || 'Ainda sem evidência individual.'}</p>
        <div><h3 className="mb-3 font-semibold">Resultados associados</h3>{activity.resultIds.length ? <ul className="space-y-2">{activity.resultIds.map(id => <li key={id}><button className="teacher-text-link" onClick={() => onSelect({ activityId: activity.id, resultId: id })}>{company.results.find(r => r.id === id)?.title} →</button></li>)}</ul> : <p className="text-sm text-slate-500">Ainda não existe um resultado confirmado.</p>}</div>
        <EventTrail company={company} events={company.events.filter(e => e.activityId === activity.id).sort((a,b) => b.occurredAt.localeCompare(a.occurredAt))} onOpen={(activityId, resultId) => onSelect({ activityId, resultId })} />
      </>}
      <p className="teacher-footnote">Consulta local. A ligação ao módulo operacional será integrada numa fase posterior. Abrir este detalhe não altera o progresso.</p>
    </div>}
  </Dialog>
}
