import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Save, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { registrationSchema } from '../schemas/journey.schema'
import type { RegistrationValues } from '../types'

const emptyValues: RegistrationValues = { legalName: '', taxId: '', sector: '', province: 'Maputo', address: '', email: '', capital: 0 }
export function RegistrationForm({ initialValues, pending, canRemove, onSave, onReview, onRemove, onDirty }: {
  initialValues?: RegistrationValues; pending: boolean; canRemove: boolean;
  onSave: (values: RegistrationValues) => Promise<boolean>; onReview: (values: RegistrationValues) => Promise<boolean>;
  onRemove: () => void; onDirty: (dirty: boolean) => void
}) {
  const { register, handleSubmit, getValues, reset, formState: { errors, isDirty } } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema), defaultValues: initialValues ?? emptyValues,
  })
  useEffect(() => onDirty(isDirty), [isDirty, onDirty])
  const textFields = [
    { name: 'legalName', label: 'Denominação da empresa', placeholder: 'Ex.: Horizonte Verde, Lda.', wide: true },
    { name: 'taxId', label: 'NUIT', placeholder: '9 algarismos', wide: false },
    { name: 'email', label: 'Correio electrónico da empresa', placeholder: 'contacto@empresa.example', wide: false },
    { name: 'sector', label: 'Actividade económica', placeholder: 'Ex.: Comércio de produtos agrícolas', wide: true },
    { name: 'address', label: 'Morada', placeholder: 'Avenida, número e cidade', wide: true },
  ] as const
  async function save() { const values = getValues(); if (await onSave(values)) reset(values) }
  return <form onSubmit={handleSubmit(async values => { if (await onReview(values)) reset(values) })} noValidate className="spee-panel p-6">
    <h2 className="text-lg font-semibold">Dados da empresa</h2><p className="mb-6 mt-2 text-sm text-slate-500">Pode guardar um rascunho incompleto. Todos os campos são obrigatórios para confirmar.</p>
    <fieldset disabled={pending} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {textFields.map(field => <div key={field.name} className={field.wide ? 'sm:col-span-2' : ''}><label htmlFor={field.name} className="journey-field-label">{field.label}</label>
        <input {...register(field.name)} id={field.name} className="journey-field-input" placeholder={field.placeholder} type={field.name === 'email' ? 'email' : 'text'} inputMode={field.name === 'taxId' ? 'numeric' : undefined} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? field.name + '-error' : undefined} />
        {errors[field.name] && <p id={field.name + '-error'} className="journey-field-error">{errors[field.name]?.message}</p>}
      </div>)}
      <div><label htmlFor="province" className="journey-field-label">Província</label><select {...register('province')} id="province" className="journey-field-input">{registrationSchema.shape.province.options.map(province => <option key={province}>{province}</option>)}</select></div>
      <div><label htmlFor="capital" className="journey-field-label">Capital social (MZN)</label><input {...register('capital', { setValueAs: value => value === '' ? 0 : Number(value) })} id="capital" className="journey-field-input" inputMode="decimal" type="number" min="0" step="0.01" aria-invalid={!!errors.capital} aria-describedby={errors.capital ? 'capital-error' : undefined} />{errors.capital && <p id="capital-error" className="journey-field-error">{errors.capital.message}</p>}</div>
    </fieldset>
    <div className="mt-7 flex flex-wrap justify-between gap-3 border-t pt-5">
      {canRemove ? <Button type="button" variant="ghost" onClick={onRemove} disabled={pending} className="text-red-700"><Trash2 />Eliminar rascunho</Button> : <span />}
      <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => void save()} disabled={pending}><Save />Guardar rascunho</Button><Button type="submit" disabled={pending}>{pending ? 'A guardar…' : 'Rever e confirmar'}<ArrowRight /></Button></div>
    </div>
  </form>
}
import '../styles.css'
