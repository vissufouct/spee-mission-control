import { ChevronLeft, ChevronRight, Layers3 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { ActivityList, type ActivityFilter } from './ActivityList'
import { BlockSummary } from './BlockSummary'
import { getBlockSummary, getCurrentBlock } from '../services/journey.selectors'
import type { Activity, JourneySnapshot } from '../types'
export function JourneyView({ snapshot, filter, onFilter, onOpen, blockId, onBlock }: {
  blockId?: string; onBlock?: (id: string) => void;
  snapshot: JourneySnapshot; filter: ActivityFilter; onFilter: (filter: ActivityFilter) => void; onOpen: (activity: Activity) => void
}) {
  const current = snapshot.blocks.find(block => block.id === blockId) ?? getCurrentBlock(snapshot)
  const summary = getBlockSummary(snapshot, current.id)
  const index = snapshot.blocks.indexOf(current)
  const previous = snapshot.blocks[index - 1]
  const next = snapshot.blocks[index + 1]
  return <div className="space-y-5">
    <nav className="spee-panel flex flex-wrap items-center justify-between gap-4 p-4 text-sm" aria-label="Blocos do percurso">
      <button disabled={!previous} onClick={() => previous && onBlock?.(previous.id)} className="flex items-center gap-2 disabled:opacity-40"><ChevronLeft size={20} />{previous?.title ?? 'Início do percurso'}</button>
      <span><strong>{current.title}</strong> <StatusBadge status={current.state} /><span className="block text-xs">{current.id === snapshot.context.currentBlockId ? 'Bloco actual' : `Bloco em consulta · actual: ${getCurrentBlock(snapshot).title}`}</span></span>
      <button disabled={current.id === snapshot.context.currentBlockId} onClick={() => onBlock?.(snapshot.context.currentBlockId)} className="text-blue-700 disabled:opacity-40">Voltar para o bloco actual</button>
      <button disabled={!next} onClick={() => next && onBlock?.(next.id)} className="flex items-center gap-2 disabled:opacity-40">{next?.title ?? 'Fim do percurso'}<ChevronRight size={20} /></button>
    </nav>
    <div>
      <div className="min-w-0 space-y-4">
        <section className="spee-panel p-5" aria-label={`Bloco e actividades: ${current.title}`}>
          <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="font-semibold">{current.id === snapshot.context.currentBlockId ? 'Bloco actual' : 'Bloco em consulta'}</h2><BlockSummary snapshot={snapshot} blockId={current.id} /></div>
          <div className="mt-2 flex items-center gap-5"><span className="grid size-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><Layers3 size={36} strokeWidth={1.7} /></span><div className="min-w-0 flex-1">
            <h2 className="text-3xl font-semibold tracking-tight">{current.title}</h2>
            <p className="my-2 text-sm">{summary.completed} de {summary.total} actividades concluídas</p>
            <progress className="journey-progress" max={Math.max(1, summary.total)} value={summary.completed} aria-label="Progresso do bloco" />
          </div></div>
        <ActivityList activities={current.activities} snapshot={snapshot} filter={filter} onFilter={onFilter} onOpen={onOpen} />
        </section>
      </div>
    </div>

  </div>
}
import '../styles.css'
