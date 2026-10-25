import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useScenarioRepository } from './ScenarioProvider'
import type { ScenarioDocumentCommand } from '../types'
import { downloadScenarioJson } from '../services/download'

const queryKey = ['scenario-editor'] as const

export function useScenarioDocument() {
  const repository = useScenarioRepository()
  return useQuery({ queryKey, queryFn: () => repository.getDocument(), retry: false })
}

export function useScenarioCommand() {
  const repository = useScenarioRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ command, revision }: { command: ScenarioDocumentCommand; revision: number }) => repository.execute(command, revision),
    onSuccess: document => client.setQueryData(queryKey, document),
  })
}

export function useScenarioExport() {
  const repository = useScenarioRepository()
  return async () => downloadScenarioJson(await repository.exportDocument(), 'roteiro-spee.json')
}
