/** Shared presentation rule for linked resources in both participant panels. */
export function resourceTitle(item: { title: string; resource?: string; links?: { url: string }[] }): string {
  const urls = item.links?.length ? item.links.map(link => link.url) : [item.resource]
  const realMarket = urls.some(value => {
    if (!value) return false
    try {
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol)
        && url.hostname !== 'speedev.simulacao.co.mz'
        && url.hostname !== 'spee.ac.mz' && !url.hostname.endsWith('.spee.ac.mz')
    } catch {
      return false
    }
  })
  const title = item.title.replace(/ \(Mercado Real\)$/, '')
  return realMarket ? `${title} (Mercado Real)` : title
}
