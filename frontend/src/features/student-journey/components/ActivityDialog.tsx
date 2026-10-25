import { Dialog } from '@/shared/components/ui/dialog'
import type { ReactNode } from 'react'
import { ActivityContext } from './ActivityContext'
import { ActivityTasks } from './ActivityTasks'
import { SupportMaterials } from './SupportMaterials'
import { getLearningTasks } from '../services/learning-tasks'
import type { Activity, JourneySnapshot, LearningTask } from '../types'

function DetailContainer({ embedded, title, description, onClose, children }: { embedded: boolean; title: string; description: string; onClose: () => void; children: ReactNode }) {
  return embedded ? <section className="spee-panel student-activity-detail p-5">{children}</section> : <Dialog className="student-activity-detail" open onOpenChange={open => { if (!open) onClose() }} title={title} description={description}>{children}</Dialog>
}
export function ActivityDialog({ activity, snapshot, onClose, onContinue, onTask, onActivity, embedded = false }: { activity: Activity | null; snapshot: JourneySnapshot; onClose: () => void; onContinue: () => void; onTask?: (task: LearningTask) => void; onActivity?: (id: string) => void; embedded?: boolean }) {
  if (!activity) return null
  return <DetailContainer embedded={embedded} onClose={onClose} title={activity.title} description={activity.description}>
    <ActivityContext activity={activity} snapshot={snapshot} onActivity={onActivity} />
    <ActivityTasks tasks={getLearningTasks(activity, snapshot)} onOpen={onTask ?? (task => { if (activity.id === 'registar-empresa' && task.kind === 'operation') onContinue() })} />
    <p className="student-progress-note mt-3">A actividade fica concluída quando todas as tarefas obrigatórias têm conclusão confirmada.</p>
    <SupportMaterials materials={activity.materials ?? []} />
  </DetailContainer>
}
