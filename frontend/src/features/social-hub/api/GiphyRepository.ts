import { z } from 'zod'
import { gifSchema } from '../schemas/social.schema'
import type { GifRepository } from '../services/GifRepository'
const responseSchema = z.object({ data: z.array(z.object({ id: z.string(), title: z.string(), images: z.object({ fixed_height: z.object({ url: z.string() }) }) })) })
export class GiphyRepository implements GifRepository {
  readonly configured: boolean
  constructor(private apiKey: string, private request: typeof fetch = (...args) => fetch(...args)) { this.configured = Boolean(apiKey.trim()) }
  async search(term: string, signal?: AbortSignal) {
    if (!this.configured) throw new Error('A pesquisa de GIFs ainda não está configurada.')
    const url = new URL(`https://api.giphy.com/v1/gifs/${term ? 'search' : 'trending'}`)
    url.search = new URLSearchParams({ api_key: this.apiKey, limit: '24', rating: 'g', ...(term ? { q: term, lang: 'pt' } : {}) }).toString()
    const response = await this.request(url, { signal, credentials: 'omit', referrerPolicy: 'no-referrer' })
    if (!response.ok) throw new Error(response.status === 429 ? 'Limite de pesquisa atingido. Tente novamente mais tarde.' : 'Não foi possível carregar os GIFs. Tente novamente.')
    return responseSchema.parse(await response.json()).data.map(item => gifSchema.parse({ id: item.id, title: item.title || 'GIF animado', url: item.images.fixed_height.url }))
  }
}
