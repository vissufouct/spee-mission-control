import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TeacherOverviewPage, TeacherProvider } from '@/features/teacher-mission-control'
import { createPanelRepositories } from './createPanelRepositories'

function TeacherRoadmap() {
  const [repositories] = useState(() => {
    const values = new Map<string, string>()
    return createPanelRepositories({ getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) } }, '1')
  })
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  return <MemoryRouter><QueryClientProvider client={client}><TeacherProvider repository={repositories.teacher}><TeacherOverviewPage /></TeacherProvider></QueryClientProvider></MemoryRouter>
}
const meta = { title: 'Docente/Roteiro com duas empresas sem AppShell', component: TeacherRoadmap, parameters: { layout: 'padded' } } satisfies Meta<typeof TeacherRoadmap>
export default meta
export const WithData: StoryObj<typeof meta> = {}
