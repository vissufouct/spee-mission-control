import type { Meta, StoryObj } from '@storybook/react-vite'
import { SupportMaterials } from './SupportMaterials'
const meta = { title: 'Estudante/Materiais de apoio', component: SupportMaterials, args: { materials: [] } } satisfies Meta<typeof SupportMaterials>
export default meta
type Story = StoryObj<typeof meta>
export const Empty: Story = {}
export const Formats: Story = { args: { materials: [
  { title: 'Guia de constituição', description: 'Consultar as etapas de registo.', format: 'pdf' },
  { title: 'Mapa de capital', description: 'Preparar as entradas de capital.', format: 'excel' },
  { title: 'Minuta da sociedade', description: 'Rever os elementos da sociedade.', format: 'word' },
  { title: 'Demonstração do registo', description: 'Acompanhar os passos no simulador.', format: 'video' },
  { title: 'Guia de registo', description: 'Página de apoio do protótipo.', format: 'url', href: 'apoio/registo-empresa.html' },
] } }
