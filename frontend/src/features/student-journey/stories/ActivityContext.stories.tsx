import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { ActivityContext } from '../components/ActivityContext'
import '../activity-design.css'

const snapshot = journeySnapshotSchema.parse(fixture)
const activities = snapshot.blocks.flatMap(block => block.activities)
const meta = { title: 'Estudante/Contexto da actividade', component: ActivityContext, args: { snapshot, activity: activities.find(activity => activity.id === 'registar-empresa')!, onActivity: () => {} } } satisfies Meta<typeof ActivityContext>
export default meta
export const Selected: StoryObj<typeof meta> = {}
export const First: StoryObj<typeof meta> = { args: { activity: activities[0] } }
export const Last: StoryObj<typeof meta> = { args: { activity: activities.at(-1)! } }
