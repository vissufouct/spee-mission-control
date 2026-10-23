import { Search, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { statusLabels, type MatrixFilters } from '../services/teacher.selectors'
import type { TeacherSnapshot } from '../types'
export function OverviewFilters({ snapshot, filters, onChange, onClear }: {
  snapshot: TeacherSnapshot; filters: MatrixFilters; onChange: (key: string, value: string) => void; onClear: () => void
}) {
  return <div className="teacher-filters">
    <label>Turma<select value={filters.classId} onChange={e => onChange('turma', e.target.value)}>{snapshot.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Roteiro<select value={filters.routeId} onChange={e => onChange('roteiro', e.target.value)}><option value="all">Todos os roteiros</option>{snapshot.routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
    <label>Estado<select value={filters.status} onChange={e => onChange('estado', e.target.value)}><option value="all">Todos</option>{Object.entries(statusLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
    <label>Prazo<select value={filters.deadline} onChange={e => onChange('prazo', e.target.value)}><option value="all">Todos os prazos</option><option value="soon">Próximos {snapshot.context.dueSoonDays} dias</option><option value="overdue">Ultrapassado</option></select></label>
    <label className="teacher-search"><Search size={18} /><span className="sr-only">Pesquisar empresa ou estudante</span><input value={filters.search} onChange={e => onChange('q', e.target.value)} placeholder="Pesquisar empresa ou estudante" /></label>
    <Button variant="ghost" size="sm" onClick={onClear} aria-label="Limpar filtros"><X size={16} /></Button>
  </div>
}
