import { expect, it } from 'vitest'
import fixture from '@/data/social-hub.fixture.json'
import { socialSchema } from '../schemas/social.schema'
import { conversationMessages } from './conversationMessages'

it('ordena cronologicamente e encontra a primeira mensagem recebida por ler', () => {
  const snapshot = { ...socialSchema.parse(fixture), currentUserId: 'ana' }
  snapshot.messages.reverse()
  const result = conversationMessages(snapshot, 'community')
  expect(result.messages[0].id).toBe('m1')
  expect(result.messages.at(-1)?.id).toBe('m7')
  expect(result.messages[result.firstUnread].id).toBe('m4')
  snapshot.read.ana = result.messages.map(message => message.id)
  expect(conversationMessages(snapshot, 'community').firstUnread).toBe(-1)
})
