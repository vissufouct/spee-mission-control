import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { JourneyRepository } from '../services/JourneyRepository'
import type { ConversationGateway } from '../services/ConversationGateway'
const ConversationContext = createContext<ConversationGateway | null>(null)

const RepositoryContext = createContext<JourneyRepository | null>(null)
export function JourneyProvider({ repository, children, conversations }: { repository: JourneyRepository; children: ReactNode; conversations?: ConversationGateway }) {
  return <RepositoryContext.Provider value={repository}><ConversationContext.Provider value={conversations ?? null}>{children}</ConversationContext.Provider></RepositoryContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useConversationGateway() { return useContext(ConversationContext) }
// The context and hook are a single dependency-injection boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useJourneyRepository() {
  const repository = useContext(RepositoryContext)
  if (!repository) throw new Error('JourneyProvider em falta.')
  return repository
}
