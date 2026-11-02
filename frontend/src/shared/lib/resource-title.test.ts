import { describe, expect, it } from 'vitest'
import { resourceTitle } from './resource-title'

describe('resourceTitle', () => {
  it('identifies real market URLs and mixed destinations', () => {
    expect(resourceTitle({ title: 'Regras', resource: 'https://www.bci.co.mz/' })).toBe('Regras (Mercado Real)')
    expect(resourceTitle({ title: 'Regras', links: [{ url: 'https://app.spee.ac.mz/' }, { url: 'https://www.inss.gov.mz/' }] })).toBe('Regras (Mercado Real)')
    expect(resourceTitle({ title: 'Regras', resource: 'https://spee.ac.mz.example.org/' })).toBe('Regras (Mercado Real)')
  })
  it('excludes simulator domains and local resources', () => {
    for (const resource of ['https://spee.ac.mz/', 'https://app.spee.ac.mz/', 'https://speedev.simulacao.co.mz/paginasverdes/', 'apoio/guia.pdf', undefined]) {
      expect(resourceTitle({ title: 'Regras', resource })).toBe('Regras')
    }
  })
  it('uses effective links and avoids duplicate suffixes', () => {
    expect(resourceTitle({ title: 'Regras (Mercado Real)', resource: 'https://www.bci.co.mz/' })).toBe('Regras (Mercado Real)')
    expect(resourceTitle({ title: 'Regras', resource: 'https://www.bci.co.mz/', links: [{ url: 'https://app.spee.ac.mz/' }] })).toBe('Regras')
  })
})
