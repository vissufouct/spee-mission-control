import { expect, it, vi } from 'vitest'
import { GiphyRepository } from './GiphyRepository'
it('não faz pedidos sem chave e valida resultados externos', async () => {
  const request = vi.fn<typeof fetch>()
  await expect(new GiphyRepository('', request).search('')).rejects.toThrow('configurada')
  expect(request).not.toHaveBeenCalled()
  request.mockResolvedValue(new Response(JSON.stringify({ data: [{ id: 'abc', title: 'Olá', images: { fixed_height: { url: 'https://media.giphy.com/media/abc/giphy.gif' } } }] })))
  const repository = new GiphyRepository('test-only', request)
  expect(await repository.search('olá & obrigado')).toEqual([{ id: 'abc', title: 'Olá', url: 'https://media.giphy.com/media/abc/giphy.gif' }])
  const url = request.mock.calls[0][0] as URL
  expect(url.searchParams.get('q')).toBe('olá & obrigado')
  expect(url.searchParams.get('rating')).toBe('g')
  expect(url.pathname).toBe('/v1/gifs/search')
  request.mockResolvedValue(new Response('', { status: 429 }))
  await expect(repository.search('')).rejects.toThrow('Limite')
})
