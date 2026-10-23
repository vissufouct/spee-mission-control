import type { Meta, StoryObj } from '@storybook/react-vite'
import fixture from '@/data/teacher-mission-control.fixture.json'
import { teacherSnapshotSchema } from '../schemas/teacher.schema'
import { OrientationForm } from './OrientationForm'
import '../styles.css'
const company = teacherSnapshotSchema.parse(fixture).companies[0]
const meta = {
  title: 'Docente/Orientação', component: OrientationForm,
  args: { company, pending: false, onSave: () => {}, onCancel: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OrientationForm>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Disabled: Story = { args: { pending: true } }
export const Error: Story = { args: { error: 'Não foi possível guardar neste browser. Nenhuma alteração foi confirmada.' } }
