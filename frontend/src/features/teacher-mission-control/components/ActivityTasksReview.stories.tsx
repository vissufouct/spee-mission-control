import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import { ActivityTasksReview } from './ActivityTasksReview'

const snapshot = teacherSnapshotSchema.parse(fixture)
const company = snapshot.companies.find(item => item.id === 'maputo-solucoes')!
const meta = { title: 'Docente/Realização de tarefas', component: ActivityTasksReview,
  args: { tasks: company.activities.find(item => item.id === 'definir-ideia')!.tasks },
} satisfies Meta<typeof ActivityTasksReview>
export default meta
type Story = StoryObj<typeof meta>
export const WithData: Story = {}
export const Empty: Story = { args: { tasks: [] } }

export const IndividualQuizResults: Story = { args: {
  participants: company.participants,
  tasks: company.activities.find(item => item.id === 'definir-ideia')!.tasks!.filter(task => task.kind === 'quiz').map(task => ({ ...task, quizResults: [{ participantId: company.participants[0].id, answers: task.answers! }] })),
} }
