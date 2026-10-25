import { Link } from 'react-router-dom'
import { journeyPaths } from '../services/journey.selectors'

export function JourneyProgressHeading({ completed, total, percent, title = 'Meu Percurso', showFullPath = true, companyName, example }: { completed: number; total: number; percent: number; title?: string; showFullPath?: boolean; companyName?: string; example?: string }) {
  return <header>
    <p className="spee-eyebrow">Painel do Estudante</p>
    {companyName && <p className="my-2 text-sm text-slate-600">Exemplo {example} · <strong>{companyName}</strong></p>}
    <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <div className="flex w-56 max-w-full items-center gap-3">
        <progress className="journey-progress min-w-0 flex-1" max={100} value={percent} aria-label="Progresso global">{percent}%</progress>
        <span className="text-xl font-bold" data-testid="global-progress">{percent}%</span>
      </div>
    </div>
    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-slate-500">
      <span>{completed} de {total} {companyName ? 'actividades concluídas' : 'marcos confirmados'}</span>
      {showFullPath && <Link className="text-blue-700 hover:underline focus-visible:outline-2" to={journeyPaths.full}>Ver percurso completo</Link>}
    </p>
  </header>
}
