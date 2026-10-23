import { ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
export function ProgressCard({ completed, total, percent, onFullPath }: { completed: number; total: number; percent: number; onFullPath?: () => void }) {
  return <section className="spee-panel flex flex-wrap items-center gap-5 p-5" aria-label="Progresso global da simulação">
    <div className="min-w-52"><h2 className="text-base font-semibold">Progresso global da simulação</h2><p className="mt-1 text-sm text-slate-500">{completed} de {total} marcos confirmados</p></div>
    <div className="min-w-40 flex-1"><p className="mb-2 text-right text-2xl font-bold" data-testid="global-progress">{percent}%</p>
      <progress className="journey-progress" max={100} value={percent} aria-label="Progresso global">{percent}%</progress></div>
    {onFullPath && <Button variant="ghost" onClick={onFullPath} className="ml-auto text-blue-700">Ver percurso completo <ChevronRight /></Button>}
  </section>
}
