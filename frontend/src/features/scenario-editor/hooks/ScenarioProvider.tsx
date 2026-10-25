import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { ScenarioRepository } from '../services/ScenarioRepository'

const RepositoryContext = createContext<ScenarioRepository | null>(null)

export function ScenarioProvider({ repository, children }: { repository: ScenarioRepository; children: ReactNode }) {
  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScenarioRepository() {
  const repository = useContext(RepositoryContext)
  if (!repository) throw new Error('ScenarioProvider em falta.')
  return repository
}
