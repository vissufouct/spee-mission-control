import { useState } from 'react'
import { emojiCatalog, normaliseEmojiSearch } from '../services/emojiCatalog'
export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [category, setCategory] = useState('Rostos')
  const [search, setSearch] = useState('')
  const groups = search ? emojiCatalog : emojiCatalog.filter(group => group.name === category)
  const matches = groups.flatMap(group => group.emojis.filter(item => !search || normaliseEmojiSearch(`${item.label} ${item.emoji} ${group.name}`).includes(normaliseEmojiSearch(search))))
  return <section className="social-media-picker" aria-label="Escolher emoji">
    <input onKeyDown={event => { if (event.key === 'Enter') event.preventDefault() }} aria-label="Pesquisar emojis" placeholder="Pesquisar emojis…" value={search} onChange={event => setSearch(event.target.value)} />
    <div className="social-emoji-categories" aria-label="Categorias de emojis">{emojiCatalog.map(group => <button key={group.name} type="button" title={group.name} aria-label={group.name} aria-pressed={category === group.name && !search} onClick={() => { setCategory(group.name); setSearch('') }}>{group.emojis[0].emoji}</button>)}</div>
    <p className="social-picker-caption">{search ? 'Resultados' : category} · {matches.length}</p>
    <div className="social-emoji-grid">{matches.map((item, index) => <button type="button" key={`${item.emoji}-${index}`} title={item.label} aria-label={`${item.emoji} ${item.label}`} onClick={() => onSelect(item.emoji)}>{item.emoji}</button>)}</div>
    {!matches.length && <p role="status">Nenhum emoji encontrado.</p>}
  </section>
}
