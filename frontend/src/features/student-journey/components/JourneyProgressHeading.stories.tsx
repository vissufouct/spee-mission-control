import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { JourneyProgressHeading } from './JourneyProgressHeading'
import '../styles.css'

const meta = {
  title: 'Estudante/Cabeçalho do progresso',
  component: JourneyProgressHeading,
  decorators: [Story => <MemoryRouter><Story /></MemoryRouter>],
  args: { completed: 3, total: 17, percent: 18 },
} satisfies Meta<typeof JourneyProgressHeading>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const FullJourney: Story = { args: { title: 'Percurso completo', showFullPath: false } }
export const Empty: Story = { args: { completed: 0, total: 0, percent: 0 } }
export const Completed: Story = { args: { completed: 17, total: 17, percent: 100 } }
