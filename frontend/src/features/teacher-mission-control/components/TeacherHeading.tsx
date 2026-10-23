import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { formatInstant } from '../services/teacher.selectors'
export function TeacherHeading({ title, subtitle, updatedAt, onRefresh, refreshing, children }: {
  title: string; subtitle: string; updatedAt: string; onRefresh?: () => void; refreshing?: boolean; children?: ReactNode
}) {
  return <header className="teacher-heading">
    <div><h1>{title}</h1><p>{subtitle}</p></div>
    <div className="teacher-heading-meta"><span>PROTÓTIPO · DADOS ILUSTRATIVOS</span>
      {children ?? <Button variant="ghost" size="sm" onClick={onRefresh} disabled={refreshing}><RefreshCw className={refreshing ? 'animate-spin' : ''} />Actualizar dados</Button>}
      <small>Dados locais · cenário de {formatInstant(updatedAt)}</small>
    </div>
  </header>
}
