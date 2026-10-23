import { ChevronLeft, ChevronRight, Info, Layers3 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { ProgressCard } from './ProgressCard'
import { ActivityList, type ActivityFilter } from './ActivityList'
import { BlockSummary } from './BlockSummary'
import { getBlockSummary, getCurrentBlock, getProgress } from '../services/journey.selectors'
import type { Activity, JourneySnapshot } from '../types'
export function JourneyView({ snapshot, filter, onFilter, onOpen, onFullPath }: {
  snapshot: JourneySnapshot; filter: ActivityFilter; onFilter: (filter: ActivityFilter) => void; onOpen: (activity: Activity) => void; onFullPath: () => void
}) {
  const current = getCurrentBlock(snapshot)
  const summary = getBlockSummary(snapshot)
  return <div className="space-y-5">
    <ProgressCard {...getProgress(snapshot)} onFullPath={onFullPath} />
    <div className="journey-columns">
      <div className="min-w-0 space-y-4">
        <section className="spee-panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="font-semibold">Bloco actual</h2><p className="flex max-w-56 gap-2 text-xs leading-5 text-slate-500"><Info className="mt-0.5 shrink-0" size={17} />Algumas actividades podem decorrer em paralelo.</p></div>
          <div className="mt-2 flex items-center gap-5"><span className="grid size-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><Layers3 size={36} strokeWidth={1.7} /></span><div className="min-w-0 flex-1">
            <h2 className="text-3xl font-semibold tracking-tight">{current.title}</h2>
            <p className="my-2 text-sm">{summary.completed} de {summary.total} actividades concluídas</p>
            <progress className="journey-progress" max={Math.max(1, summary.total)} value={summary.completed} aria-label="Progresso do bloco" />
          </div></div>
        </section>
        <ActivityList activities={current.activities} snapshot={snapshot} filter={filter} onFilter={onFilter} onOpen={onOpen} />
      </div>
      <BlockSummary snapshot={snapshot} onFullPath={onFullPath} />
    </div>
    <nav className="spee-panel flex flex-wrap items-center justify-between gap-4 p-4 text-sm" aria-label="Blocos do percurso">
      <button onClick={onFullPath} className="flex items-center gap-3 rounded px-1 py-2 hover:text-blue-700"><ChevronLeft size={20} />Ideação <StatusBadge status="completed" /></button>
      <span className="flex items-center gap-3 rounded-md bg-cyan-50 px-6 py-3"><Layers3 className="text-cyan-700" size={23} /><strong>Constituição</strong><span className="text-xs text-cyan-800">Bloco actual</span></span>
      <button onClick={onFullPath} className="flex items-center gap-3 rounded px-1 py-2 hover:text-blue-700">Primeiro ano fiscal <ChevronRight size={20} /></button>
    </nav>
  </div>
}
import '../styles.css'
