import { describe, expect, it } from 'vitest'
import fixture from '@/data/social-hub.fixture.json'
import { JsonSocialRepository } from './JsonSocialRepository'

function setup() {
  const data = new Map<string, string>()
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value) } }
  return { storage, ana: new JsonSocialRepository(fixture, storage), joao: new JsonSocialRepository(fixture, storage, 'joao'), paulo: new JsonSocialRepository(fixture, storage, 'paulo') }
}
describe('hub social', () => {
  it('guarda mensagens, respostas, reacções e leitura sem alterar o fixture', async () => {
    const { ana, storage } = setup()
    let state = await ana.execute({ type: 'post', channelId: 'community', text: 'Uma ideia nova 😊', replyTo: 'm1' }, 0)
    const message = state.messages.at(-1)!
    expect(message).toMatchObject({ authorId: 'ana', replyTo: 'm1', text: 'Uma ideia nova 😊' })
    state = await ana.execute({ type: 'react', messageId: message.id, emoji: '💡' }, state.revision)
    expect(state.messages.at(-1)?.reactions['💡']).toEqual(['ana'])
    state = await ana.execute({ type: 'read', channelId: 'community' }, state.revision)
    expect(state.read.ana).toContain(message.id)
    expect((await new JsonSocialRepository(fixture, storage).getSnapshot()).revision).toBe(state.revision)
    expect(fixture.messages).toHaveLength(11)
  })
  it('só o convidado aceita e só depois vê o conteúdo do grupo', async () => {
    const { ana, joao } = setup()
    let state = await ana.execute({ type: 'group', name: 'Estudo conjunto', invitees: ['joao'] }, 0)
    const group = state.channels.at(-1)!
    state = await ana.execute({ type: 'post', channelId: group.id, text: 'Bem-vindos!', replyTo: null }, state.revision)
    expect((await joao.getSnapshot()).messages.some(m => m.channelId === group.id)).toBe(false)
    await expect(joao.execute({ type: 'post', channelId: group.id, text: 'Olá', replyTo: null }, state.revision)).rejects.toThrow('Sem acesso')
    await expect(ana.execute({ type: 'invitation', channelId: group.id, accept: true }, state.revision)).rejects.toThrow('dirigido')
    const accepted = await joao.execute({ type: 'invitation', channelId: group.id, accept: true }, state.revision)
    expect(accepted.messages.some(m => m.channelId === group.id)).toBe(true)
    expect(accepted.channels.find(c => c.id === group.id)?.members).toContain('joao')
  })
  it('protege mensagens privadas e recusa respostas entre canais', async () => {
    const { ana, paulo } = setup()
    expect((await paulo.getSnapshot()).messages.some(m => m.channelId === 'dm-joao')).toBe(false)
    await expect(paulo.execute({ type: 'react', messageId: 'm10', emoji: '👍' }, 0)).rejects.toThrow('Sem acesso')
    await expect(ana.execute({ type: 'post', channelId: 'community', text: 'Olá', replyTo: 'm10' }, 0)).rejects.toThrow('não pertence')
    const first = await ana.execute({ type: 'direct', memberId: 'leila' }, 0)
    const second = await ana.execute({ type: 'direct', memberId: 'leila' }, first.revision)
    expect(second.channels.filter(c => c.kind === 'direct' && c.members.includes('leila'))).toHaveLength(1)
  })
  it('recusa revisões antigas e não confirma falhas de escrita', async () => {
    const { ana, storage } = setup()
    await ana.execute({ type: 'read', channelId: 'community' }, 0)
    await expect(ana.execute({ type: 'post', channelId: 'community', text: 'Olá', replyTo: null }, 0)).rejects.toThrow('noutra vista')
    const failing = new JsonSocialRepository(fixture, { ...storage, setItem: () => { throw Error('quota') } })
    await expect(failing.execute({ type: 'post', channelId: 'community', text: 'Não guardar', replyTo: null }, 1)).rejects.toThrow('Nenhuma alteração')
    expect((await ana.getSnapshot()).messages.some(m => m.text === 'Não guardar')).toBe(false)
  })
})

it('persiste um GIF sem texto, mantém compatibilidade e recusa URLs não autorizados', async () => {
  const { ana, storage } = setup()
  const gif = { id: 'example', title: 'Celebração', url: 'https://media.giphy.com/media/example/giphy.gif' }
  await ana.execute({ type: 'post', channelId: 'community', text: '', gif, replyTo: 'm1' }, 0)
  const reloaded = await new JsonSocialRepository(fixture, storage).getSnapshot()
  expect(reloaded.messages.at(-1)?.gif).toEqual(gif)
  expect(reloaded.messages.at(-1)?.replyTo).toBe('m1')
  await expect(ana.execute({ type: 'post', channelId: 'community', text: '', replyTo: null }, 1)).rejects.toThrow()
  await expect(ana.execute({ type: 'post', channelId: 'community', text: '', gif: { ...gif, url: 'https://untrusted.example/image.gif' }, replyTo: null }, 1)).rejects.toThrow()
  expect((await ana.getSnapshot()).revision).toBe(1)
})
