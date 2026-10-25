import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { ActivityDialog } from './ActivityDialog'
const snapshot = journeySnapshotSchema.parse(fixture)
const completedSnapshot = structuredClone(snapshot)
completedSnapshot.registration = { ...snapshot.registration!, status: 'confirmed', receiptNumber: 'REG-DEMO-0841' }
const completedActivity = completedSnapshot.blocks.flatMap(block => block.activities).find(activity => activity.id === 'registar-empresa')!
for (const task of completedActivity.tasks ?? []) {
  task.status = 'completed'
  if (task.kind === 'quiz') task.answers = { nuit: 1, capital: 0, evidence: 2 }
}
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
  args: { snapshot: completedSnapshot, activity: completedActivity },
}
export const Blocked: Story = { args: { activity: snapshot.blocks.flatMap(block => block.activities).find(activity => activity.id === 'inicio-actividades')! } }
