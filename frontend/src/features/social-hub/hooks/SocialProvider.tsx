import { CoachContext } from './useCoach'
import type { CoachRepository } from '../services/CoachRepository'
import { createContext, useContext, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SocialCommand, SocialRepository } from '../services/SocialRepository'
import type { GifRepository } from '../services/GifRepository'
const Context = createContext<SocialRepository | null>(null)
const GifContext = createContext<GifRepository | undefined>(undefined)
export function SocialProvider({ repository, gifs, coach, children }: { repository: SocialRepository; gifs?: GifRepository; coach?: CoachRepository; children: ReactNode }) { return <Context.Provider value={repository}><GifContext.Provider value={gifs}><CoachContext.Provider value={coach}>{children}</CoachContext.Provider></GifContext.Provider></Context.Provider> }
// eslint-disable-next-line react-refresh/only-export-components
export function useSocialGifs(term: string) {
  const repository = useContext(GifContext)
  const query = useQuery({ queryKey: ['social-gifs', term], queryFn: ({ signal }) => repository!.search(term, signal), enabled: Boolean(repository?.configured), retry: false, staleTime: 60_000, refetchOnWindowFocus: false })
  return { configured: Boolean(repository?.configured), query }
}
// eslint-disable-next-line react-refresh/only-export-components
export function useSocial() {
  const repository = useContext(Context)
  if (!repository) throw new Error('SocialProvider em falta.')
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['social-hub'], queryFn: () => repository.getSnapshot() })
  const mutation = useMutation({ mutationFn: (command: SocialCommand) => repository.execute(command, query.data!.revision), onSuccess: data => client.setQueryData(['social-hub'], data) })
  return { query, mutation }
}
