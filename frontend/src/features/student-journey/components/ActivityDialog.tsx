import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, FileText } from 'lucide-react'
import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { getActivityStatus } from '../services/journey.selectors'
import type { Activity, JourneySnapshot } from '../types'
import { registrationSchema } from '../schemas/journey.schema'

export function ActivityDialog({ activity, snapshot, onClose, onContinue }: { activity: Activity | null; snapshot: JourneySnapshot; onClose: () => void; onContinue: () => void }) {
  if (!activity) return null
  const status = getActivityStatus(activity, snapshot)
  const registration = activity.id === 'registar-empresa'
  const completed = status === 'completed'
  const count = completed ? 3 : registrationSchema.safeParse(snapshot.registration?.data).success ? 1 : 0
  return <Dialog open onOpenChange={open => { if (!open) onClose() }} title={activity.title} description={registration ? 'Meu Percurso / Constituição' : activity.description}>
    <div className="mt-4"><StatusBadge status={status} />{registration && <p className="mt-3 text-sm text-blue-700">{count} de 3 critérios confirmados</p>}</div>
    {registration ? <>
      <h3 className="mb-3 mt-6 font-semibold">Esta actividade em contexto</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-emerald-100 bg-emerald-50/40 p-4"><p className="text-xs text-slate-500">Vem de</p><h4 className="my-3 text-sm font-semibold">Reserva do nome</h4><StatusBadge status="completed" /></div>
        <div className="rounded-md border border-blue-200 bg-blue-50/50 p-4"><p className="text-xs text-blue-700">Actividade actual</p><h4 className="my-3 text-sm font-semibold">Registar empresa</h4><StatusBadge status={status} /></div>
        <div className="rounded-md border p-4"><p className="text-xs text-slate-500">Desbloqueia</p><p className="my-2 text-sm font-medium">Convidar sócios</p><StatusBadge status="available" /><p className="mb-2 mt-3 text-sm">Início de actividades</p><StatusBadge status="blocked" /></div>
      </div>
      <h3 className="mb-3 mt-6 font-semibold">{completed ? 'O que foi confirmado' : 'Para concluir esta actividade'}</h3>
      <ul className="divide-y rounded-md border">{['Preencher os dados da empresa', 'Submeter o formulário de registo', 'Gerar os documentos de constituição'].map((label, index) => {
        const done = index < count
        const Icon = done ? CheckCircle2 : index === count ? Clock3 : Circle
        return <li key={label} className="flex items-center gap-3 px-4 py-3 text-sm"><Icon size={21} className={done ? 'text-emerald-600' : 'text-slate-400'} /><span className="flex-1">{label}</span><span className="text-xs text-slate-500">{done ? 'Concluído' : index === count ? 'Em curso' : 'Por fazer'}</span></li>
      })}</ul>
      <p className="mt-3 rounded-md bg-blue-50 px-4 py-3 text-xs text-blue-800">{completed ? 'Conclusão confirmada na simulação local.' : 'O progresso é actualizado após a confirmação da operação.'}</p>
      {completed && <div className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 p-4"><h3 className="mb-2 flex gap-2 font-semibold"><FileText size={19} />Resultado da actividade</h3><p className="text-sm text-emerald-800">Empresa registada · Comprovativo de constituição gerado</p></div>}
      <details className="mt-4 rounded-md border p-4"><summary className="cursor-pointer text-sm font-medium"><BookOpen className="mr-2 inline text-cyan-600" size={20} />Apoio · 3 materiais disponíveis</summary><div className="mt-4 space-y-3 text-sm text-slate-600">
        <p><strong>Guia de registo:</strong> confirme a denominação, o NUIT, a actividade económica e os contactos antes de submeter.</p>
        <p><strong>Lista de documentos:</strong> reserva do nome, identificação dos sócios e indicação do capital social.</p>
        <p><strong>Critério de conclusão:</strong> os dados são validados, o registo é confirmado e é produzido um comprovativo local.</p>
      </div></details>
      <div className="mt-5 flex flex-wrap items-center justify-end gap-4 border-t pt-5"><span className="text-xs text-slate-500">{completed ? 'Consultar o resultado guardado.' : 'Abre o formulário nesta experiência local.'}</span><Button onClick={onContinue}>{completed ? 'Ver detalhes' : 'Continuar actividade'}<ArrowRight /></Button></div>
    </> : <div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      {activity.id === 'reserva-nome' ? <><h3 className="font-semibold text-slate-900">Nome reservado</h3><p>Horizonte Verde, Lda. · Reserva RV-2026-0841</p><p>Resultado ilustrativo fornecido no cenário inicial.</p></> :
      <><h3 className="font-semibold text-slate-900">{activity.reason ?? 'Esta actividade está prevista no percurso.'}</h3><p className="mt-2">Nesta primeira iteração pode testar o fluxo completo de registo da empresa. A execução desta actividade será desenvolvida numa próxima iteração.</p></>}
    </div>}
  </Dialog>
}
