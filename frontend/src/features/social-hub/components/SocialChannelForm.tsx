import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { groupInputSchema, type SocialSnapshot } from '../schemas/social.schema'
import { ParticipantPicker } from './ParticipantPicker'
export function SocialChannelForm({ snapshot, pending, onCreate, onCancel }: { snapshot: SocialSnapshot; pending: boolean; onCreate: (name: string, invitees: string[]) => Promise<void>; onCancel: () => void }) {
  const form = useForm<{ name: string; invitees: string[] }>({ resolver: zodResolver(groupInputSchema), defaultValues: { name: '', invitees: [] } })
  return <form className="social-group-form" onSubmit={form.handleSubmit(async values => { try { await onCreate(values.name, values.invitees) } catch { /* Keep the draft. */ } })}>
    <label>Nome do grupo<input {...form.register('name')} maxLength={60} /></label>
    {form.formState.errors.name && <p role="alert">{form.formState.errors.name.message}</p>}
    <fieldset><legend>Convidar participantes</legend><Controller name="invitees" control={form.control} render={({ field }) => <ParticipantPicker multiple members={snapshot.members.filter(member => member.id !== snapshot.currentUserId)} selected={field.value} disabled={pending} onChoose={id => field.onChange(field.value.includes(id) ? field.value.filter(value => value !== id) : [...field.value, id])} />} /></fieldset>
    {form.formState.errors.invitees && <p role="alert">{form.formState.errors.invitees.message}</p>}
    <p>Os participantes entram no grupo depois de aceitarem o convite.</p><div><button type="button" onClick={onCancel}>Cancelar</button><button className="social-send" disabled={pending}>{pending ? 'A criar…' : 'Criar e convidar'}</button></div>
  </form>
}
