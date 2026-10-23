import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmDialog } from './ConfirmDialog'
const meta = {
  title: 'Partilhados/Confirmação',
  component: ConfirmDialog,
  args: { open: true, onOpenChange: () => {}, title: 'Eliminar o rascunho?', description: 'Pode criar um novo registo posteriormente.', confirmLabel: 'Eliminar rascunho', destructive: true, onConfirm: () => {} },
} satisfies Meta<typeof ConfirmDialog>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Loading: Story = { args: { pending: true } }
export const Error: Story = { args: { error: 'Não foi possível guardar. Os dados não foram alterados.' } }
