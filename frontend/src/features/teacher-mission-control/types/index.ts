import type { z } from 'zod'
import type { activitySchema, companySchema, eventSchema, generalOrientationInputSchema, generalOrientationSchema, orientationInputSchema, orientationRequestSchema, orientationSchema, requestReplySchema, statusSchema, teacherSnapshotSchema } from '../schemas/teacher.schema'
export type TeacherSnapshot = z.infer<typeof teacherSnapshotSchema>
export type Company = z.infer<typeof companySchema>
export type TeacherActivity = z.infer<typeof activitySchema>
export type TeacherEvent = z.infer<typeof eventSchema>
export type TeacherStatus = z.infer<typeof statusSchema>
export type OrientationInput = z.infer<typeof orientationInputSchema>
export type Orientation = z.infer<typeof orientationSchema>
export type OrientationRequest = z.infer<typeof orientationRequestSchema>
export type RequestReply = z.infer<typeof requestReplySchema>
export type GeneralOrientationInput = z.infer<typeof generalOrientationInputSchema>
export type GeneralOrientation = z.infer<typeof generalOrientationSchema>
