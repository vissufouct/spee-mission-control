import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'

type Values = { name: string; note: string }

export function VersionDialog({ open, onOpenChange, suggestedName, pending, onSave }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  suggestedName: string
  pending: boolean
  onSave: (values: Values) => void
}) {
  const { register, handleSubmit, reset } = useForm<Values>({ defaultValues: { name: suggestedName, note: '' } })
  useEffect(() => { if (open) reset({ name: suggestedName, note: '' }) }, [open, reset, suggestedName])
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Guardar nova versão" description="A nova versão conserva uma cópia integral do roteiro actual." className="max-w-lg">
      <form className="scenario-version-form" onSubmit={handleSubmit(onSave)}>
        <label>Nome da versão<input {...register('name', { required: true, maxLength: 100 })} /></label>
        <label>Nota opcional<textarea rows={3} {...register('note', { maxLength: 500 })} /></label>
        <div><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>Cancelar</Button><Button type="submit" disabled={pending}>{pending ? 'A guardar…' : 'Guardar versão'}</Button></div>
      </form>
    </Dialog>
  )
}
