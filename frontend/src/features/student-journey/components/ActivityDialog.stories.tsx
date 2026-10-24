import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { ActivityDialog } from './ActivityDialog'
const snapshot = journeySnapshotSchema.parse(fixture)
const meta = {
  title: 'Estudante/Detalhe da actividade',
  component: ActivityDialog,
  args: { snapshot, activity: snapshot.blocks.flatMap(block => block.activities).find(activity => activity.id === 'registar-empresa')!, onClose: () => {}, onContinue: () => {} },
} satisfies Meta<typeof ActivityDialog>
export default meta
type Story = StoryObj<typeof meta>
export const InProgress: Story = {}
export const PageContentWithoutShell: Story = { args: { embedded: true } }
export const Completed: Story = {
  args: { snapshot: { ...snapshot, registration: { ...snapshot.registration!, status: 'confirmed', receiptNumber: 'REG-DEMO-0841' } } },
}
export const Blocked: Story = { args: { activity: snapshot.blocks.flatMap(block => block.activities).find(activity => activity.id === 'inicio-actividades')! } }
