import { Button } from '@/shared/components/ui/button'
import type { Company, TeacherSnapshot } from '../types'
import { contributionEvents, companyAlerts } from '../services/teacher.selectors'
import { MetricCards } from './MetricCards'
import { EventTrail } from './EventTrail'
import { TeacherStatusBadge } from './TeacherStatusBadge'
import '../styles.css'
const categories = [{ id: 'confirmed', label: 'Contribuição confirmada' }, { id: 'collective', label: 'Acções colectivas' }, { id: 'automatic', label: 'Eventos automáticos' }]
export function ContributionView({ company, snapshot, category, onCategory, onOpen }: {
  company: Company; snapshot: TeacherSnapshot; category: string; onCategory: (value: string) => void;
  onOpen: (activityId: string, resultId?: string) => void
}) {
  const events = contributionEvents(company, category)
  const participants = company.participants.filter(p => events.some(e => e.actorIds.includes(p.id))).sort((a,b) => a.name.localeCompare(b.name, 'pt'))
  const results = company.results.filter(r => events.some(e => e.resultId === r.id))
  const rows = company.activities.filter(a => events.some(e => e.activityId === a.id))
  return <div className="teacher-contribution-layout">
    <div className="teacher-stack">
      <MetricCards items={[
        { label: 'Participantes com evidência', value: participants.length, icon: 'participants', tone: 'blue' },
        { label: 'Eventos confirmados', value: events.length, icon: 'actions', tone: 'blue' },
        { label: 'Resultados associados', value: results.length, icon: 'results', tone: 'green' },
        { label: 'Alertas da empresa', value: companyAlerts(company, snapshot).length, icon: 'alerts', tone: 'amber' },
      ]} />
      <section className="spee-panel teacher-section">
        <h2>Contribuição confirmada por actividade</h2>
        <div className="teacher-tabs" aria-label="Tipo de contribuição">{categories.map(tab => <button key={tab.id} aria-pressed={category === tab.id} onClick={() => onCategory(tab.id)}>{tab.label}</button>)}</div>
        <div className="teacher-table-scroll" role="region" tabIndex={0} aria-label="Contribuições por actividade"><table className="teacher-table teacher-contributions"><thead><tr><th>Actividade</th><th>Participantes / origem</th><th>Eventos</th><th>Resultado</th><th>Estado actual</th><th><span className="sr-only">Detalhe</span></th></tr></thead><tbody>{rows.map(activity => {
          const matches = events.filter(e => e.activityId === activity.id)
          const result = results.find(r => r.activityId === activity.id)
          return <tr key={activity.id}><th scope="row">{activity.title}</th><td>{participants.filter(p => matches.some(e => e.actorIds.includes(p.id))).map(p => p.name).join(' + ') || 'Sistema'}</td><td>{matches.length}</td><td>{result ? <button className="teacher-text-link" onClick={() => onOpen(activity.id, result.id)}>{result.reference}</button> : 'Sem resultado'}</td><td><TeacherStatusBadge status={activity.status} /></td><td><Button variant="outline" size="sm" aria-label={'Ver evidência de ' + activity.title} onClick={() => onOpen(activity.id, result?.id)}>Ver</Button></td></tr>
        })}</tbody></table></div>
        {!rows.length && <div className="teacher-empty" role="status"><h3>Ainda sem contribuição nesta categoria.</h3><p>Quando existir um evento confirmado, surgirá aqui.</p></div>}
      </section>
      <section className="spee-panel teacher-section"><h2>Pista de actividade <span className="teacher-muted">· {events.length} eventos</span></h2><EventTrail company={company} events={events} onOpen={onOpen} /></section>
    </div>
    <aside className="teacher-stack" aria-label="Síntese descritiva">
      <section className="spee-panel teacher-section"><h2>Participação com evidência</h2><p className="teacher-hint">Eventos por participante · ordem alfabética</p>
        {participants.length ? participants.map(person => {
          const count = events.filter(e => e.actorIds.includes(person.id)).length
          return <div className="teacher-participation" key={person.id}><span>{person.name}</span><strong>{count}</strong><progress aria-label={'Eventos de ' + person.name} value={count} max={Math.max(events.length, 1)} /></div>
        }) : <p className="teacher-empty">Os eventos automáticos não são atribuídos a estudantes.</p>}
        <p className="teacher-footnote">Uma acção colectiva pode envolver várias pessoas. As participações não se somam como eventos únicos. Estes valores não são notas nem rankings.</p>
      </section>
      <section className="spee-panel teacher-section"><h2>Resultados recentes</h2>{[...results].sort((a,b) => b.confirmedAt.localeCompare(a.confirmedAt)).slice(0,4).map(result => <button key={result.id} className="teacher-recent-result" onClick={() => onOpen(result.activityId, result.id)}><strong>{result.title}</strong><span>{result.reference} →</span></button>)}{!results.length && <p className="teacher-empty">Sem resultados associados.</p>}</section>
      <p className="teacher-footnote">Sem contagem de cliques, tempo de sessão ou ranking de desempenho. Dados de demonstração para validar a experiência.</p>
    </aside>
  </div>
}
