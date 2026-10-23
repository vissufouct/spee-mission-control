import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { JourneyView } from './JourneyView'

const snapshot = journeySnapshotSchema.parse(fixture)
const meta = {
  title: 'Estudante/Meu Percurso sem AppShell',
  component: JourneyView,
  args: { snapshot, filter: 'all', onFilter: () => {}, onOpen: () => {}, onFullPath: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof JourneyView>
export default meta
type Story = StoryObj<typeof meta>
export const WithData: Story = {}
export const Completed: Story = {
  args: { snapshot: { ...snapshot, registration: { ...snapshot.registration!, status: 'confirmed', receiptNumber: 'REG-DEMO-0841' } } },
}
export const Empty: Story = {
  args: { snapshot: { ...snapshot, blocks: snapshot.blocks.map(block => block.id === snapshot.context.currentBlockId ? { ...block, activities: [] } : block) } },
}
export const EmptyFilter: Story = {
  args: { filter: 'in-progress', snapshot: { ...snapshot, registration: null } },
}
