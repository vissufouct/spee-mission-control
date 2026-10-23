import { useState } from 'react'
import { AsyncState } from '@/shared/components/AsyncState'
import { Button } from '@/shared/components/ui/button'
import { Dialog } from '@/shared/components/ui/dialog'
import { useTeacherMutation } from '../hooks/useTeacher'
export function TeacherLoadState({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  const [confirm, setConfirm] = useState(false)
  const mutation = useTeacherMutation()
  return <><AsyncState error={error} onRetry={onRetry} onReset={error ? () => setConfirm(true) : undefined} loadingTitle="A preparar o Mission Control…" errorTitle="Não foi possível abrir o Mission Control" />
    <Dialog open={confirm} onOpenChange={setConfirm} title="Repor cenário do docente?" description="As orientações e o respectivo histórico local serão eliminados. Os dados do estudante não serão alterados.">
      <p className="my-5 text-sm">Esta acção repõe apenas os dados do docente. Se o erro estiver na empresa ligada, é necessário verificar o cenário do estudante.</p>
      {mutation.error && <p role="alert">{mutation.error.message}</p>}
      <div className="flex gap-3"><Button variant="outline" onClick={() => setConfirm(false)} disabled={mutation.isPending}>Cancelar</Button><Button disabled={mutation.isPending} onClick={() => mutation.mutate({ type: 'reset' }, { onSuccess: () => setConfirm(false) })}>Confirmar reposição</Button></div>
    </Dialog></>
}
