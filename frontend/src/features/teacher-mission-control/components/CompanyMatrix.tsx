import { useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { TeacherStatusBadge } from './TeacherStatusBadge'
import { milestoneState, companyProgress, statusLabels, type MatrixFilters } from '../services/teacher.selectors'
import type { Company, TeacherSnapshot } from '../types'
export function CompanyMatrix({ companies, milestones, filters, onColumnFilter, onOpen, onClear }: {
  companies: Company[]; milestones: TeacherSnapshot['milestones']; filters: MatrixFilters;
  onColumnFilter: (id: string, status: string) => void; onOpen: (id: string, milestone?: string) => void; onClear: () => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const move = (direction: -1 | 1, page = false) => {
    const element = scrollRef.current
    if (!element) return
    const distance = page ? Math.max(element.clientWidth - 230, 177) : 177
    element.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }
  return <section className="spee-panel teacher-matrix-panel">
    <h2>Progresso por empresa e bloco</h2>
    <div className="teacher-matrix-toolbar"><p className="teacher-hint"><SlidersHorizontal size={16} />Filtros combináveis por estado e bloco · {companies.length} empresas</p>
      <div className="teacher-column-navigation" aria-label="Navegar nas colunas da matriz">
        <Button variant="outline" size="sm" aria-label="Recuar um conjunto de colunas" onClick={() => move(-1, true)}><ChevronsLeft size={16} /></Button>
        <Button variant="outline" size="sm" aria-label="Recuar uma coluna" onClick={() => move(-1)}><ChevronLeft size={16} /></Button>
        <span>Colunas</span>
        <Button variant="outline" size="sm" aria-label="Avançar uma coluna" onClick={() => move(1)}><ChevronRight size={16} /></Button>
        <Button variant="outline" size="sm" aria-label="Avançar um conjunto de colunas" onClick={() => move(1, true)}><ChevronsRight size={16} /></Button>
      </div>
    </div>
    <div ref={scrollRef} className="teacher-matrix-scroll" tabIndex={0} role="region" aria-label="Matriz de progresso, deslocamento horizontal e vertical">
      <table className="teacher-matrix"><caption className="sr-only">Progresso confirmado das empresas por bloco. Abra uma empresa ou um estado para consultar o detalhe.</caption>
        <thead><tr><th scope="col">Empresa</th>{milestones.map(m => <th key={m.id} scope="col"><label>{m.title}<select disabled={m.upcoming} aria-label={'Filtrar ' + m.title} value={filters.columns[m.id] ?? 'all'} onChange={e => onColumnFilter(m.id, e.target.value)}><option value="all">{m.upcoming ? 'Brevemente' : 'Todos os estados'}</option>{Object.entries(statusLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label></th>)}</tr></thead>
        <tbody>{companies.map(company => <tr key={company.id}>
          <th scope="row"><div className="teacher-company-name"><button onClick={() => onOpen(company.id)}>{company.name}</button><Button variant="ghost" size="sm" aria-label={'Abrir percurso de ' + company.name} onClick={() => onOpen(company.id)}><Eye size={19} /></Button></div><span className="teacher-company-percent">{companyProgress(company)}%{company.example && ` · Exemplo ${company.example}`}</span></th>
          {milestones.map(m => {
            const activities = company.activities.filter(a => a.milestone === m.id)
            const status = milestoneState(company, m.id)
            const label = status === 'unavailable' ? 'Brevemente' : statusLabels[status]
            const ids = [...new Set(activities.flatMap(a => a.participantIds))]
            return <td key={m.id}><button className={'teacher-matrix-cell teacher-cell--' + status} aria-label={company.name + ' · ' + m.title + ' · ' + label} onClick={() => onOpen(company.id, m.id)}>{status === 'unavailable' ? <span className="teacher-muted">Brevemente</span> : <TeacherStatusBadge status={status} />}{ids.length > 0 && <span className="teacher-initials" title={company.participants.filter(p => ids.includes(p.id)).map(p => p.name).join(', ')}>{company.participants.find(p => p.id === ids[0])?.initials}{ids.length > 1 ? ' +' + (ids.length - 1) : ''}</span>}</button></td>
          })}
        </tr>)}</tbody>
      </table>
    </div>
    {!companies.length && <div className="teacher-empty" role="status"><h3>Nenhuma empresa corresponde aos filtros.</h3><p>Altere a pesquisa ou combine outros estados.</p><Button variant="outline" onClick={onClear}>Limpar filtros</Button></div>}
  </section>
}
