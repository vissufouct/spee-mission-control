import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import fixture from '@/data/student-journey.fixture.json'
import { JsonJourneyRepository } from '../api/JsonJourneyRepository'
import { JourneyProvider } from '../hooks/JourneyProvider'
import { useJourney } from '../hooks/useJourney'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { ConversationPanel } from '../components/ConversationPanel'
function MemoryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient())
  const [repository] = useState(() => {
    const store = new Map<string, string>()
    return new JsonJourneyRepository(fixture, { getItem: key => store.get(key) ?? null, setItem: (key, value) => { store.set(key, value) } })
  })
  return <QueryClientProvider client={client}><JourneyProvider repository={repository} conversations={{ read: async () => [], send: async () => {} }}>{children}</JourneyProvider></QueryClientProvider>
}
function LivePanel() {
  const query = useJourney()
  return query.data ? <ConversationPanel snapshot={query.data} activityId="registar-empresa" initialChannel="group" initialOpen /> : <p>A carregar…</p>
}
const meta = {
  title: 'Estudante/Conversas sem AppShell', component: ConversationPanel,
  args: { snapshot: journeySnapshotSchema.parse(fixture), activityId: 'registar-empresa', initialChannel: 'group', initialOpen: true },
  decorators: [Story => <MemoryProvider><div style={{ maxWidth: 500 }}><Story /></div></MemoryProvider>],
} satisfies Meta<typeof ConversationPanel>
export default meta
type Story = StoryObj<typeof meta>
export const WithTasks: Story = { render: () => <LivePanel /> }
export const Empty: Story = { args: { activityId: 'reserva-nome' } }
