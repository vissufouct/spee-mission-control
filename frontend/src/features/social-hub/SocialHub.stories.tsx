import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import fixture from '@/data/social-hub.fixture.json'
import { JsonSocialRepository } from './api/JsonSocialRepository'
import { SocialProvider } from './hooks/SocialProvider'
import { SocialHub } from './components/SocialHub'
function IsolatedHub({ withGifs = false }: { withGifs?: boolean }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  const [repository] = useState(() => { const data = new Map<string, string>(); return new JsonSocialRepository(fixture, { getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value) } }) })
  return <QueryClientProvider client={client}><SocialProvider repository={repository} gifs={withGifs ? { configured: true, search: async () => [{ id: "demo", title: "GIF de exemplo", url: "https://media.giphy.com/media/xT4uQulxzV39haRFjG/giphy.gif" }] } : undefined}><p>Abra o hub pela seta à direita. Experiência isolada, sem AppShell.</p><SocialHub /></SocialProvider></QueryClientProvider>
}
const meta = { title: 'Estudante/Hub social', component: IsolatedHub } satisfies Meta<typeof IsolatedHub>
export default meta
export const WithData: StoryObj<typeof meta> = {}

export const WithGifs: StoryObj<typeof meta> = { args: { withGifs: true } }
