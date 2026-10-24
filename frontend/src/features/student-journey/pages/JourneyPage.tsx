import { useNavigate, useSearchParams } from 'react-router-dom'
import { useJourney } from '../hooks/useJourney'
import { JourneyView } from '../components/JourneyView'
import { JourneyProgressHeading } from '../components/JourneyProgressHeading'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { ActivityNotifications } from '../components/ActivityNotifications'
import type { ActivityFilter } from '../components/ActivityList'
import { getProgress, journeyPaths } from '../services/journey.selectors'
export function JourneyPage() {
  const query = useJourney()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  const snapshot = query.data
  const filterParam = params.get('estado')
  const filter: ActivityFilter = ['not-started', 'completed', 'in-progress', 'blocked'].includes(filterParam ?? '') ? filterParam as ActivityFilter : 'all'
  function param(name: string, value?: string) {
    setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(name, value); else next.delete(name); return next }, { preventScrollReset: true })
  }
  return <>
    <div className="student-page-heading mb-5"><JourneyProgressHeading {...getProgress(snapshot)} />
    <ActivityNotifications snapshot={snapshot} /></div>
    <JourneyView snapshot={snapshot} blockId={params.get('bloco') ?? undefined} onBlock={id => setParams({ bloco: id }, { preventScrollReset: true })} filter={filter} onFilter={value => param('estado', value === 'all' ? undefined : value)} onOpen={item => navigate(journeyPaths.activity(item.id))} />
    <p className="mt-5 text-xs text-slate-500">Experiência disponível nesta iteração: registo da empresa. Os restantes módulos mantêm-se como contexto do percurso.</p>
  </>
}
