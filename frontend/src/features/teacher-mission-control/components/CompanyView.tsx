import { Check, Flag, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { Company, TeacherSnapshot } from '../types'
import { activityParticipants, hasSimulatedParticipation, companyProgress, daysUntil, formatDay, aggregateStatus, pendingOrientationRequests } from '../services/teacher.selectors'
import { MetricCards } from './MetricCards'
import { TeacherStatusBadge } from './TeacherStatusBadge'
import '../styles.css'
export function CompanyView({ company, snapshot, blockId, onBlock, onOpen, onRequests }: {
  company: Company; snapshot: TeacherSnapshot; blockId: string; onBlock: (id: string) => void;
  onOpen: (activityId: string, resultId?: string) => void; onRequests: () => void
}) {
  const activities = company.activities.filter(a => a.blockId === blockId)
  const active = company.activities.filter(a => a.status === 'in-progress').length
  const due = company.activities.filter(a => a.status !== 'completed' && daysUntil(a.dueDate, snapshot.context.asOf) >= 0 && daysUntil(a.dueDate, snapshot.context.asOf) <= snapshot.context.dueSoonDays).length
  return <div className="teacher-stack teacher-company-view">
    <MetricCards items={[
      { label: 'Progresso global', value: companyProgress(company) + '%', icon: 'progress', tone: 'green' },
      { label: 'Actividades em curso', value: active, icon: 'active', tone: 'blue' },
      { label: 'Pedidos de orientação', value: pendingOrientationRequests(snapshot, company.id).length, icon: 'alerts', tone: 'red', onClick: onRequests },
      { label: 'Prazos próximos', value: due, icon: 'active', tone: 'amber' },
    ]} />
    <section className="spee-panel teacher-section">
      <h2>Percurso da empresa</h2>
      <div className="teacher-steps" aria-label="Blocos do percurso">{company.blocks.map((block, index) => {
        const status = block.state && block.state !== 'unavailable' ? block.state : aggregateStatus(company.activities.filter(a => a.blockId === block.id))
        return <button key={block.id} aria-pressed={blockId === block.id} onClick={() => onBlock(block.id)}><span className={'teacher-step-icon teacher-cell--' + status}>{status === 'completed' ? <Check size={23} /> : index === company.blocks.length - 1 ? <Flag size={23} /> : index + 1}</span><strong>{block.title}</strong>{block.state === 'unavailable' ? <span className="teacher-muted">Brevemente</span> : <TeacherStatusBadge status={status} />}{index < company.blocks.length - 1 && <ChevronRight className="teacher-step-arrow" size={19} />}</button>
      })}</div>
    </section>
    <section className="spee-panel teacher-section">
      <div className="teacher-section-heading"><h2>{company.blocks.find(b => b.id === blockId)?.title} <span className="teacher-muted">· Actividades</span></h2></div>
      <div className="teacher-table-scroll" tabIndex={0} role="region" aria-label="Actividades do bloco"><table className="teacher-table"><thead><tr><th>Actividade</th><th>Participantes</th><th>Estado</th><th>Prazo</th><th><span className="sr-only">Detalhe</span></th></tr></thead><tbody>{activities.map(activity => <tr key={activity.id}><th scope="row">{activity.title}<small>{activity.module}</small></th><td>{activityParticipants(company, activity).map(p => p.name).join(' + ') || 'Sem evidência'}</td><td><TeacherStatusBadge status={activity.status} /></td><td>{formatDay(activity.dueDate)}</td><td><Button variant="outline" size="sm" aria-label={'Detalhes de ' + activity.title} onClick={() => onOpen(activity.id)}>Detalhes</Button></td></tr>)}</tbody></table></div>
      {activities.some(hasSimulatedParticipation) && <p className="teacher-footnote">Inclui participantes simulados nas actividades concluídas, de acordo com as tarefas da equipa.</p>}
      {!activities.length && <p className="teacher-empty">Este bloco ainda não tem actividades definidas no roteiro.</p>}
    </section>
  </div>
}
