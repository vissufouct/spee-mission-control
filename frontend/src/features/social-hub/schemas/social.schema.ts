import { z } from 'zod'

export const gifSchema = z.object({ id: z.string().min(1), title: z.string().max(300), url: z.url().refine(value => { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && (url.hostname === 'media.giphy.com' || /^media\d+\.giphy\.com$/.test(url.hostname)) }, 'Endereço de GIF inválido.') })
export type SocialGif = z.infer<typeof gifSchema>
export const messageInputSchema = z.object({ text: z.string().trim().max(2000, 'Máximo de 2000 caracteres.'), gif: gifSchema.optional() }).refine(value => Boolean(value.text || value.gif), { message: 'Escreva uma mensagem ou escolha um GIF.', path: ['text'] })
export const groupInputSchema = z.object({ name: z.string().trim().min(3, 'Indique um nome com pelo menos 3 caracteres.').max(60), invitees: z.array(z.string()).min(1, 'Seleccione pelo menos um participante.') })
export const socialSchema = z.object({
  version: z.literal(1), revision: z.number().int().nonnegative(),
  members: z.array(z.object({ id: z.string(), name: z.string(), className: z.string(), company: z.object({ id: z.string().min(1), name: z.string().min(1) }).optional() })),
  channels: z.array(z.object({ id: z.string(), kind: z.enum(['public', 'group', 'direct']), name: z.string(), members: z.array(z.string()), invited: z.array(z.string()) })),
  messages: z.array(z.object({ id: z.string(), channelId: z.string(), authorId: z.string(), text: z.string(), gif: gifSchema.optional(), createdAt: z.iso.datetime(), replyTo: z.string().nullable(), reactions: z.record(z.string(), z.array(z.string())) })),
  read: z.record(z.string(), z.array(z.string())),
})
export type SocialSnapshot = z.infer<typeof socialSchema> & { currentUserId: string }
export type SocialMessage = SocialSnapshot['messages'][number]
export type SocialChannel = SocialSnapshot['channels'][number]
