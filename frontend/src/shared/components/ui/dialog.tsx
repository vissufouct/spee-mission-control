// Adapted from shadcn/ui (MIT). Radix owns focus trapping, Escape and announcements.
import * as Primitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
export function Dialog({ open, onOpenChange, title, description, children, className }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode; className?: string
}) {
  const opener = useRef<HTMLElement | null>(null)
  return <Primitive.Root open={open} onOpenChange={onOpenChange}><Primitive.Portal>
    <Primitive.Overlay className="fixed inset-0 z-40 bg-slate-950/45 data-[state=open]:animate-in" />
    <Primitive.Content className={cn('fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-white p-6 shadow-xl sm:p-8', className)}
      onOpenAutoFocus={() => { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null }}
      onCloseAutoFocus={event => { if (opener.current?.isConnected) { event.preventDefault(); opener.current.focus() } }}>
      <Primitive.Title className="pr-8 text-2xl font-bold tracking-tight text-slate-950">{title}</Primitive.Title>
      {description ? <Primitive.Description className="mt-2 text-sm leading-6 text-slate-600">{description}</Primitive.Description> : <Primitive.Description className="sr-only">{title}</Primitive.Description>}
      <Primitive.Close className="absolute right-4 top-4 rounded p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline-2" aria-label="Fechar"><X size={22} /></Primitive.Close>
      {children}
    </Primitive.Content>
  </Primitive.Portal></Primitive.Root>
}
