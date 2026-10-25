import { expect, it } from 'vitest'
import fixture from '@/data/social-hub.fixture.json'
import { socialSchema } from '../schemas/social.schema'
import { unreadCounts } from './unreadCounts'

it('conta por canal e categoria sem incluir mensagens próprias ou convites não aceites', () => {
  const snapshot = { ...socialSchema.parse(fixture), currentUserId: 'ana' }
  expect(unreadCounts(snapshot)).toEqual({ channels: { community: 3, ideas: 2, 'dm-joao': 1 }, kinds: { public: 3, group: 2, direct: 1 }, total: 6 })
  snapshot.read.ana.push('m8', 'm9')
  expect(unreadCounts(snapshot)).toEqual({ channels: { community: 3, 'dm-joao': 1 }, kinds: { public: 3, group: 0, direct: 1 }, total: 4 })
})
