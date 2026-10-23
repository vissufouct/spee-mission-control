import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { JourneyRepository } from '../services/JourneyRepository'

const RepositoryContext = createContext<JourneyRepository | null>(null)
export function JourneyProvider({ repository, children }: { repository: JourneyRepository; children: ReactNode }) {
  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}
// The context and hook are a single dependency-injection boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useJourneyRepository() {
  const repository = useContext(RepositoryContext)
  if (!repository) throw new Error('JourneyProvider em falta.')
  return repository
}

