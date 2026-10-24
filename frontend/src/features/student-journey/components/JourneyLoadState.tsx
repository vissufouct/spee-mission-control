import { AsyncState } from '@/shared/components/AsyncState'
export function JourneyLoadState({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return <AsyncState error={error} onRetry={onRetry} />
}
