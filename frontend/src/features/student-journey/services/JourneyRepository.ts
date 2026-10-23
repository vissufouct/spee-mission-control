import type { JourneySnapshot, RegistrationValues } from '../types'

/** Transport-independent contract. Every mutation returns the committed snapshot. */
export interface JourneyRepository {
  getSnapshot(): Promise<JourneySnapshot>
  createRegistration(data: RegistrationValues, expectedRevision: number): Promise<JourneySnapshot>
  updateRegistration(data: RegistrationValues, expectedRevision: number): Promise<JourneySnapshot>
  removeRegistration(expectedRevision: number): Promise<JourneySnapshot>
  confirmRegistration(expectedRevision: number): Promise<JourneySnapshot>
  importSnapshot(json: string, expectedRevision: number): Promise<JourneySnapshot>
  exportSnapshot(): Promise<string>
  reset(): Promise<JourneySnapshot>
}

