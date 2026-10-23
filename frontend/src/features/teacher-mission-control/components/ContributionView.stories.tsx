import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import { ContributionView } from './ContributionView'
const snapshot = teacherSnapshotSchema.parse(fixture)
const company = snapshot.companies.find(c => c.id === 'nova-geracao')!
const meta = {
  title: 'Docente/Contribuição sem AppShell', component: ContributionView,
  args: { snapshot, company, category: 'confirmed', onCategory: () => {}, onOpen: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ContributionView>
export default meta
type Story = StoryObj<typeof meta>
export const WithData: Story = {}
export const Collective: Story = { args: { category: 'collective' } }
export const Automatic: Story = { args: { category: 'automatic' } }
export const Empty: Story = { args: { company: { ...company, events: [], results: [] } } }
