import { useState } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TeacherOverviewPage, TeacherCompanyPage, TeacherProvider } from '@/features/teacher-mission-control'
import { createPanelRepositories } from './createPanelRepositories'

function TeacherRoadmap({ path = '/docente/mission-control' }: { path?: string }) {
  const [repositories] = useState(() => {
    const values = new Map<string, string>()
    return createPanelRepositories({ getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) } }, '1')
  })
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  return <MemoryRouter initialEntries={[path]}><QueryClientProvider client={client}><TeacherProvider repository={repositories.teacher}><Routes><Route path="/docente/mission-control" element={<TeacherOverviewPage />} /><Route path="/docente/mission-control/empresas/:companyId" element={<TeacherCompanyPage />} /></Routes></TeacherProvider></QueryClientProvider></MemoryRouter>
}
const meta = { title: 'Docente/Roteiro com dez empresas sem AppShell', component: TeacherRoadmap, parameters: { layout: 'padded' } } satisfies Meta<typeof TeacherRoadmap>
export default meta
export const WithData: StoryObj<typeof meta> = {}
export const CompletedParticipation: StoryObj<typeof meta> = { args: { path: '/docente/mission-control/empresas/horizonte-verde?bloco=acolhimento' } }
