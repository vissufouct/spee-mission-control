import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
export function TeacherHeading({ title, subtitle, onRefresh, refreshing, children, contextControl }: {
  title: string; subtitle: string; onRefresh?: () => void; refreshing?: boolean; children?: ReactNode; contextControl?: ReactNode
}) {
  return <header className="teacher-heading">
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-5 gap-y-2"><h1>{title}</h1>{contextControl}</div><p>{subtitle}</p></div>
    <div className="teacher-heading-meta">
      {children ?? <Button variant="ghost" size="sm" onClick={onRefresh} disabled={refreshing}><RefreshCw className={refreshing ? 'animate-spin' : ''} />Actualizar dados</Button>}
    </div>
  </header>
}
