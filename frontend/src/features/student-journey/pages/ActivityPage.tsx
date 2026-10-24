import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useJourney } from '../hooks/useJourney'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { ActivityDialog } from '../components/ActivityDialog'
import { ConversationPanel } from '../components/ConversationPanel'
import { NotificationBar } from '../components/NotificationBar'
import { journeyPaths } from '../services/journey.selectors'
export function ActivityPage() {
  const query = useJourney()
  const { activityId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  const snapshot = query.data
  const block = snapshot.blocks.find(b => b.activities.some(a => a.id === activityId))
  const activity = block?.activities.find(a => a.id === activityId)
  if (!activity || !block) return <section><h1>Actividade não encontrada</h1><Link preventScrollReset to={journeyPaths.home}>Voltar ao Meu Percurso</Link></section>
  return <div className="space-y-5">
    <nav aria-label="Navegação do percurso" className="flex flex-wrap gap-2 text-sm text-blue-700"><Link preventScrollReset to={journeyPaths.home}>Meu Percurso</Link><span>/</span><Link preventScrollReset to={journeyPaths.full}>Percurso completo</Link><span>/</span><Link preventScrollReset to={journeyPaths.home + '?bloco=' + block.id}>{block.title}</Link><span>/</span><span aria-current="page" className="text-slate-600">{activity.title}</span></nav>
    <div className="student-heading-notifications"><h1 className="text-3xl font-semibold">{activity.title}</h1>
      <div className="space-y-3"><NotificationBar snapshot={snapshot} />
        <ConversationPanel key={activity.id + params.get('canal')} snapshot={snapshot} activityId={activity.id} initialOpen={params.has('canal')} initialChannel={params.get('canal') === 'group' ? 'group' : 'teacher'} />
      </div>
    </div>
    <ActivityDialog embedded activity={activity} snapshot={snapshot} onClose={() => navigate(journeyPaths.home)} onContinue={() => navigate(journeyPaths.registration)} onActivity={id => navigate(journeyPaths.activity(id), { preventScrollReset: true })} />
  </div>
}
