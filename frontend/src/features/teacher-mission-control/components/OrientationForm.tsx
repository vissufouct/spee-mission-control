import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { orientationInputSchema } from '../schemas/teacher.schema'
import type { Company, OrientationInput } from '../types'
export function OrientationForm({ company, initial, pending, error, onSave, onCancel }: {
  company: Company; initial?: OrientationInput; pending: boolean; error?: string;
  onSave: (value: OrientationInput) => void; onCancel: () => void
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<OrientationInput>({
    resolver: zodResolver(orientationInputSchema),
    defaultValues: initial ?? { companyId: company.id, activityId: company.activities.find(a => a.blockId === company.currentBlockId)?.id, subject: '', message: '', reason: '' },
  })
  return <form className="teacher-form" onSubmit={handleSubmit(onSave)}>
    <p className="teacher-link-note">Rascunho privado neste browser. Registar a orientação não envia mensagens nem altera o trabalho do estudante.</p>
    <label>Actividade<select {...register('activityId')} disabled={pending}>{company.activities.map(a => <option value={a.id} key={a.id}>{a.title}</option>)}</select></label>
    <label>Assunto<input {...register('subject')} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined} disabled={pending} /></label>
    {errors.subject && <p id="subject-error" role="alert">{errors.subject.message}</p>}
    <label>Orientação<textarea {...register('message')} rows={4} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} disabled={pending} /></label>
    {errors.message && <p id="message-error" role="alert">{errors.message.message}</p>}
    <label>Motivo<textarea {...register('reason')} rows={2} aria-invalid={!!errors.reason} aria-describedby={errors.reason ? 'reason-error' : undefined} disabled={pending} /></label>
    {errors.reason && <p id="reason-error" role="alert">{errors.reason.message}</p>}
    {error && <p role="alert">{error}</p>}
    <div className="teacher-actions"><Button type="button" variant="outline" onClick={onCancel} disabled={pending}>Cancelar</Button><Button type="submit" disabled={pending}>{pending ? 'A guardar…' : 'Guardar rascunho'}</Button></div>
  </form>
}
