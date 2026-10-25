import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import untouched from '@/data/student-roadmap-example-2.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { getLearningTasks } from '../services/learning-tasks'
import { ActivityTasks } from './ActivityTasks'
import '../activity-design.css'

const tasks = (seed: unknown) => {
  const snapshot = journeySnapshotSchema.parse(seed)
  return getLearningTasks(snapshot.blocks.flatMap(block => block.activities).find(activity => activity.id === 'registar-empresa')!, snapshot)
}
const meta = {
  title: 'Estudante/Tarefas e participantes',
  component: ActivityTasks,
  args: { tasks: tasks(fixture), onOpen: () => {} },
  decorators: [Story => <div className="student-activity-detail" style={{ padding: 16 }}><Story /></div>],
} satisfies Meta<typeof ActivityTasks>
export default meta
export const WithData: StoryObj<typeof meta> = {}
export const NotStarted: StoryObj<typeof meta> = { args: { tasks: tasks(untouched) } }
export const Empty: StoryObj<typeof meta> = { args: { tasks: [] } }
