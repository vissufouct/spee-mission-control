import type { SocialMessage, SocialSnapshot } from '../schemas/social.schema'
export function SocialMessageCard({ message, snapshot, disabled, onReply, onReact }: { message: SocialMessage; snapshot: SocialSnapshot; disabled: boolean; onReply: () => void; onReact: (emoji: string) => void }) {
  const author = snapshot.members.find(m => m.id === message.authorId)
  const parent = snapshot.messages.find(m => m.id === message.replyTo)
  return <article className={`social-message${message.authorId === snapshot.currentUserId ? ' social-message--own' : ''}`}>
    <header><span className="social-avatar" aria-hidden>{author?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span><div><strong>{author?.name ?? 'Participante'}</strong><span>{author?.className}</span></div><time dateTime={message.createdAt}>{new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Maputo' }).format(new Date(message.createdAt))}</time></header>
    {parent && <blockquote>Em resposta a {snapshot.members.find(m => m.id === parent.authorId)?.name}: {parent.text || parent.gif?.title || 'GIF'}</blockquote>}
    <p>{message.text}</p>
    {message.gif && <figure className="social-message-gif"><img src={message.gif.url} alt={message.gif.title} loading="lazy" /><figcaption>GIF · GIPHY</figcaption></figure>}
    <footer><button disabled={disabled} onClick={onReply}>Responder</button><div aria-label="Reacções">{['👍', '❤️', '🎉', '💡'].map(emoji => <button key={emoji} disabled={disabled} aria-label={`Reagir ${emoji} à mensagem de ${author?.name}`} aria-pressed={message.reactions[emoji]?.includes(snapshot.currentUserId) ?? false} onClick={() => onReact(emoji)}>{emoji} <span>{message.reactions[emoji]?.length || ''}</span></button>)}</div></footer>
  </article>
}
