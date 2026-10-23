import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useJourneyRepository } from './JourneyProvider'
import type { RegistrationValues } from '../types'
import { downloadJson } from '../services/download'

const queryKey = ['student-journey'] as const
export function useJourney() {
  const repository = useJourneyRepository()
  return useQuery({ queryKey, queryFn: () => repository.getSnapshot(), retry: false })
}
export function useScenarioExport() {
  const repository = useJourneyRepository()
  return async () => downloadJson(await repository.exportSnapshot(), 'spee-cenario.json')
}
type Command =
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
