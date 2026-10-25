import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { JourneyProvider, JsonJourneyRepository } from '@/features/student-journey'
import fixture from '@/data/student-journey.fixture.json'
import teacherFixture from '@/data/teacher-mission-control.fixture.json'
import { TeacherProvider, JsonTeacherRepository, teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { mapStudentJourney } from './mapStudentJourney'
import { createStudentConversations } from './createStudentConversations'
import { SocialProvider, JsonSocialRepository, GiphyRepository } from '@/features/social-hub'
import socialFixture from '@/data/social-hub.fixture.json'
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: false } } })
// Lazy Storage calls preserve an actionable error screen if browser storage is unavailable.
const repository = new JsonJourneyRepository(fixture, {
  getItem: key => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
})
const teacherSeed = teacherSnapshotSchema.parse(teacherFixture)
const teacherRepository = new JsonTeacherRepository(teacherSeed, {
  getItem: key => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
}, async () => mapStudentJourney(await repository.getSnapshot(), teacherSeed.companies.find(c => c.linkedToStudent)!))
const conversations = createStudentConversations(repository, teacherRepository)
const socialGifs = new GiphyRepository(import.meta.env.VITE_GIPHY_API_KEY ?? '')
const socialRepository = new JsonSocialRepository(socialFixture, {
  getItem: key => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
})
export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}><SocialProvider repository={socialRepository} gifs={socialGifs}><JourneyProvider repository={repository} conversations={conversations}><TeacherProvider repository={teacherRepository}>{children}</TeacherProvider></JourneyProvider></SocialProvider></QueryClientProvider>
}
