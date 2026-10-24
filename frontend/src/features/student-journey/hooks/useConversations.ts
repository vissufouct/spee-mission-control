import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useConversationGateway } from './JourneyProvider'
export function useConversations() {
  const gateway = useConversationGateway()
  return useQuery({ queryKey: ['student-conversations'], queryFn: () => gateway ? gateway.read() : Promise.resolve([]), staleTime: 0, refetchOnMount: 'always', refetchInterval: 5000 })
}
export function useSendTeacherMessage() {
  const gateway = useConversationGateway()
  const client = useQueryClient()
  return useMutation({ mutationFn: async ({ activityId, message }: { activityId: string; message: string }) => {
    if (!gateway) throw new Error('Conversa com o docente indisponível.')
    await gateway.send(activityId, message)
  }, onSuccess: () => client.invalidateQueries() })
}
