import type { Meta, StoryObj } from '@storybook/react-vite'
import { AsyncState } from './AsyncState'
const meta = { title: 'Partilhados/Estado assíncrono', component: AsyncState } satisfies Meta<typeof AsyncState>
export default meta
type Story = StoryObj<typeof meta>
export const Loading: Story = {}
export const Error: Story = { args: { error: 'Não foi possível ler os dados locais.', onRetry: () => {}, onReset: () => {} } }
