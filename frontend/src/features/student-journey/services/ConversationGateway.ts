export interface TeacherMessage {
  id: string; activityId: string; author: string; message: string; createdAt: string; incoming: boolean
}
/** Only teacher-facing messages cross this boundary. Group messages never do. */
export interface ConversationGateway {
  read(): Promise<TeacherMessage[]>
  send(activityId: string, message: string): Promise<void>
}
