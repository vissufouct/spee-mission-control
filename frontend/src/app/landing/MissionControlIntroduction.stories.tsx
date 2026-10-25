import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { MissionControlIntroduction } from './MissionControlIntroduction'
const meta = {
  title: 'Entrada/Apresentação do Painel',
  component: MissionControlIntroduction,
  args: { role: 'teacher', onClose: () => {} },
  decorators: [Story => <MemoryRouter><Story /></MemoryRouter>],
} satisfies Meta<typeof MissionControlIntroduction>
export default meta
type Story = StoryObj<typeof meta>
export const Teacher: Story = {}
export const Student: Story = { args: { role: 'student' } }
