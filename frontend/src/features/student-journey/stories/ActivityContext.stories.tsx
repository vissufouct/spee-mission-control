import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { JsonJourneyRepository } from '../api/JsonJourneyRepository'
import { ActivityContext } from '../components/ActivityContext'
import '../activity-design.css'

const snapshot = journeySnapshotSchema.parse(fixture)
const activities = snapshot.blocks.flatMap(block => block.activities)
const meta = {
  title: 'Estudante/Contexto da actividade',
  component: ActivityContext,
  args: { snapshot, activity: activities.find(activity => activity.id === 'registar-empresa')!, onBlock: () => {} },
  // Apply the same aggregate-state calculation as the app, without browser storage.
  loaders: [async ({ args }) => ({ snapshot: await new JsonJourneyRepository(args.snapshot, { getItem: () => null, setItem: () => {} }).getSnapshot() })],
  render: (args, { loaded }) => <ActivityContext {...args} snapshot={loaded.snapshot as typeof snapshot} />,
} satisfies Meta<typeof ActivityContext>
export default meta
export const Selected: StoryObj<typeof meta> = {}
export const First: StoryObj<typeof meta> = { args: { activity: activities[0] } }
export const UpcomingBlock: StoryObj<typeof meta> = { args: { activity: activities.at(-1)! } }
export const LastBlock: StoryObj<typeof meta> = { args: { snapshot: { ...snapshot, blocks: snapshot.blocks.slice(0, -1) }, activity: activities.at(-1)! } }
