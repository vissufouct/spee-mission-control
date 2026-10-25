import { Link, useNavigate } from 'react-router-dom'
import { Info, Map } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useJourney } from '../hooks/useJourney'
import { JourneyProgressHeading } from '../components/JourneyProgressHeading'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { FullJourneyBlock } from '../components/FullJourneyBlock'
import { StatusBadge } from '../components/StatusBadge'
import { ActivityNotifications } from '../components/ActivityNotifications'
import { getProgress, journeyPaths } from '../services/journey.selectors'
import type { ActivityStatus } from '../types'
export function FullJourneyPage() {
  const query = useJourney()
  const navigate = useNavigate()
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  const snapshot = query.data
  const legends: [ActivityStatus, string][] = [['completed', 'Actividade confirmada.'], ['in-progress', 'Actividade em progresso.'], ['not-started', 'Actividade por iniciar.'], ['blocked', 'Requer outra condição.']]
  return <div className="student-full-journey">
    <nav aria-label="Navegação do percurso" className="mb-4 text-sm text-blue-700"><Link preventScrollReset to={journeyPaths.home}>Meu Percurso</Link> / <span aria-current="page">Percurso completo</span></nav>
    <div className="student-page-heading mb-5"><JourneyProgressHeading title="Percurso completo" showFullPath={false} {...getProgress(snapshot)} companyName={snapshot.context.companyName} example={snapshot.context.example} />
    <ActivityNotifications snapshot={snapshot} /></div>
    <div className="journey-columns"><div className="min-w-0 space-y-4">
      <p className="flex gap-3 rounded-md bg-blue-50 p-3 text-sm text-blue-800"><Info className="shrink-0" size={20} />As actividades podem decorrer em paralelo dentro de cada bloco.</p>
      {snapshot.blocks.map((block, index) => <FullJourneyBlock key={block.id} block={block} index={index} snapshot={snapshot} onActivity={id => navigate(journeyPaths.activity(id), { preventScrollReset: true })} />)}
    </div><aside className="space-y-4"><section className="spee-panel p-5"><h2 className="mb-5 text-lg font-semibold">Legenda dos estados</h2><ul className="space-y-5">{legends.map(([status, label]) => <li key={status}><StatusBadge status={status} /><p className="ml-2 mt-1 text-xs text-slate-500">{label}</p></li>)}</ul></section>
      <section className="spee-panel p-5"><h2 className="font-semibold">Navegação</h2><p className="my-3 text-sm leading-6 text-slate-500">Abra um bloco para consultar as respectivas actividades.</p><Button className="w-full" onClick={() => navigate(journeyPaths.home)}><Map />Voltar às minhas actividades</Button></section>
    </aside></div>
  </div>
}
