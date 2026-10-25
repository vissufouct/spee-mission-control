import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import fixture from '@/data/scenario-editor.fixture.json'
import { JsonScenarioRepository, ScenarioProvider } from '../index'
import { ScenarioEditorPage } from './ScenarioEditorPage'
import '../styles.css'

const storage = new Map<string, string>()
const repository = new JsonScenarioRepository(fixture, { getItem: key => storage.get(key) ?? null, setItem: (key, value) => { storage.set(key, value) } })
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const meta = { title: 'Roteiro/Editor visual', component: ScenarioEditorPage, parameters: { layout: 'fullscreen' }, decorators: [Story => <QueryClientProvider client={queryClient}><ScenarioProvider repository={repository}><Story /></ScenarioProvider></QueryClientProvider>] } satisfies Meta<typeof ScenarioEditorPage>
export default meta
type Story = StoryObj<typeof meta>
export const SemAppShell: Story = {}
