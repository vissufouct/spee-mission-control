import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import { CompanyView } from './CompanyView'
const snapshot = teacherSnapshotSchema.parse(fixture)
const company = snapshot.companies.find(c => c.id === 'nova-geracao')!
const meta = {
  title: 'Docente/Percurso sem AppShell', component: CompanyView,
  args: { snapshot, company, blockId: 'primeiro-ano', onBlock: () => {}, onOpen: () => {}, onContributions: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CompanyView>
export default meta
type Story = StoryObj<typeof meta>
export const WithData: Story = {}
export const Constitution: Story = { args: { blockId: 'constituicao' } }
