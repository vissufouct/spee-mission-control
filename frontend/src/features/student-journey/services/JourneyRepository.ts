import type { JourneySnapshot, RegistrationValues } from '../types'
export interface EvidenceFile { fileName: string; dataUrl: string }

/** Transport-independent contract. Every mutation returns the committed snapshot. */
export interface JourneyRepository {
  completeLearningTask(activityId: string, taskId: string, answers: Record<string, number> | undefined, expectedRevision: number, file?: EvidenceFile): Promise<JourneySnapshot>
  sendGroupMessage(activityId: string, message: string, assignee: string | null, revision: number): Promise<JourneySnapshot>
  completeTask(id: string, revision: number): Promise<JourneySnapshot>
  resolveNotification(id: string, revision: number): Promise<JourneySnapshot>
  getSnapshot(): Promise<JourneySnapshot>
  createRegistration(data: RegistrationValues, expectedRevision: number): Promise<JourneySnapshot>
  updateRegistration(data: RegistrationValues, expectedRevision: number): Promise<JourneySnapshot>
  removeRegistration(expectedRevision: number): Promise<JourneySnapshot>
  confirmRegistration(expectedRevision: number): Promise<JourneySnapshot>
  importSnapshot(json: string, expectedRevision: number): Promise<JourneySnapshot>
  exportSnapshot(): Promise<string>
  reset(): Promise<JourneySnapshot>
}
