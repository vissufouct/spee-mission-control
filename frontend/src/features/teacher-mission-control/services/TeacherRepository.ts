import type { Company, OrientationInput, TeacherSnapshot } from '../types'

export interface TeacherRepository {
  getSnapshot(): Promise<TeacherSnapshot>
  saveOrientation(input: OrientationInput, expectedRevision: number, id?: string): Promise<TeacherSnapshot>
  removeOrientation(id: string, expectedRevision: number): Promise<TeacherSnapshot>
  recordOrientation(id: string, expectedRevision: number): Promise<TeacherSnapshot>
  reset(): Promise<TeacherSnapshot>
}
export type LinkedCompanyReader = () => Promise<Company>
