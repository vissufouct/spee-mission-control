import type { Company, GeneralOrientationInput, OrientationInput, RequestReply, TeacherSnapshot } from '../types'

export interface TeacherRepository {
  receiveStudentMessage(companyId: string, activityId: string, author: string, message: string, revision: number): Promise<TeacherSnapshot>
  getSnapshot(): Promise<TeacherSnapshot>
  saveOrientation(input: OrientationInput, expectedRevision: number, id?: string): Promise<TeacherSnapshot>
  removeOrientation(id: string, expectedRevision: number): Promise<TeacherSnapshot>
  recordOrientation(id: string, expectedRevision: number): Promise<TeacherSnapshot>
  replyToOrientationRequest(id: string, input: RequestReply, expectedRevision: number): Promise<TeacherSnapshot>
  concludeOrientationRequest(id: string, expectedRevision: number): Promise<TeacherSnapshot>
  publishGeneralOrientation(input: GeneralOrientationInput, expectedRevision: number): Promise<TeacherSnapshot>
  reset(): Promise<TeacherSnapshot>
}
export type LinkedCompanyReader = () => Promise<Company | Company[]>
