import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { FullJourneyBlock } from './FullJourneyBlock'
import '../styles.css'

const snapshot = journeySnapshotSchema.parse(fixture)
const block = snapshot.blocks.find(item => item.id === snapshot.context.currentBlockId)!
const meta = {
  title: 'Estudante/Bloco do percurso completo', component: FullJourneyBlock,
  decorators: [Story => <MemoryRouter><Story /></MemoryRouter>],
  args: { snapshot, block, index: 1, onActivity: () => {} },
} satisfies Meta<typeof FullJourneyBlock>
export default meta
type Story = StoryObj<typeof meta>
export const Current: Story = {}
export const Collapsed: Story = { args: { block: snapshot.blocks[0], index: 0 } }
export const Empty: Story = { args: { block: { ...block, activities: [] } } }
