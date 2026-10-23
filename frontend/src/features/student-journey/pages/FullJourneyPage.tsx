import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Info, Map } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useJourney } from '../hooks/useJourney'
import { JourneyHeading } from '../components/JourneyHeading'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { ProgressCard } from '../components/ProgressCard'
import { StatusBadge } from '../components/StatusBadge'
import { ActivityDialog } from '../components/ActivityDialog'
import { getActivityStatus, getProgress, journeyPaths } from '../services/journey.selectors'
import type { Activity, ActivityStatus } from '../types'
export function FullJourneyPage() {
  const query = useJourney()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  const snapshot = query.data
  const legends: [ActivityStatus, string][] = [['completed', 'Actividade confirmada.'], ['in-progress', 'Actividade em progresso.'], ['available', 'Pode ser iniciada.'], ['blocked', 'Requer outra condição.'], ['unavailable', 'Ainda não está acessível.']]
  return <>
    <JourneyHeading title="Percurso completo" description="Consulte os blocos e as actividades que compõem a simulação." revision={snapshot.revision} />
    <div className="journey-columns"><div className="min-w-0 space-y-4">
      <ProgressCard {...getProgress(snapshot)} />
      <p className="flex gap-3 rounded-md bg-blue-50 p-3 text-sm text-blue-800"><Info className="shrink-0" size={20} />As actividades podem decorrer em paralelo dentro de cada bloco.</p>
      {snapshot.blocks.map((block, index) => <details className="spee-panel group" key={block.id} open={block.id === snapshot.context.currentBlockId ? true : undefined}>
        <summary className="flex cursor-pointer list-none items-center gap-4 p-4 marker:content-none"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">{index + 1}</span><span className="min-w-0 flex-1"><strong className="text-lg">{block.title}</strong><span className="mt-1 block text-xs text-slate-500">{block.description}</span></span><StatusBadge status={block.state} /><ChevronDown className="shrink-0 group-open:rotate-180" size={20} /></summary>
        <ul className="mx-4 mb-4 divide-y rounded-md border">{block.activities.map(item => <li key={item.id}><button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50" onClick={() => setActivity(item)}><span className="flex-1 text-sm">{item.title}</span><StatusBadge status={getActivityStatus(item, snapshot)} /><ChevronRight className="shrink-0" size={18} /></button></li>)}</ul>
      </details>)}
    </div><aside className="space-y-4"><section className="spee-panel p-5"><h2 className="mb-5 text-lg font-semibold">Legenda dos estados</h2><ul className="space-y-5">{legends.map(([status, label]) => <li key={status}><StatusBadge status={status} /><p className="ml-2 mt-1 text-xs text-slate-500">{label}</p></li>)}</ul></section>
      <section className="spee-panel p-5"><h2 className="font-semibold">Navegação</h2><p className="my-3 text-sm leading-6 text-slate-500">Abra um bloco para consultar as respectivas actividades.</p><Button className="w-full" onClick={() => navigate(journeyPaths.home)}><Map />Voltar às minhas actividades</Button></section>
    </aside></div>
    <ActivityDialog activity={activity} snapshot={snapshot} onClose={() => setActivity(null)} onContinue={() => navigate(journeyPaths.registration)} />
  </>
}
