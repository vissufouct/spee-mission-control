import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirmar', onConfirm, pending = false, destructive = false, error }: {
  open: boolean; onOpenChange: (value: boolean) => void; title: string; description: string;
  confirmLabel?: string; onConfirm: () => void; pending?: boolean; destructive?: boolean; error?: string
}) {
  return <Dialog open={open} onOpenChange={value => { if (!pending) onOpenChange(value) }} title={title} description={description} className="max-w-lg">
    {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>Cancelar</Button>
      <Button variant={destructive ? 'destructive' : 'default'} onClick={onConfirm} disabled={pending}>{pending ? 'A guardar…' : confirmLabel}</Button>
    </div>
  </Dialog>
}

