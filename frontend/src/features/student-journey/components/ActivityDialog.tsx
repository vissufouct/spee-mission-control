import { ArrowRight, CheckCircle2, Circle, Clock3, FileText } from 'lucide-react'
import { Dialog } from '@/shared/components/ui/dialog'
import { useRef, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { ActivityContext } from './ActivityContext'
import { SupportMaterials } from './SupportMaterials'
import { StatusBadge } from './StatusBadge'
import { getActivityStatus } from '../services/journey.selectors'
import type { Activity, JourneySnapshot } from '../types'
import { registrationSchema } from '../schemas/journey.schema'

function DetailContainer({ embedded, title, description, onClose, children }: { embedded: boolean; title: string; description: string; onClose: () => void; children: ReactNode }) {
  return embedded ? <section className="spee-panel p-5"><p>{description}</p>{children}</section> : <Dialog open onOpenChange={open => { if (!open) onClose() }} title={title} description={description}>{children}</Dialog>
}
export function ActivityDialog({ activity, snapshot, onClose, onContinue, onActivity, embedded = false }: { activity: Activity | null; snapshot: JourneySnapshot; onClose: () => void; onContinue: () => void; onActivity?: (id: string) => void; embedded?: boolean }) {
  const details = useRef<HTMLDivElement>(null)
  if (!activity) return null
  const status = getActivityStatus(activity, snapshot)
  const registration = activity.id === 'registar-empresa'
  const completed = status === 'completed'
  const count = completed ? 3 : registrationSchema.safeParse(snapshot.registration?.data).success ? 1 : 0
  return <DetailContainer embedded={embedded} onClose={onClose} title={activity.title} description={activity.description}>
    <div className="mt-4"><StatusBadge status={status} />{registration && <p className="mt-3 text-sm text-blue-700">{count} de 3 critérios confirmados</p>}</div>
    <ActivityContext activity={activity} snapshot={snapshot} onActivity={onActivity} onCurrentActivity={() => { if (registration) onContinue(); else { details.current?.scrollIntoView({ block: 'start' }); details.current?.focus({ preventScroll: true }) } }} />
    <div ref={details} tabIndex={-1}>
    {registration ? <>
      <h3 className="mb-3 mt-6 font-semibold">{completed ? 'O que foi confirmado' : 'Para concluir esta actividade'}</h3>
      <ul className="divide-y rounded-md border">{(activity.steps ?? ['Preencher os dados da empresa', 'Submeter o formulário de registo', 'Gerar os documentos de constituição']).map((label, index) => {
        const done = index < count
        const Icon = done ? CheckCircle2 : index === count ? Clock3 : Circle
        return <li key={label} className="flex items-center gap-3 px-4 py-3 text-sm"><Icon size={21} className={done ? 'text-emerald-600' : 'text-slate-400'} /><span className="flex-1">{label}</span><span className="text-xs text-slate-500">{done ? 'Concluído' : index === count ? 'Em curso' : 'Por fazer'}</span></li>
      })}</ul>
      <p className="mt-3 rounded-md bg-blue-50 px-4 py-3 text-xs text-blue-800">{completed ? 'Conclusão confirmada na simulação local.' : 'O progresso é actualizado após a confirmação da operação.'}</p>
      {completed && <div className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 p-4"><h3 className="mb-2 flex gap-2 font-semibold"><FileText size={19} />Resultado da actividade</h3><p className="text-sm text-emerald-800">Empresa registada · Comprovativo de constituição gerado</p></div>}
      <SupportMaterials materials={activity.materials ?? []} />
      <div className="mt-5 flex flex-wrap items-center justify-end gap-4 border-t pt-5"><span className="text-xs text-slate-500">{completed ? 'Consultar o resultado guardado.' : 'Abre o formulário nesta experiência local.'}</span><Button onClick={onContinue}>{completed ? 'Ver detalhes' : 'Continuar actividade'}<ArrowRight /></Button></div>
    </> : <div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      {activity.id === 'reserva-nome' ? <><h3 className="font-semibold text-slate-900">Nome reservado</h3><p>Horizonte Verde, Lda. · Reserva RV-2026-0841</p><p>Resultado ilustrativo fornecido no cenário inicial.</p></> :
      <><h3 className="font-semibold text-slate-900">{activity.reason ?? 'Esta actividade está prevista no percurso.'}</h3><p className="mt-2">Nesta primeira iteração pode testar o fluxo completo de registo da empresa. A execução desta actividade será desenvolvida numa próxima iteração.</p></>}
    </div>}
    {!registration && <><h3 className="mt-6 font-semibold">Para concluir esta actividade</h3><ul className="list-disc pl-5 my-3 text-sm">{(activity.steps ?? [activity.description]).map(step => <li key={step}>{step}</li>)}</ul><SupportMaterials materials={activity.materials ?? []} /></>}
    </div>
  </DetailContainer>
}
