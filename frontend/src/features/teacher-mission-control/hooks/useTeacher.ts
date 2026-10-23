import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTeacherRepository } from './TeacherProvider'
import type { GeneralOrientationInput, OrientationInput, RequestReply } from '../types'
const queryKey = ['teacher-mission-control'] as const
export function useTeacher() {
  const repository = useTeacherRepository()
  return useQuery({ queryKey, queryFn: () => repository.getSnapshot(), staleTime: 0, refetchOnMount: 'always', retry: false })
}
type Command = { type: 'save'; input: OrientationInput; revision: number; id?: string }
  | { type: 'record' | 'remove'; id: string; revision: number } | { type: 'reset' }
  | { type: 'reply-request'; id: string; input: RequestReply; revision: number }
  | { type: 'conclude-request'; id: string; revision: number }
  | { type: 'publish-general'; input: GeneralOrientationInput; revision: number }
export function useTeacherMutation() {
  const repository = useTeacherRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (command: Command) => {
      switch (command.type) {
        case 'save': return repository.saveOrientation(command.input, command.revision, command.id)
        case 'remove': return repository.removeOrientation(command.id, command.revision)
        case 'record': return repository.recordOrientation(command.id, command.revision)
        case 'reply-request': return repository.replyToOrientationRequest(command.id, command.input, command.revision)
        case 'conclude-request': return repository.concludeOrientationRequest(command.id, command.revision)
        case 'publish-general': return repository.publishGeneralOrientation(command.input, command.revision)
        case 'reset': return repository.reset()
      }
    },
    onSuccess: () => client.invalidateQueries({ queryKey }),
  })
}
