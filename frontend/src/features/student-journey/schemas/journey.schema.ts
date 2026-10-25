import { z } from 'zod'
const resourceSchema = z.string().regex(/^(https:\/\/[^\s]+|apoio\/[a-z0-9-]+\.(html|pdf|mp4|png|jpg|webp|xlsx|docx))$/)
export const evidenceFileSchema = z.object({
  fileName: z.string().min(1).max(180).regex(/\.(pdf|docx|xlsx)$/i),
  dataUrl: z.string().max(2_800_000).regex(/^data:(application\/pdf|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet));base64,[A-Za-z0-9+/=]+$/),
})

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
export const supportMaterialSchema = z.object({
  title: z.string().min(1), description: z.string(),
  format: z.enum(['pdf', 'excel', 'word', 'video', 'url']),
  href: resourceSchema.optional(),
})
export const learningTaskSchema = z.object({
  id: z.string().min(1), title: z.string().min(1),
  kind: z.enum(['operation', 'quiz', 'video', 'pdf', 'url', 'evidence']),
  status: z.enum(['completed', 'in-progress', 'not-started', 'blocked']),
  description: z.string(), required: z.boolean().default(true),
  resource: resourceSchema.optional(),
  cover: z.string().regex(/^apoio\/[a-z0-9-]+\.(png|jpg|webp)$/).optional(),
  preview: z.string().regex(/^apoio\/[a-z0-9-]+\.(png|jpg|webp)$/).optional(),
  dependsOn: z.array(z.string()).optional(),
  passPercent: z.number().min(0).max(100).optional(),
  accepts: z.array(z.enum(['pdf', 'docx', 'xlsx'])).optional(),
  questions: z.array(z.object({ id: z.string(), prompt: z.string(), options: z.array(z.string()).min(2), correct: z.number().int().nonnegative() })).optional(),
  answers: z.record(z.string(), z.number().int().nonnegative()).optional(),
  quizMode: z.enum(['mastery', 'diagnostic']).optional(),
  submission: z.object({ fileName: z.string().min(1), submittedBy: z.string().min(1), submittedAt: z.iso.datetime(), file: evidenceFileSchema.optional() }).optional(),
  completedAt: z.iso.datetime().optional(),
  simulatedParticipants: z.array(z.object({ name: z.string().min(1), contribution: z.string().min(1) })).optional(),
})
export const activitySchema = z.object({
  id: z.string().min(1), title: z.string().min(1), description: z.string(),
  status: activityStatusSchema, reason: z.string().optional(),
  definitionOfDone: z.string().optional(),
  steps: z.array(z.string().min(1)).optional(),
  tasks: z.array(learningTaskSchema).optional(),
  previousIds: z.array(z.string()).optional(), nextIds: z.array(z.string()).optional(),
  materials: z.array(supportMaterialSchema).optional(),
  simulatedParticipants: z.array(z.object({ name: z.string().min(1), contribution: z.string().min(1) })).optional(),
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
    roadmapVersion: z.string().optional(), companyName: z.string().optional(), example: z.enum(['1', '2']).optional(),
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
    activityId: z.string().optional(), activityStatus: activityStatusSchema.optional(),
  })),
}).superRefine((value, ctx) => {
  const ids = value.blocks.flatMap(block => block.activities.map(activity => activity.id))
  for (const activity of value.blocks.flatMap(block => block.activities)) {
    const tasks = activity.tasks ?? []
    if (tasks.some(task => task.kind === 'evidence' && task.status === 'completed' && (!task.submission || (!task.submission.file && !/\.(pdf|docx|xlsx)$/.test(task.resource ?? '')))))
      ctx.addIssue({ code: 'custom', message: 'Uma evidência submetida exige um ficheiro e metadados de submissão.' })
    if (new Set(tasks.map(task => task.id)).size !== tasks.length || tasks.some(task =>
      (task.kind === 'quiz' && (!task.questions?.length || new Set(task.questions.map(q => q.id)).size !== task.questions.length || task.questions.some(q => q.correct >= q.options.length))) ||
      (['video', 'pdf', 'url'].includes(task.kind) && !task.resource)))
      ctx.addIssue({ code: 'custom', message: 'Definição de tarefa inválida.' })
    if ([...(activity.previousIds ?? []), ...(activity.nextIds ?? [])].some(id => !ids.includes(id) || id === activity.id))
      ctx.addIssue({ code: 'custom', message: 'Ligação de actividade inválida.' })
  }
  if (value.context.roadmapVersion) {
    const tasks = value.blocks.flatMap(block => block.activities.flatMap(activity => activity.tasks ?? []))
    const byId = new Map(tasks.map(task => [task.id, task]))
    const visited = new Set<string>()
    const visiting = new Set<string>()
    const cyclic = (id: string): boolean => {
      if (visiting.has(id)) return true
      if (visited.has(id)) return false
      visiting.add(id)
      if ((byId.get(id)?.dependsOn ?? []).some(cyclic)) return true
      visiting.delete(id)
      visited.add(id)
      return false
    }
    if (byId.size !== tasks.length || tasks.some(task => task.dependsOn?.some(id => !byId.has(id)) || cyclic(task.id)))
      ctx.addIssue({ code: 'custom', message: 'As dependências das tarefas devem existir e não podem formar ciclos.' })
  }
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
