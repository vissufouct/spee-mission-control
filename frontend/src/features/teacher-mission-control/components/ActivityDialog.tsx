import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { TeacherStatusBadge } from './TeacherStatusBadge'
import type { Company } from '../types'
import { formatInstant } from '../services/teacher.selectors'
import { useState } from 'react'
import { ActivityTasksReview } from './ActivityTasksReview'
export type ActivitySelection = { activityId: string; resultId?: string }
export function ActivityDialog({ company, selection, onSelect }: { company: Company; selection: ActivitySelection | null; onSelect: (value: ActivitySelection | null) => void }) {
  const [moduleActivityId, setModuleActivityId] = useState<string | null>(null)
  const activity = company.activities.find(a => a.id === selection?.activityId)
  const result = company.results.find(r => r.id === selection?.resultId && r.activityId === activity?.id)
  const modulePreview = moduleActivityId === activity?.id && !result
  return <Dialog className="teacher-dialog" open={!!activity} onOpenChange={open => { if (!open) { setModuleActivityId(null); onSelect(null) } }} title={result?.title ?? activity?.title ?? 'Actividade'} description={company.name + ' · ' + (activity?.module ?? '')}>
    {activity && <div className="teacher-stack mt-6">
      {result ? <>
        <Button variant="outline" size="sm" className="self-start" onClick={() => { setModuleActivityId(null); onSelect({ activityId: activity.id }) }}>Voltar à actividade</Button>
        <p className="teacher-disclaimer">SIMULAÇÃO LOCAL — SEM VALIDADE OFICIAL</p>
        <p className="text-sm text-slate-600">{result.description}</p>
        <dl className="teacher-result-fields"><div><dt>Referência</dt><dd>{result.reference}</dd></div><div><dt>Confirmado em</dt><dd>{formatInstant(result.confirmedAt)}</dd></div>{result.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
      </> : modulePreview ? <>
        <Button variant="outline" size="sm" className="self-start" onClick={() => setModuleActivityId(null)}>Voltar aos detalhes</Button>
        <div className="teacher-module-preview"><span>Módulo do simulador</span><h3>{activity.module}</h3><p>{company.name} · {activity.title}</p><p>Este destino representa a passagem contextual para o módulo operacional. O protótipo preserva a empresa e a actividade seleccionadas.</p></div>
        {activity.resultIds.length ? <Button className="self-start" onClick={() => onSelect({ activityId: activity.id, resultId: activity.resultIds[0] })}>Consultar resultado disponível</Button> : <p className="teacher-hint">Ainda não existe um resultado confirmado. No simulador, o docente abriria o ecrã operacional desta actividade em modo de consulta.</p>}
      </> : <>
        <TeacherStatusBadge status={activity.status} />
        <ActivityTasksReview tasks={activity.tasks} />
        <div className="teacher-activity-detail-grid">
          <section><h3>Descrição</h3><p>{activity.description ?? `Actividade realizada no módulo ${activity.module}, no contexto do percurso desta empresa.`}</p></section>
          <section><h3>O que significa concluída</h3><p>{activity.definitionOfDone ?? 'Os critérios definidos para a actividade foram cumpridos e existe um resultado ou evidência confirmada.'}</p></section>
          <section><h3>Participantes com evidência</h3><p>{company.participants.filter(p => activity.participantIds.includes(p.id)).map(p => p.name).join(', ') || 'Ainda sem evidência individual.'}</p></section>
          <section><h3>Dependências</h3><p>{activity.dependencyIds.map(id => company.activities.find(item => item.id === id)?.title).filter(Boolean).join(', ') || 'Sem dependências registadas.'}</p></section>
        </div>
        <div><h3 className="font-semibold">Próximo passo</h3><p className="mt-2 text-sm text-slate-600">{activity.nextStep}</p></div>
        <div className="teacher-actions teacher-actions--between"><div><h3 className="mb-2 font-semibold">Resultados associados</h3>{activity.resultIds.length ? <ul className="space-y-2">{activity.resultIds.map(id => <li key={id}><button className="teacher-text-link" onClick={() => onSelect({ activityId: activity.id, resultId: id })}>{company.results.find(r => r.id === id)?.title} →</button></li>)}</ul> : <p className="text-sm text-slate-500">Ainda não existe um resultado confirmado.</p>}</div><Button onClick={() => setModuleActivityId(activity.id)}>Ver no simulador</Button></div>
      </>}
      <p className="teacher-footnote">Consulta local para validação da experiência. Abrir detalhes ou o destino simulado não altera o progresso.</p>
    </div>}
  </Dialog>
}
