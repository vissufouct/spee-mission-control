import type { Meta, StoryObj } from '@storybook/react-vite'
import { AsyncState } from '@/shared/components/AsyncState'
const meta = {
  title: 'Docente/Carregamento e erro', component: AsyncState,
  args: { loadingTitle: 'A preparar o Mission Control…', errorTitle: 'Não foi possível abrir o Mission Control', onRetry: () => {} },
} satisfies Meta<typeof AsyncState>
export default meta
type Story = StoryObj<typeof meta>
export const Loading: Story = {}
export const Error: Story = { args: { error: 'Não foi possível ler o cenário do docente. Os dados locais não foram alterados.' } }
