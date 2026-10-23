import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import { readFilters } from '../services/teacher.selectors'
import { OverviewView } from './OverviewView'
const snapshot = teacherSnapshotSchema.parse(fixture)
function InteractiveOverview() {
  const [params, setParams] = useState(new URLSearchParams())
  return <OverviewView snapshot={snapshot} filters={readFilters(params)} onChange={(key,value) => setParams(previous => { const next = new URLSearchParams(previous); next.set(key,value); return next })} onClear={() => setParams(new URLSearchParams())} onOpen={() => {}} onRequests={() => {}} />
}
const meta = {
  title: 'Docente/Visão geral sem AppShell', component: OverviewView,
  args: { snapshot, filters: readFilters(new URLSearchParams()), onChange: () => {}, onClear: () => {}, onOpen: () => {}, onRequests: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OverviewView>
export default meta
type Story = StoryObj<typeof meta>
export const WithData: Story = { render: () => <InteractiveOverview /> }
export const Empty: Story = { args: { filters: readFilters(new URLSearchParams('q=sem-resultados')) } }
export const CombinedFilters: Story = { args: { filters: readFilters(new URLSearchParams('marco.constituicao=completed&marco.salarios=in-progress')) } }
