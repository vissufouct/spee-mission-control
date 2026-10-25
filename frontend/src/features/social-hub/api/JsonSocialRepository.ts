import { groupInputSchema, messageInputSchema, socialSchema, type SocialSnapshot } from '../schemas/social.schema'
import type { SocialCommand, SocialRepository } from '../services/SocialRepository'
type Storage = { getItem(key: string): string | null; setItem(key: string, value: string): void }
const key = 'spee.social-hub.v1'
export class JsonSocialRepository implements SocialRepository {
  constructor(private seed: unknown, private storage: Storage, private userId = 'ana') {}
  private read() {
    try { const raw = this.storage.getItem(key); return socialSchema.parse(raw ? JSON.parse(raw) : structuredClone(this.seed)) }
    catch { throw new Error('Não foi possível ler o hub social. Os dados locais foram preservados.') }
  }
  private visible(state: ReturnType<typeof socialSchema.parse>): SocialSnapshot {
    const channels = state.channels.filter(c => c.kind === 'public' || c.members.includes(this.userId) || c.invited.includes(this.userId))
    const allowed = new Set(channels.filter(c => c.kind === 'public' || c.members.includes(this.userId)).map(c => c.id))
    return { ...state, currentUserId: this.userId, channels, messages: state.messages.filter(m => allowed.has(m.channelId)), read: { [this.userId]: state.read[this.userId] ?? [] } }
  }
  async getSnapshot() { return this.visible(this.read()) }
  async execute(command: SocialCommand, revision: number) {
    const state = this.read()
    if (revision !== state.revision) throw new Error('O hub foi actualizado noutra vista. Actualize e tente novamente.')
    const accessible = (id: string) => {
      const channel = state.channels.find(c => c.id === id)
      if (!channel || (channel.kind !== 'public' && !channel.members.includes(this.userId))) throw new Error('Sem acesso a esta conversa.')
      return channel
    }
    if (command.type === 'post') {
      accessible(command.channelId)
      if (command.replyTo && !state.messages.some(m => m.id === command.replyTo && m.channelId === command.channelId)) throw new Error('A mensagem a responder não pertence à conversa.')
      const input = messageInputSchema.parse({ text: command.text, gif: command.gif })
      state.messages.push({ id: crypto.randomUUID(), channelId: command.channelId, authorId: this.userId, ...input, createdAt: new Date().toISOString(), replyTo: command.replyTo, reactions: {} })
    } else if (command.type === 'react') {
      const message = state.messages.find(m => m.id === command.messageId)
      if (!message) throw new Error('Mensagem inexistente.')
      accessible(message.channelId)
      if (!['👍', '❤️', '🎉', '💡'].includes(command.emoji)) throw new Error('Reacção inválida.')
      const people = message.reactions[command.emoji] ?? []
      message.reactions[command.emoji] = people.includes(this.userId) ? people.filter(id => id !== this.userId) : [...people, this.userId]
    } else if (command.type === 'group') {
      const input = groupInputSchema.parse(command)
      const invited = [...new Set(input.invitees)].filter(id => id !== this.userId)
      if (!invited.length || invited.some(id => !state.members.some(m => m.id === id))) throw new Error('Seleccione participantes válidos.')
      state.channels.push({ id: crypto.randomUUID(), kind: 'group', name: input.name, members: [this.userId], invited })
    } else if (command.type === 'invitation') {
      const channel = state.channels.find(c => c.id === command.channelId && c.kind === 'group' && c.invited.includes(this.userId))
      if (!channel) throw new Error('Este convite não lhe é dirigido.')
      channel.invited = channel.invited.filter(id => id !== this.userId)
      if (command.accept) channel.members.push(this.userId)
    } else if (command.type === 'direct') {
      if (command.memberId === this.userId || !state.members.some(m => m.id === command.memberId)) throw new Error('Seleccione outro participante.')
      if (!state.channels.some(c => c.kind === 'direct' && c.members.includes(this.userId) && c.members.includes(command.memberId))) state.channels.push({ id: crypto.randomUUID(), kind: 'direct', name: 'Mensagem privada', members: [this.userId, command.memberId], invited: [] })
    } else {
      accessible(command.channelId)
      state.read[this.userId] = [...new Set([...(state.read[this.userId] ?? []), ...state.messages.filter(m => m.channelId === command.channelId).map(m => m.id)])]
    }
    state.revision++
    try { this.storage.setItem(key, JSON.stringify(socialSchema.parse(state))) }
    catch { throw new Error('Não foi possível guardar. Nenhuma alteração foi confirmada.') }
    return this.visible(state)
  }
}
