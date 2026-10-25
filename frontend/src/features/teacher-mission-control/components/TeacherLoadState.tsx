import { AsyncState } from '@/shared/components/AsyncState'
export function TeacherLoadState({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return <AsyncState error={error} onRetry={onRetry} loadingTitle="A preparar o Painel…" errorTitle="Não foi possível abrir o Painel" />
}
