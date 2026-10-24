import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationTile } from './NotificationTile'
import '../styles.css'
const meta = { title: 'Estudante/Cartão de notificações', component: NotificationTile, args: { title: 'Orientações do docente', items: [], onOpen: () => {} }, decorators: [Story => <div style={{ maxWidth: 360 }}><Story /></div>] } satisfies Meta<typeof NotificationTile>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = {}
export const Loading: Story = { args: { loading: true } }
export const WithData: Story = { args: { items: [1, 2, 3, 4].map(i => ({ id: String(i), author: 'Vali Issufo', activityTitle: 'Registar empresa', message: 'Confirmem os documentos de constituição antes de avançarem para o início de actividades.' })) } }
