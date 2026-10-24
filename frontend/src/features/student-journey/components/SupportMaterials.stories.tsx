import type { Meta, StoryObj } from '@storybook/react-vite'
import { SupportMaterials } from './SupportMaterials'

const meta = { title: 'Estudante/Materiais de apoio', component: SupportMaterials } satisfies Meta<typeof SupportMaterials>
export default meta
type Story = StoryObj<typeof meta>
export const MixedFormats: Story = { args: { materials: [
  { title: 'Guia de constituição', format: 'pdf', description: 'Exemplo ilustrativo de guia.' },
  { title: 'Lista de documentos', format: 'pdf', description: 'Exemplo ilustrativo de lista.' },
  { title: 'Minuta do contrato', format: 'pdf', description: 'Exemplo ilustrativo de minuta.' },
  { title: 'Capital social', format: 'excel', description: 'Exemplo ilustrativo de folha de cálculo.' },
  { title: 'Como registar a empresa', format: 'video', description: 'Exemplo ilustrativo de vídeo.' },
] } }
export const Empty: Story = { args: { materials: [] } }
