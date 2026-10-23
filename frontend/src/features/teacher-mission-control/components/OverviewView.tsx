import { Info, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { OverviewFilters } from './OverviewFilters'
import { MetricCards } from './MetricCards'
import { CompanyMatrix } from './CompanyMatrix'
import { companyAlerts, companyProgress, filterCompanies, type MatrixFilters } from '../services/teacher.selectors'
import type { TeacherSnapshot } from '../types'
import '../styles.css'

export function OverviewView({ snapshot, filters, onChange, onClear, onOpen }: {
  snapshot: TeacherSnapshot; filters: MatrixFilters; onChange: (key: string, value: string) => void; onClear: () => void;
  onOpen: (id: string, milestone?: string) => void
}) {
  const companies = filterCompanies(snapshot, filters)
  const alerts = companies.reduce((total, company) => total + companyAlerts(company, snapshot).length, 0)
  const average = companies.length ? Math.round(companies.reduce((sum, c) => sum + companyProgress(c), 0) / companies.length) : 0
  return <div className="teacher-stack">
    <OverviewFilters snapshot={snapshot} filters={filters} onChange={onChange} onClear={onClear} />
    <MetricCards items={[
      { label: 'Empresas activas', value: companies.length, icon: 'companies', tone: 'green' },
      { label: 'Conclusão média da simulação', value: average + '%', icon: 'progress', tone: 'blue' },
      { label: 'Actividades com alertas', value: alerts, icon: 'alerts', tone: 'amber', selected: filters.alertsOnly, onClick: () => onChange('alertas', filters.alertsOnly ? '' : '1') },
    ]} />
    {filters.alertsOnly && <div className="teacher-filter-notice" role="status">A mostrar apenas empresas com alertas, mantendo os restantes filtros.<Button variant="ghost" size="sm" onClick={() => onChange('alertas', '')}><X size={16} />Retirar filtro de alertas</Button></div>}
    <CompanyMatrix companies={companies} milestones={snapshot.milestones} filters={filters} onColumnFilter={(id, status) => onChange('marco.' + id, status)} onOpen={onOpen} onClear={onClear} />
    <p className="teacher-footnote"><Info size={16} />O progresso resulta de eventos e resultados confirmados. Indicadores relativos às empresas filtradas; prazos referidos à data do cenário.</p>
  </div>
}
