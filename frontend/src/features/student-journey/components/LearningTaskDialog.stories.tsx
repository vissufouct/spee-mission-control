import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { LearningTaskDialog } from './LearningTaskDialog'
import '../activity-design.css'
const tasks = journeySnapshotSchema.parse(fixture).blocks.flatMap(block => block.activities).flatMap(activity => activity.tasks ?? [])
const quiz = tasks.find(task => task.id === 'registration-quiz')!
const meta = { title: 'Estudante/Tarefa de aprendizagem', component: LearningTaskDialog,
  args: { task: quiz, pending: false, onClose: () => {}, onComplete: () => {} },
} satisfies Meta<typeof LearningTaskDialog>
export default meta
type Story = StoryObj<typeof meta>
export const Quiz: Story = {}
export const Diagnostic: Story = { args: { task: tasks.find(task => task.id === 'entrepreneur-diagnostic')! } }
export const SubmittedEvidence: Story = { args: { task: tasks.find(task => task.id === 'audit-report-1')! } }
export const PendingEvidence: Story = { args: { task: tasks.find(task => task.id === 'registration-declaration')! } }
export const Error: Story = { args: { error: 'Reveja as respostas: é necessário acertar todas as perguntas.' } }
export const Saving: Story = { args: { pending: true } }
export const Completed: Story = { args: { task: { ...quiz, status: 'completed', answers: { nuit: 1, capital: 0, evidence: 2 } } } }
export const Blocked: Story = { args: { task: { ...quiz, status: 'blocked' } } }
