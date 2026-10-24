import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import fixture from '@/data/student-journey.fixture.json'
import { JsonJourneyRepository } from '../api/JsonJourneyRepository'
import { JourneyProvider } from '../hooks/JourneyProvider'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { ActivityNotifications } from '../components/ActivityNotifications'
import { NotificationBar } from '../components/NotificationBar'
import { ConversationPanel } from '../components/ConversationPanel'
import '../styles.css'

const snapshot = journeySnapshotSchema.parse(fixture)
function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  const [repository] = useState(() => new JsonJourneyRepository(fixture, { getItem: () => null, setItem: () => {} }))
  return <MemoryRouter><QueryClientProvider client={client}><JourneyProvider repository={repository} conversations={{ read: async () => [], send: async () => {} }}>{children}</JourneyProvider></QueryClientProvider></MemoryRouter>
}
const meta = {
  title: 'Estudante/Notificações expansíveis sem AppShell', component: ActivityNotifications,
  decorators: [Story => <Providers><div className="student-activity-page"><Story /></div></Providers>],
  args: { snapshot, activityId: 'registar-empresa', children: <NotificationBar snapshot={snapshot}><ConversationPanel snapshot={snapshot} activityId="registar-empresa" /></NotificationBar> },
} satisfies Meta<typeof ActivityNotifications>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Empty: Story = { args: { snapshot: { ...snapshot, groupMessages: [] }, children: <NotificationBar snapshot={{ ...snapshot, groupMessages: [] }}><ConversationPanel snapshot={{ ...snapshot, groupMessages: [] }} activityId="registar-empresa" /></NotificationBar> } }
