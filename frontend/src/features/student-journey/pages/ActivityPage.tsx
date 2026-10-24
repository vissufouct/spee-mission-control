import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useJourney } from '../hooks/useJourney'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { ActivityDialog } from '../components/ActivityDialog'
import { ConversationPanel } from '../components/ConversationPanel'
import { ActivityNotifications } from '../components/ActivityNotifications'
import { journeyPaths } from '../services/journey.selectors'
import { getNextAction } from '../services/activity.presentation'
import { Button } from '@/shared/components/ui/button'
export function ActivityPage() {
  const query = useJourney()
  const { activityId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  const snapshot = query.data
  const block = snapshot.blocks.find(b => b.activities.some(a => a.id === activityId))
  const activity = block?.activities.find(a => a.id === activityId)
  if (!activity || !block) return <section><h1>Actividade não encontrada</h1><Link preventScrollReset to={journeyPaths.home}>Voltar ao Meu Percurso</Link></section>
  const next = getNextAction(activity, snapshot)
  return <div className="student-activity-page space-y-5">
    <nav aria-label="Navegação do percurso" className="flex flex-wrap gap-2 text-sm text-blue-700"><Link preventScrollReset to={journeyPaths.home}>Meu Percurso</Link><span>/</span><Link preventScrollReset to={journeyPaths.full}>Percurso completo</Link><span>/</span><Link preventScrollReset to={journeyPaths.home + '?bloco=' + block.id}>{block.title}</Link><span>/</span><span aria-current="page" className="text-slate-600">{activity.title}</span></nav>
    <div className="student-page-heading"><div className="student-activity-heading"><h1 className="text-3xl font-semibold">{activity.title}</h1>{next && <div className="student-next-activity"><span>Próxima actividade: <strong>{next.title}</strong></span>{next.target === 'criteria' ? <Button variant="outline" asChild><a href="#activity-criteria">{next.label}</a></Button> : <Button variant="outline" onClick={() => navigate(next.target === 'registration' ? journeyPaths.registration : journeyPaths.activity(next.id), { preventScrollReset: true })}>{next.label}</Button>}</div>}</div>
      <ActivityNotifications key={activity.id} snapshot={snapshot} activityId={activity.id} />
    </div>
    <div>
        <ConversationPanel hideTrigger key={activity.id + location.key + params.get('canal')} snapshot={snapshot} activityId={activity.id} initialOpen={params.has('canal')} initialChannel={params.get('canal') === 'group' ? 'group' : 'teacher'} />
    </div>
    <ActivityDialog embedded activity={activity} snapshot={snapshot} onClose={() => navigate(journeyPaths.home)} onContinue={() => navigate(journeyPaths.registration)} onActivity={id => navigate(journeyPaths.activity(id), { preventScrollReset: true })} />
  </div>
}
