import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { useTeacherMutation } from '../hooks/useTeacher'
import { generalOrientationInputSchema } from '../schemas/teacher.schema'
import { formatInstant } from '../services/teacher.selectors'
import type { GeneralOrientationInput, TeacherSnapshot } from '../types'

export function GeneralOrientationsPanel({ snapshot }: { snapshot: TeacherSnapshot }) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const mutation = useTeacherMutation()
  const activityOptions = [...new Set(
    snapshot.companies.flatMap(company => company.activities.map(activity => activity.title)),
  )]
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GeneralOrientationInput>({
    resolver: zodResolver(generalOrientationInputSchema),
    defaultValues: { classIds: snapshot.classes.map(item => item.id), activity: '', subject: '', message: '', reason: '' },
  })
  const publish = (input: GeneralOrientationInput) => mutation.mutate({ type: 'publish-general', input, revision: snapshot.revision }, {
    onSuccess: () => {
      setFeedback('Orientação publicada no cenário local para as turmas seleccionadas.')
      setOpen(false)
      reset({ classIds: snapshot.classes.map(item => item.id), activity: '', subject: '', message: '', reason: '' })
    },
  })
  return <section className="spee-panel teacher-section">
    <div className="teacher-section-heading"><div><h2>Orientações gerais do docente</h2><p className="teacher-hint">Inicie uma orientação para todas ou para várias turmas, sem depender de um pedido.</p></div><Button onClick={() => { mutation.reset(); setOpen(true) }}>Nova orientação geral</Button></div>
    {feedback && <p className="teacher-feedback" role="status">{feedback}</p>}
    {snapshot.generalOrientations.length ? <ul className="teacher-general-orientations">{[...snapshot.generalOrientations].reverse().map(item => <li key={item.id}><div><strong>{item.subject}</strong><span>{item.activity}</span><p>{item.message}</p></div><small>{item.classIds.map(id => snapshot.classes.find(value => value.id === id)?.name).filter(Boolean).join(', ')} · {item.author} · {formatInstant(item.createdAt)}{item.companyIds && ` · ${snapshot.companies.filter(company => item.companyIds!.includes(company.id)).map(company => company.name).join(', ')}`}</small></li>)}</ul> : <div className="teacher-empty"><p>Ainda não existem orientações gerais.</p><p>Utilize este painel para comunicar com várias turmas no mesmo ciclo.</p></div>}
    <Dialog className="teacher-dialog" open={open} onOpenChange={value => { if (!mutation.isPending) setOpen(value) }} title="Nova orientação geral" description="A mensagem ficará visível no cenário local das turmas seleccionadas.">
      <form className="teacher-form" onSubmit={handleSubmit(publish)}>
        <fieldset className="teacher-class-selection"><legend>Turmas destinatárias</legend>{snapshot.classes.map(item => <label key={item.id}><input type="checkbox" value={item.id} {...register('classIds')} />{item.name} · {item.subject}</label>)}{errors.classIds && <span role="alert">{errors.classIds.message}</span>}</fieldset>
        <label>Actividade<select {...register('activity')} aria-label="Actividade" aria-invalid={!!errors.activity}><option value="">Seleccione uma actividade</option>{activityOptions.map(activity => <option key={activity} value={activity}>{activity}</option>)}</select>{errors.activity && <span role="alert">{errors.activity.message}</span>}</label>
        <label>Assunto<input {...register('subject')} aria-invalid={!!errors.subject} />{errors.subject && <span role="alert">{errors.subject.message}</span>}</label>
        <label>Orientação<textarea rows={5} {...register('message')} aria-invalid={!!errors.message} />{errors.message && <span role="alert">{errors.message.message}</span>}</label>
        <label>Motivo<textarea rows={3} {...register('reason')} aria-invalid={!!errors.reason} />{errors.reason && <span role="alert">{errors.reason.message}</span>}</label>
        {mutation.error && <p role="alert">{mutation.error.message}</p>}
        <div className="teacher-actions"><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => setOpen(false)}>Cancelar</Button><Button disabled={mutation.isPending}>{mutation.isPending ? 'A publicar…' : 'Publicar orientação'}</Button></div>
      </form>
    </Dialog>
  </section>
}
