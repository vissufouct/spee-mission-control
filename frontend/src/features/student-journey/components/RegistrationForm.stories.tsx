import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { RegistrationForm } from './RegistrationForm'
const snapshot = journeySnapshotSchema.parse(fixture)
const meta = {
  title: 'Estudante/Formulário de registo',
  component: RegistrationForm,
  args: { initialValues: snapshot.registration!.data, pending: false, canRemove: true, onSave: async () => true, onReview: async () => true, onRemove: () => {}, onDirty: () => {} },
} satisfies Meta<typeof RegistrationForm>
export default meta
type Story = StoryObj<typeof meta>
export const WithData: Story = {}
export const Empty: Story = { args: { initialValues: undefined, canRemove: false } }
export const Disabled: Story = { args: { pending: true } }
