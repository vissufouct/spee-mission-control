import { useState } from 'react'
import { useSocialGifs } from '../hooks/SocialProvider'
import type { SocialGif } from '../schemas/social.schema'
export function GifPicker({ onSelect }: { onSelect: (gif: SocialGif) => void }) {
  const [input, setInput] = useState('')
  const [term, setTerm] = useState('')
  const { configured, query } = useSocialGifs(term)
  return <section className="social-media-picker" aria-label="Escolher GIF">
    <div className="social-gif-search"><input aria-label="Pesquisar GIFs" placeholder="Pesquisar GIFs…" maxLength={50} disabled={!configured} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); setTerm(input.trim()) } }} /><button type="button" disabled={!configured} onClick={() => setTerm(input.trim())}>Pesquisar</button></div>
    {!configured ? <p role="status">A pesquisa de GIFs aguarda a configuração do GIPHY.</p> : query.isPending ? <p role="status">A carregar GIFs…</p> : query.isError ? <div role="alert">Não foi possível carregar os GIFs. <button type="button" onClick={() => { void query.refetch() }}>Tentar novamente</button></div> : <>
      <p className="social-picker-caption">{term ? `Resultados para «${term}»` : 'Em destaque'}</p>
      <div className="social-gif-grid">{query.data?.map(gif => <button type="button" key={gif.id} aria-label={`Seleccionar GIF: ${gif.title}`} onClick={() => onSelect(gif)}><img src={gif.url} alt={gif.title} loading="lazy" /></button>)}</div>
      {query.data?.length === 0 && <p role="status">Nenhum GIF encontrado. Experimente outra pesquisa.</p>}
    </>}
    <a className="social-giphy-attribution" href="https://giphy.com/" target="_blank" rel="noreferrer">Powered By GIPHY</a>
  </section>
}
