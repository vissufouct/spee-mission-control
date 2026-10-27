import { createContext, useContext } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { coachReply, type CoachRepository } from '../services/CoachRepository'
export const CoachContext = createContext<CoachRepository | undefined>(undefined)
export function useCoach() {
  const repository = useContext(CoachContext)
  const query = useQuery({ queryKey: ['social-coach-context'], queryFn: () => repository!.getContext(), enabled: !!repository, staleTime: 0 })
  const reply = useMutation({ mutationFn: async ({ question, activityId }: { question: string; activityId: string }) => {
    if (!repository) throw new Error('O contexto do roteiro não está disponível.')
    const blocks = await repository.getContext()
    return coachReply(question, blocks, activityId)
  } })
  return { query, reply, available: !!repository }
}
