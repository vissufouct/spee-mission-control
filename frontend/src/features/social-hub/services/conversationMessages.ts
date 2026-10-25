import type { SocialSnapshot } from '../schemas/social.schema'

export function conversationMessages(snapshot: SocialSnapshot | undefined, channelId: string | undefined) {
  const messages = (snapshot?.messages.filter(message => message.channelId === channelId) ?? [])
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
  const read = new Set(snapshot?.read[snapshot.currentUserId] ?? [])
  const firstUnread = messages.findIndex(message => message.authorId !== snapshot?.currentUserId && !read.has(message.id))
  return { messages, firstUnread }
}
