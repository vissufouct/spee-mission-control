import type { Meta, StoryObj } from '@storybook/react-vite'
import { BlockProgressBar } from './BlockProgressBar'

const activities = [
  { id: 'reserva', title: 'Reserva do nome', status: 'completed' as const },
  { id: 'registo', title: 'Registar empresa', status: 'in-progress' as const },
  { id: 'socios', title: 'Convidar sócios', status: 'not-started' as const },
  { id: 'inicio', title: 'Início de actividades', status: 'blocked' as const },
]
const meta = { title: 'Estudante/Barra segmentada do bloco', component: BlockProgressBar, args: { activities } } satisfies Meta<typeof BlockProgressBar>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Completed: Story = { args: { activities: activities.map(activity => ({ ...activity, status: 'completed' })) } }
export const Empty: Story = { args: { activities: [] } }
