import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useJourneyRepository } from './JourneyProvider'
import type { RegistrationValues } from '../types'

const queryKey = ['student-journey'] as const
export function useJourney() {
  const repository = useJourneyRepository()
  return useQuery({ queryKey, queryFn: () => repository.getSnapshot(), retry: false })
}
type Command =
  | { type: 'group-message'; activityId: string; message: string; assignee: string | null; revision: number }
  | { type: 'complete-task' | 'resolve-notification'; id: string; revision: number }
  | { type: 'save'; values: RegistrationValues; revision: number; create: boolean }
  | { type: 'confirm' | 'remove'; revision: number }
  | { type: 'import'; json: string; revision: number }
  | { type: 'reset' }
export function useJourneyMutation() {
  const repository = useJourneyRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (command: Command) => {
      switch (command.type) {
        case 'group-message': return repository.sendGroupMessage(command.activityId, command.message, command.assignee, command.revision)
        case 'complete-task': return repository.completeTask(command.id, command.revision)
        case 'resolve-notification': return repository.resolveNotification(command.id, command.revision)
        case 'save': return command.create
          ? repository.createRegistration(command.values, command.revision)
          : repository.updateRegistration(command.values, command.revision)
        case 'confirm': return repository.confirmRegistration(command.revision)
        case 'remove': return repository.removeRegistration(command.revision)
        case 'import': return repository.importSnapshot(command.json, command.revision)
        case 'reset': return repository.reset()
      }
    },
    onSuccess: snapshot => client.setQueryData(queryKey, snapshot),
  })
}
