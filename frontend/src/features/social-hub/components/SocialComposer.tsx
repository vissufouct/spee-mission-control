import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageInputSchema, type SocialGif } from '../schemas/social.schema'
import { EmojiPicker } from './EmojiPicker'
import { GifPicker } from './GifPicker'
export function SocialComposer({ pending, replyName, onCancelReply, onSend }: { pending: boolean; replyName?: string; onCancelReply: () => void; onSend: (text: string, gif?: SocialGif) => Promise<void> }) {
  const [picker, setPicker] = useState<'emoji' | 'gif' | null>(null)
  const form = useForm<{ text: string; gif?: SocialGif }>({ resolver: zodResolver(messageInputSchema), defaultValues: { text: '' } })
  const gif = useWatch({ control: form.control, name: 'gif' })
  const toggle = (value: 'emoji' | 'gif') => setPicker(picker === value ? null : value)
  return <form className="social-composer" onSubmit={form.handleSubmit(async values => { try { await onSend(values.text, values.gif); form.reset(); setPicker(null) } catch { /* Parent retains the error and draft. */ } })}>
    {replyName && <div className="social-reply">A responder a {replyName}<button type="button" onClick={onCancelReply}>Cancelar resposta</button></div>}
    {picker && <div className="social-picker-popover" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setPicker(null) } }}><button className="social-picker-close" type="button" aria-label="Fechar selector" onClick={() => setPicker(null)}>×</button>{picker === 'emoji' ? <EmojiPicker onSelect={emoji => { const input = document.getElementById('social-message') as HTMLTextAreaElement | null; const text = form.getValues('text'); const start = input?.selectionStart ?? text.length; const end = input?.selectionEnd ?? start; if (text.length - (end - start) + emoji.length <= 2000) { form.setValue('text', text.slice(0, start) + emoji + text.slice(end), { shouldDirty: true, shouldValidate: true }); form.setFocus('text'); requestAnimationFrame(() => input?.setSelectionRange(start + emoji.length, start + emoji.length)) } }} /> : <GifPicker onSelect={selected => { form.setValue('gif', selected, { shouldDirty: true, shouldValidate: true }); setPicker(null); form.setFocus('text') }} />}</div>}
    {gif && <div className="social-gif-preview"><img src={gif.url} alt={gif.title} /><button type="button" disabled={pending} onClick={() => form.setValue('gif', undefined)}>Remover GIF</button></div>}
    <label className="sr-only" htmlFor="social-message">Mensagem</label><textarea id="social-message" placeholder="Partilhe uma ideia ou escreva uma mensagem…" maxLength={2000} rows={2} disabled={pending} {...form.register('text')} />
    {form.formState.errors.text && <p role="alert">{form.formState.errors.text.message}</p>}
    <div className="social-compose-actions"><div className="social-media-actions"><button type="button" disabled={pending} aria-expanded={picker === 'emoji'} onClick={() => toggle('emoji')}>😊 Emojis</button><button type="button" disabled={pending} aria-expanded={picker === 'gif'} onClick={() => toggle('gif')}>GIFs</button></div><button className="social-send" disabled={pending}>{pending ? 'A enviar…' : 'Publicar mensagem'}</button></div>
  </form>
}
