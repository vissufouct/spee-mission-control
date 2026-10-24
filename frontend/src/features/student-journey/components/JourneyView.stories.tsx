import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { JourneyView } from './JourneyView'
import { MemoryRouter } from 'react-router-dom'
import { JourneyProgressHeading } from './JourneyProgressHeading'
import { getProgress } from '../services/journey.selectors'

const snapshot = journeySnapshotSchema.parse(fixture)
const meta = {
  title: 'Estudante/Meu Percurso sem AppShell',
  component: JourneyView,
  render: args => <MemoryRouter><div className="space-y-5"><JourneyProgressHeading {...getProgress(args.snapshot)} /><JourneyView {...args} /></div></MemoryRouter>,
  args: { snapshot, filter: 'all', onFilter: () => {}, onOpen: () => {} },
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
