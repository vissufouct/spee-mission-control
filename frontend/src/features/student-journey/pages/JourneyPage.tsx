import { useNavigate, useSearchParams } from 'react-router-dom'
import { useJourney } from '../hooks/useJourney'
import { JourneyView } from '../components/JourneyView'
import { JourneyHeading } from '../components/JourneyHeading'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { ActivityDialog } from '../components/ActivityDialog'
import type { ActivityFilter } from '../components/ActivityList'
import { journeyPaths } from '../services/journey.selectors'
export function JourneyPage() {
  const query = useJourney()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  const snapshot = query.data
  const filterParam = params.get('estado')
  const filter: ActivityFilter = ['available', 'in-progress', 'blocked'].includes(filterParam ?? '') ? filterParam as ActivityFilter : 'all'
  const activity = snapshot.blocks.flatMap(block => block.activities).find(item => item.id === params.get('actividade')) ?? null
  function param(name: string, value?: string) {
    setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(name, value); else next.delete(name); return next })
  }
  return <>
    <JourneyHeading title="Meu Percurso" description="Veja o que está feito, o que falta e qual é o próximo passo." revision={snapshot.revision} />
    <JourneyView snapshot={snapshot} filter={filter} onFilter={value => param('estado', value === 'all' ? undefined : value)} onOpen={item => param('actividade', item.id)} onFullPath={() => navigate(journeyPaths.full)} />
    <p className="mt-5 text-xs text-slate-500">Experiência disponível nesta iteração: registo da empresa. Os restantes módulos mantêm-se como contexto do percurso.</p>
    <ActivityDialog activity={activity} snapshot={snapshot} onClose={() => param('actividade')} onContinue={() => navigate(journeyPaths.registration)} />
  </>
}

