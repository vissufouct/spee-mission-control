import { useState } from 'react'
import { AsyncState } from '@/shared/components/AsyncState'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useJourneyMutation } from '../hooks/useJourney'
export function JourneyLoadState({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  const [reset, setReset] = useState(false)
  const mutation = useJourneyMutation()
  return <><AsyncState error={error} onRetry={onRetry} onReset={error ? () => setReset(true) : undefined} />
    <ConfirmDialog open={reset} onOpenChange={setReset} title="Repor dados locais?" description="Isto substitui os dados locais actuais pelos dados de demonstração iniciais." confirmLabel="Repor cenário" destructive pending={mutation.isPending} error={mutation.error?.message} onConfirm={() => mutation.mutate({ type: 'reset' }, { onSuccess: () => setReset(false) })} />
  </>
}

