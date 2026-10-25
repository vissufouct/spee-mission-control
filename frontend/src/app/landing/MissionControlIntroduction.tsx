import { Link } from 'react-router-dom'
import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { journeyPaths } from '@/features/student-journey'
import { teacherPaths } from '@/features/teacher-mission-control'

export type MissionControlRole = 'teacher' | 'student'
const introductions = {
  teacher: {
    title: 'Painel do Docente',
    description: 'O Painel é o espaço de acompanhamento da simulação empresarial. Na perspectiva do docente, reúne o progresso das empresas, as actividades que precisam de atenção e as orientações pedagógicas.',
    features: [
      'Acompanhar o progresso por turma, empresa e marco do percurso.',
      'Filtrar empresas e identificar actividades bloqueadas ou em curso.',
      'Consultar o contexto das actividades, resultados e evidências disponíveis.',
      'Responder a pedidos e publicar orientações associadas às actividades.',
    ],
    note: 'As conversas privadas entre membros da empresa não são visíveis ao docente.',
    path: teacherPaths.home,
  },
  student: {
    title: 'Painel do Estudante',
    description: 'O Painel é o seu ponto de orientação na simulação empresarial: mostra o que está feito, o que falta e qual é o próximo passo da sua empresa.',
    features: [
      'Consultar o progresso e navegar entre os blocos do percurso.',
      'Ver os passos de cada actividade, as dependências e os materiais de apoio.',
      'Conversar com o docente ou, em privado, com os colegas da empresa.',
      'Atribuir tarefas simples no grupo e marcar as suas tarefas como feitas.',
      'Consultar notificações pendentes e marcá-las como resolvidas.',
    ],
    note: 'Todos os membros da empresa partilham a conversa com o docente; o canal do grupo permanece privado.',
    path: journeyPaths.home,
  },
} as const

export function MissionControlIntroduction({ role, onClose }: { role: MissionControlRole | null; onClose: () => void }) {
  const content = role ? introductions[role] : null
  return <Dialog open={content !== null} onOpenChange={open => { if (!open) onClose() }} title={content?.title ?? 'Painel'} description={content?.description}>
    {content && <>
      <h3 className="mt-6 font-semibold">Principais funcionalidades</h3>
      <ul className="my-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">{content.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      <p className="text-sm leading-6 text-slate-600">{content.note}</p>
      <p className="mt-4 text-xs leading-5 text-slate-500">Este protótipo utiliza dados ilustrativos guardados neste browser. Não tem autenticação real; a integração com os módulos do simulador será feita posteriormente.</p>
      <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onClose}>Voltar</Button><Button asChild><Link to={content.path}>Entrar</Link></Button></div>
    </>}
  </Dialog>
}
