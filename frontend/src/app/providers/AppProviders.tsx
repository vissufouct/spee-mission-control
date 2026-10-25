import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { JourneyProvider, JsonJourneyRepository } from '@/features/student-journey'
import { selectStudentScenario } from './studentScenario'
import teacherFixture from '@/data/teacher-mission-control.fixture.json'
import scenarioFixture from '@/data/scenario-editor.fixture.json'
import { TeacherProvider, JsonTeacherRepository, teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { JsonScenarioRepository, ScenarioProvider } from '@/features/scenario-editor'
import { mapStudentJourney } from './mapStudentJourney'
import { createStudentConversations } from './createStudentConversations'
import { SocialProvider, JsonSocialRepository, GiphyRepository } from '@/features/social-hub'
import socialFixture from '@/data/social-hub.fixture.json'
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: false } } })
const studentScenario = selectStudentScenario()
const scenarioStorage = {
  getItem: (key: string) => window.localStorage.getItem(`spee.roadmap-2026.${studentScenario.id}.${key}`),
  setItem: (key: string, value: string) => window.localStorage.setItem(`spee.roadmap-2026.${studentScenario.id}.${key}`, value),
}
// Lazy Storage calls preserve an actionable error screen if browser storage is unavailable.
const repository = new JsonJourneyRepository(studentScenario.seed, scenarioStorage)
const teacherSeed = teacherSnapshotSchema.parse(teacherFixture)
// The former fixture includes salary conversations outside this roadmap. Keep
// other companies intact and do not attach those messages to unrelated tasks.
const linkedCompanyId = teacherSeed.companies.find(company => company.linkedToStudent)!.id
const roadmapActivityIds = new Set(studentScenario.seed.blocks.flatMap(block => block.activities.map(activity => activity.id)))
teacherSeed.orientations = teacherSeed.orientations.filter(note => note.companyId !== linkedCompanyId || roadmapActivityIds.has(note.activityId))
teacherSeed.orientationRequests = teacherSeed.orientationRequests.filter(note => note.companyId !== linkedCompanyId || roadmapActivityIds.has(note.activityId))
const teacherRepository = new JsonTeacherRepository(teacherSeed, scenarioStorage, async () => mapStudentJourney(await repository.getSnapshot(), teacherSeed.companies.find(c => c.linkedToStudent)!))
const scenarioRepository = new JsonScenarioRepository(scenarioFixture, {
  getItem: key => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
})
const conversations = createStudentConversations(repository, teacherRepository)
const socialGifs = new GiphyRepository(import.meta.env.VITE_GIPHY_API_KEY ?? '')
const socialRepository = new JsonSocialRepository(socialFixture, scenarioStorage)
export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}><SocialProvider repository={socialRepository} gifs={socialGifs}><JourneyProvider repository={repository} conversations={conversations}><TeacherProvider repository={teacherRepository}><ScenarioProvider repository={scenarioRepository}>{children}</ScenarioProvider></TeacherProvider></JourneyProvider></SocialProvider></QueryClientProvider>
}
