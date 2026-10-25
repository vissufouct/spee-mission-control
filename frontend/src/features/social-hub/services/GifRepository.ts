import type { SocialGif } from '../schemas/social.schema'
export interface GifRepository {
  readonly configured: boolean
  search(term: string, signal?: AbortSignal): Promise<SocialGif[]>
}
