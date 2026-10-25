import type { z } from 'zod'
import type { activitySchema, activityStatusSchema, journeySnapshotSchema, registrationSchema } from '../schemas/journey.schema'
export type ActivityStatus = z.infer<typeof activityStatusSchema>
export type Activity = z.infer<typeof activitySchema>
export type LearningTask = NonNullable<Activity['tasks']>[number]
export type JourneySnapshot = z.infer<typeof journeySnapshotSchema>
export type RegistrationValues = z.infer<typeof registrationSchema>

