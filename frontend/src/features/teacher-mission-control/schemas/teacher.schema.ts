import { z } from 'zod'

export const statusSchema = z.enum(['completed', 'in-progress', 'available', 'not-started', 'blocked', 'returned', 'unavailable'])
export const participantSchema = z.object({ id: z.string().min(1), name: z.string().min(1), initials: z.string().min(1) })
export const activitySchema = z.object({
  id: z.string().min(1), title: z.string().min(1), blockId: z.string(), milestone: z.string(),
  status: statusSchema, participantIds: z.array(z.string()), dueDate: z.iso.date().nullable(),
  module: z.string(), nextStep: z.string(), resultIds: z.array(z.string()),
})
export const eventSchema = z.object({
  id: z.string().min(1), activityId: z.string(), occurredAt: z.iso.datetime(), actorIds: z.array(z.string()),
  role: z.enum(['student', 'system', 'teacher']), category: z.enum(['individual', 'collective', 'automatic']),
  message: z.string(), previousStatus: statusSchema.nullable(), newStatus: statusSchema,
  resultId: z.string().nullable(), confirmed: z.boolean(),
})
export const companySchema = z.object({
  id: z.string().min(1), name: z.string().min(1), classId: z.string(), routeId: z.string(),
  definitionVersion: z.string(), currentBlockId: z.string(),
  linkedToStudent: z.boolean(), participants: z.array(participantSchema),
  blocks: z.array(z.object({ id: z.string(), title: z.string() })).min(1),
  activities: z.array(activitySchema).min(1), events: z.array(eventSchema),
  results: z.array(z.object({
    id: z.string(), activityId: z.string(), title: z.string(), reference: z.string(),
    module: z.string(), description: z.string(), confirmedAt: z.iso.datetime(),
    fields: z.array(z.object({ label: z.string(), value: z.string() })),
  })),
})
export const orientationInputSchema = z.object({
  companyId: z.string().min(1), activityId: z.string().min(1),
  subject: z.string().trim().min(3, 'Indique um assunto.').max(100, 'Utilize até 100 caracteres.'),
  message: z.string().trim().min(10, 'Descreva a orientação com pelo menos 10 caracteres.').max(2000),
  reason: z.string().trim().min(10, 'Explique o motivo com pelo menos 10 caracteres.').max(1000),
})
export const orientationSchema = orientationInputSchema.extend({
  id: z.string(), status: z.enum(['draft', 'recorded']), author: z.string(),
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
})
export const teacherSnapshotSchema = z.object({
  schemaVersion: z.literal(1), revision: z.number().int().nonnegative(),
  context: z.object({ teacherName: z.string(), asOf: z.iso.datetime(), updatedAt: z.iso.datetime(), dueSoonDays: z.number().int().min(1).max(30) }),
  classes: z.array(z.object({ id: z.string(), name: z.string(), subject: z.string(), year: z.number() })).min(1),
  routes: z.array(z.object({ id: z.string(), name: z.string(), version: z.string() })).min(1),
  milestones: z.array(z.object({ id: z.string(), title: z.string() })).min(1),
  companies: z.array(companySchema), orientations: z.array(orientationSchema),
  audit: z.array(z.object({
    id: z.string(), orientationId: z.string(), companyId: z.string(), actor: z.string(),
    role: z.literal('teacher'), occurredAt: z.iso.datetime(), reason: z.string(),
    action: z.enum(['created', 'updated', 'removed', 'recorded']), previousState: z.string().nullable(), newState: z.string(),
  })),
}).superRefine((value, ctx) => {
  const unique = (ids: string[]) => new Set(ids).size === ids.length
  if (!unique(value.companies.map(c => c.id)) || !unique(value.orientations.map(o => o.id)))
    ctx.addIssue({ code: 'custom', message: 'Identificadores repetidos no cenário.' })
  for (const company of value.companies) {
    const activityIds = new Set(company.activities.map(a => a.id))
    const participantIds = new Set(company.participants.map(p => p.id))
    const resultIds = new Set(company.results.map(r => r.id))
    if (!value.classes.some(c => c.id === company.classId) || !value.routes.some(r => r.id === company.routeId) ||
        !company.blocks.some(b => b.id === company.currentBlockId) || !unique(company.activities.map(a => a.id)) ||
        !unique(company.events.map(e => e.id)) || !unique(company.results.map(r => r.id)) || !unique(company.participants.map(p => p.id)))
      ctx.addIssue({ code: 'custom', message: 'Referências ou identificadores inválidos na empresa.' })
    for (const activity of company.activities) {
      if (!company.blocks.some(b => b.id === activity.blockId) || !activity.participantIds.every(id => participantIds.has(id)) ||
          !activity.resultIds.every(id => resultIds.has(id)) || !value.milestones.some(m => m.id === activity.milestone))
        ctx.addIssue({ code: 'custom', message: 'Actividade com referências inválidas.' })
      if (activity.status === 'completed' && (!activity.resultIds.length || !company.events.some(e => e.activityId === activity.id && e.confirmed && e.newStatus === 'completed')))
        ctx.addIssue({ code: 'custom', message: 'Conclusão sem evento ou resultado confirmado.' })
    }
    for (const event of company.events)
      if (!activityIds.has(event.activityId) || !event.actorIds.every(id => participantIds.has(id)) || event.resultId && !resultIds.has(event.resultId))
        ctx.addIssue({ code: 'custom', message: 'Evento sem actividade, actor ou resultado válido.' })
    if (company.results.some(r => !activityIds.has(r.activityId)))
      ctx.addIssue({ code: 'custom', message: 'Resultado sem actividade válida.' })
  }
  for (const note of value.orientations)
    if (!value.companies.some(c => c.id === note.companyId && c.activities.some(a => a.id === note.activityId)))
      ctx.addIssue({ code: 'custom', message: 'Orientação fora do contexto da empresa.' })
})
