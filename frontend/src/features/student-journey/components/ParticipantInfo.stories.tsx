import type { Meta, StoryObj } from '@storybook/react-vite'
import { ParticipantInfo } from './ParticipantInfo'
import '../styles.css'
const meta = {
  title: 'Estudante/Informação dos participantes',
  component: ParticipantInfo,
  decorators: [Story => <div style={{ maxWidth: 360, padding: 16 }}><Story /></div>],
  args: { participants: [{ name: 'Ana Machava', contribution: 'Preparação dos dados e preenchimento do formulário de registo.' }, { name: 'João Tembe', contribution: 'Conferência do NUIT, da morada e do capital social.' }, { name: 'António Sitoe', contribution: 'Revisão dos documentos de constituição.' }] },
} satisfies Meta<typeof ParticipantInfo>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Empty: Story = { args: { participants: [] } }
