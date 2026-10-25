import type { SocialSnapshot, SocialGif } from '../schemas/social.schema'
export type SocialCommand =
  | { type: 'post'; channelId: string; text: string; gif?: SocialGif; replyTo: string | null }
  | { type: 'react'; messageId: string; emoji: string }
  | { type: 'group'; name: string; invitees: string[] }
  | { type: 'invitation'; channelId: string; accept: boolean }
  | { type: 'direct'; memberId: string }
  | { type: 'read'; channelId: string }
export interface SocialRepository {
  getSnapshot(): Promise<SocialSnapshot>
  execute(command: SocialCommand, revision: number): Promise<SocialSnapshot>
}
