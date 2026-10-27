import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { JourneyProvider, getLearningTasks } from '@/features/student-journey'
import { selectStudentScenario } from './studentScenario'
import scenarioFixture from '@/data/scenario-editor.fixture.json'
import { TeacherProvider } from '@/features/teacher-mission-control'
import { JsonScenarioRepository, ScenarioProvider } from '@/features/scenario-editor'
import { createPanelRepositories, exampleStorage } from './createPanelRepositories'
import { createStudentConversations } from './createStudentConversations'
import { SocialProvider, JsonSocialRepository, GiphyRepository } from '@/features/social-hub'
import socialFixture from '@/data/social-hub.fixture.json'
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: false } } })
const studentScenario = selectStudentScenario()
const storage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
}
const scenarioStorage = exampleStorage(storage, studentScenario.id)
const { student: repository, teacher: teacherRepository, companyId } = createPanelRepositories(storage, studentScenario.id)
const scenarioRepository = new JsonScenarioRepository(scenarioFixture, {
  getItem: key => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
})
const conversations = createStudentConversations(repository, teacherRepository, companyId)
const socialGifs = new GiphyRepository(import.meta.env.VITE_GIPHY_API_KEY ?? '')
const socialRepository = new JsonSocialRepository(socialFixture, scenarioStorage)
export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}><SocialProvider repository={socialRepository} gifs={socialGifs} coach={{ getContext: async () => {
    const snapshot = await repository.getSnapshot()
    return snapshot.blocks.map(block => ({ title: block.title, activities: block.activities.map(activity => ({ id: activity.id, title: activity.title, description: activity.description, tasks: getLearningTasks(activity, snapshot) })) }))
  } }}><JourneyProvider repository={repository} conversations={conversations}><TeacherProvider repository={teacherRepository}><ScenarioProvider repository={scenarioRepository}>{children}</ScenarioProvider></TeacherProvider></JourneyProvider></SocialProvider></QueryClientProvider>
}
