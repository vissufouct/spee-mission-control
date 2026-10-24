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
  if (!activity || !block) return <section><h1>Actividade não encontrada</h1><Link to={journeyPaths.home}>Voltar ao Meu Percurso</Link></section>
  return <div className="space-y-5">
    <nav aria-label="Navegação do percurso" className="flex flex-wrap gap-2 text-sm text-blue-700"><Link to={journeyPaths.home}>Meu Percurso</Link><span>/</span><Link to={journeyPaths.full}>Percurso completo</Link><span>/</span><Link to={journeyPaths.home + '?bloco=' + block.id}>{block.title}</Link><span>/</span><span aria-current="page" className="text-slate-600">{activity.title}</span></nav>
    <h1 className="text-3xl font-semibold">{activity.title}</h1>
    <NotificationBar snapshot={snapshot} />
    <div className="student-detail-columns">
      <div className="min-w-0 space-y-4"><ActivityDialog embedded activity={activity} snapshot={snapshot} onClose={() => navigate(journeyPaths.home)} onContinue={() => navigate(journeyPaths.registration)} />
      <section className="spee-panel p-5 space-y-3"><h2 className="font-semibold">Detalhe da actividade</h2><h3 className="font-medium">Definição de concluído</h3><p>{activity.definitionOfDone ?? 'Resultado da actividade confirmado pelo módulo e acompanhado da respectiva evidência.'}</p><h3 className="font-medium">Dependências</h3><p>{activity.reason ?? 'Consulte as condições do bloco ' + block.title + '.'}</p><h3 className="font-medium">Próximo passo</h3><p>{activity.id === 'registar-empresa' ? 'Consultar ou completar o registo e os documentos de constituição.' : activity.description}</p><h3 className="font-medium">Participantes e evidências</h3><p>{activity.id === 'registar-empresa' ? snapshot.context.studentName : 'Sem atribuição de participação confirmada neste cenário.'}</p>{activity.id === 'registar-empresa' && snapshot.registration?.receiptNumber && <p>Comprovativo: {snapshot.registration.receiptNumber}</p>}</section></div>
      <ConversationPanel key={activity.id + params.get('canal')} snapshot={snapshot} activityId={activity.id} initialOpen={params.has('canal')} initialChannel={params.get('canal') === 'group' ? 'group' : 'teacher'} />
    </div>
  </div>
}
