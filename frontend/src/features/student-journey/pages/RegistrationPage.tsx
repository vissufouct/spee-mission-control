import { useCallback, useEffect, useState } from 'react'
import { Link, useBlocker, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Info } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { ConversationPanel } from '../components/ConversationPanel'
import { RegistrationForm } from '../components/RegistrationForm'
import { RegistrationResult } from '../components/RegistrationResult'
import { JourneyLoadState } from '../components/JourneyLoadState'
import { StatusBadge } from '../components/StatusBadge'
import { useJourney, useJourneyMutation } from '../hooks/useJourney'
import { journeyPaths } from '../services/journey.selectors'
import type { JourneySnapshot, RegistrationValues } from '../types'
import { registrationSchema } from '../schemas/journey.schema'

export function RegistrationPage() {
  const query = useJourney()
  if (!query.data) return <JourneyLoadState error={query.error?.message} onRetry={() => void query.refetch()} />
  return <RegistrationExperience snapshot={query.data} />
}
function RegistrationExperience({ snapshot }: { snapshot: JourneySnapshot }) {
  const mutation = useJourneyMutation()
  const navigate = useNavigate()
  const [dirty, setDirty] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [removing, setRemoving] = useState(false)
  const [confirmRevision, setConfirmRevision] = useState<number | null>(null)
  const confirmed = snapshot.registration?.status === 'confirmed'
  const dataComplete = registrationSchema.safeParse(snapshot.registration?.data).success
  const blocker = useBlocker(dirty && !confirmed)
  const onDirty = useCallback((value: boolean) => setDirty(value), [])
  useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])
  async function save(values: RegistrationValues, review = false) {
    setFeedback('')
    try {
      const saved = await mutation.mutateAsync({ type: 'save', values, revision: snapshot.revision, create: !snapshot.registration })
      setDirty(false)
      if (review) setConfirmRevision(saved.revision)
      else setFeedback('Rascunho guardado neste browser.')
      return true
    } catch { return false }
  }
  return <div className="space-y-5">
    <Button asChild variant="ghost" className="-ml-3"><Link to={journeyPaths.home}><ArrowLeft />Voltar ao Meu Percurso</Link></Button>
    <header><p className="spee-eyebrow">Constituição · Registo da empresa</p><div className="mt-2 flex flex-wrap items-center gap-4"><h1 className="text-3xl font-semibold tracking-tight">Registar empresa</h1><StatusBadge status={confirmed ? 'completed' : snapshot.registration ? 'in-progress' : 'available'} /></div><p className="mt-2 text-sm text-slate-500">{confirmed ? 'Registo concluído. Consulte os dados e o comprovativo da simulação.' : 'Prepare os dados e confirme o registo para concluir esta actividade.'}</p></header>
    {feedback && <p role="status" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</p>}
    {mutation.error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{mutation.error.message}</p>}
    <div className="journey-columns">
      {confirmed ? <RegistrationResult snapshot={snapshot} /> : <RegistrationForm key={snapshot.registration?.id ?? 'new'} initialValues={snapshot.registration?.data} pending={mutation.isPending} canRemove={!!snapshot.registration} onSave={values => save(values)} onReview={values => save(values, true)} onRemove={() => { mutation.reset(); setRemoving(true) }} onDirty={onDirty} />}
      <div className="space-y-4"><aside className="spee-panel self-start p-5"><h2 className="font-semibold">O que é necessário?</h2><ol className="mt-5 space-y-5">{['Preencher os dados da empresa', 'Submeter o formulário de registo', 'Gerar o comprovativo de constituição'].map((label, index) => <li key={label} className="flex gap-3 text-sm leading-6">{confirmed || (index === 0 && dataComplete) ? <CheckCircle2 className="shrink-0 text-emerald-600" size={22} /> : <Circle className="shrink-0 text-slate-300" size={22} />}{label}</li>)}</ol><p className="mt-6 flex gap-2 rounded-md bg-blue-50 p-3 text-xs leading-5 text-blue-800"><Info className="shrink-0" size={16} />A confirmação simula a operação do módulo. Guardar um rascunho não conclui a actividade.</p></aside><ConversationPanel snapshot={snapshot} activityId="registar-empresa" /></div>
    </div>
    <ConfirmDialog open={confirmRevision !== null} onOpenChange={value => { if (!value) setConfirmRevision(null) }} title="Confirmar o registo da empresa?" description="Os dados guardados serão confirmados nesta simulação e será gerado um comprovativo local. O resultado ficará disponível para consulta." confirmLabel="Confirmar registo" pending={mutation.isPending} error={mutation.error?.message} onConfirm={() => mutation.mutate({ type: 'confirm', revision: confirmRevision! }, { onSuccess: () => { setDirty(false); setConfirmRevision(null); setFeedback('Actividade concluída. Pode consultar o resultado ou regressar ao percurso.') } })} />
    <ConfirmDialog open={removing} onOpenChange={setRemoving} title="Eliminar o rascunho?" description="Os dados deste rascunho serão eliminados. O histórico fica preservado e poderá criar um novo registo." confirmLabel="Eliminar rascunho" destructive pending={mutation.isPending} error={mutation.error?.message} onConfirm={() => mutation.mutate({ type: 'remove', revision: snapshot.revision }, { onSuccess: () => { setDirty(false); setRemoving(false); setFeedback('Rascunho eliminado. Pode criar um novo registo.'); navigate(journeyPaths.registration, { replace: true }) } })} />
    <ConfirmDialog open={blocker.state === 'blocked'} onOpenChange={value => { if (!value && blocker.state === 'blocked') blocker.reset() }} title="Sair sem guardar?" description="Existem alterações no formulário que ainda não foram guardadas." confirmLabel="Sair sem guardar" destructive onConfirm={() => { if (blocker.state === 'blocked') blocker.proceed() }} />
  </div>
}
