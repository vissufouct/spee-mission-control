import { CheckCircle2, Circle, Clock3, LockKeyhole } from 'lucide-react'
import { statusLabels } from '../services/teacher.selectors'
import type { TeacherStatus } from '../types'
const icons = { completed: CheckCircle2, 'in-progress': Clock3, 'not-started': Circle, blocked: LockKeyhole }
export function TeacherStatusBadge({ status }: { status: TeacherStatus }) {
  const Icon = icons[status]
  return <span className={'teacher-status teacher-status--' + status}><Icon size={19} aria-hidden /><span>{statusLabels[status]}</span></span>
}
