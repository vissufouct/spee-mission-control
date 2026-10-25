import { Info } from 'lucide-react'
import { OverviewFilters } from './OverviewFilters'
import { MetricCards } from './MetricCards'
import { CompanyMatrix } from './CompanyMatrix'
import { companyProgress, filterCompanies, pendingOrientationRequests, type MatrixFilters } from '../services/teacher.selectors'
import type { TeacherSnapshot } from '../types'
import '../styles.css'

export function OverviewView({ snapshot, filters, onChange, onClear, onOpen, onRequests }: {
  snapshot: TeacherSnapshot; filters: MatrixFilters; onChange: (key: string, value: string) => void; onClear: () => void;
  onOpen: (id: string, milestone?: string) => void; onRequests: () => void
}) {
  const companies = filterCompanies(snapshot, filters)
  const pendingRequests = pendingOrientationRequests(snapshot).length
  const average = companies.length ? Math.round(companies.reduce((sum, c) => sum + companyProgress(c), 0) / companies.length) : 0
  return <div className="teacher-stack">
    <OverviewFilters snapshot={snapshot} filters={filters} onChange={onChange} onClear={onClear} />
    <MetricCards items={[
      { label: 'Empresas activas', value: companies.length, icon: 'companies', tone: 'green' },
      { label: 'Conclusão média da simulação', value: average + '%', icon: 'progress', tone: 'blue' },
      { label: 'Pedidos de orientação', value: pendingRequests, icon: 'alerts', tone: 'amber', onClick: onRequests },
    ]} />
    <CompanyMatrix companies={companies} milestones={snapshot.milestones} filters={filters} onColumnFilter={(id, status) => onChange('marco.' + id, status)} onOpen={onOpen} onClear={onClear} />
    <p className="teacher-footnote"><Info size={16} />O progresso resulta da conclusão confirmada das actividades e tarefas. Indicadores relativos às empresas filtradas; prazos referidos à data do cenário.</p>
  </div>
}
