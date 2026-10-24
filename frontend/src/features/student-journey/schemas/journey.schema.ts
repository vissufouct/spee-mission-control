import { z } from 'zod'

export const activityStatusSchema = z.enum(['completed', 'in-progress', 'available', 'blocked', 'unavailable', 'not-started', 'returned'])
export const registrationSchema = z.object({
  legalName: z.string().trim().min(3, 'Indique a denominação da empresa.').max(120),
  taxId: z.string().regex(/^\d{9}$/, 'O NUIT deve ter exactamente 9 algarismos.'),
  sector: z.string().trim().min(5, 'Descreva a actividade económica.').max(160),
  province: z.enum(['Maputo', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado']),
  address: z.string().trim().min(5, 'Indique a morada da empresa.').max(200),
  email: z.email('Indique um endereço de correio electrónico válido.'),
  capital: z.number().finite().positive('O capital social deve ser superior a zero.').max(1_000_000_000),
})
export const draftSchema = registrationSchema.extend({
  legalName: z.string().max(120), taxId: z.string().max(20), sector: z.string().max(160),
  address: z.string().max(200), email: z.string().max(200), capital: z.number().finite().min(0).max(1_000_000_000),
})
export const activitySchema = z.object({
  id: z.string().min(1), title: z.string().min(1), description: z.string(),
  status: activityStatusSchema, reason: z.string().optional(),
  definitionOfDone: z.string().optional(),
})
export const journeySnapshotSchema = z.object({
  members: z.array(z.string().min(1)).default(['Ana Machava', 'João Tembe', 'António Sitoe']),
  groupMessages: z.array(z.object({
    id: z.string(), activityId: z.string(), author: z.string(), message: z.string().min(1),
    createdAt: z.iso.datetime(), assignee: z.string().nullable(), doneAt: z.iso.datetime().nullable(),
  })).default([]),
  resolvedNotifications: z.array(z.object({ id: z.string(), recipient: z.string() })).default([]),
  schemaVersion: z.literal(1),
  revision: z.number().int().nonnegative(),
  context: z.object({
    studentName: z.string().min(1), studentEmail: z.email(), className: z.string().min(1),
    routeName: z.string().min(1), currentBlockId: z.string(),
  }),
  blocks: z.array(z.object({
    id: z.string().min(1), title: z.string().min(1), description: z.string(),
    state: activityStatusSchema, activities: z.array(activitySchema),
  })).min(1),
  registration: z.object({
    id: z.string(), status: z.enum(['draft', 'confirmed']), data: draftSchema,
    updatedAt: z.iso.datetime(), receiptNumber: z.string().nullable(),
  }).nullable(),
  events: z.array(z.object({
    id: z.string(), type: z.string(), message: z.string(), actor: z.string(), occurredAt: z.iso.datetime(),
  })),
}).superRefine((value, ctx) => {
  const ids = value.blocks.flatMap(block => block.activities.map(activity => activity.id))
  if (new Set(value.groupMessages.map(m => m.id)).size !== value.groupMessages.length || value.groupMessages.some(m => !ids.includes(m.activityId) || !value.members.includes(m.author) || (m.assignee !== null && !value.members.includes(m.assignee)) || (m.doneAt !== null && m.assignee === null)))
    ctx.addIssue({ code: 'custom', message: 'Conversa ou tarefa fora do contexto da empresa.' })
  if (new Set(ids).size !== ids.length || new Set(value.blocks.map(block => block.id)).size !== value.blocks.length)
    ctx.addIssue({ code: 'custom', message: 'Os identificadores do percurso devem ser únicos.' })
  if (!value.blocks.some(block => block.id === value.context.currentBlockId))
    ctx.addIssue({ code: 'custom', message: 'O bloco actual não existe.' })
  if (!ids.includes('registar-empresa'))
    ctx.addIssue({ code: 'custom', message: 'O cenário deve incluir a actividade de registo.' })
  if (value.registration?.status === 'confirmed' && !value.registration.receiptNumber)
    ctx.addIssue({ code: 'custom', message: 'Um registo confirmado exige comprovativo.' })
  if (value.registration?.status === 'confirmed' && !registrationSchema.safeParse(value.registration.data).success)
    ctx.addIssue({ code: 'custom', message: 'Os dados de um registo confirmado devem estar completos e válidos.' })
})
