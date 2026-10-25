import type { SocialSnapshot } from '../schemas/social.schema'

export function unreadCounts(snapshot?: SocialSnapshot) {
  const channels: Record<string, number> = {}
  const kinds = { public: 0, group: 0, direct: 0 }
  if (snapshot) {
    const read = new Set(snapshot.read[snapshot.currentUserId] ?? [])
    const visible = new Map(snapshot.channels.filter(c => c.kind === 'public' || c.members.includes(snapshot.currentUserId)).map(c => [c.id, c.kind]))
    for (const message of snapshot.messages) {
      const kind = visible.get(message.channelId)
      if (!kind || message.authorId === snapshot.currentUserId || read.has(message.id)) continue
      channels[message.channelId] = (channels[message.channelId] ?? 0) + 1
      kinds[kind]++
    }
  }
  return { channels, kinds, total: kinds.public + kinds.group + kinds.direct }
}
