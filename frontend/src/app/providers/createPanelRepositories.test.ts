import { describe, expect, it } from 'vitest'
import legacyTeacher from '@/data/teacher-mission-control.fixture.json'
import { getActivityStatus, getLearningTasks } from '@/features/student-journey'
import { teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { createPanelRepositories } from './createPanelRepositories'
import { createStudentConversations } from './createStudentConversations'

function setup() {
  const data = new Map<string, string>()
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value) } }
  return { data, storage, one: createPanelRepositories(storage, '1'), two: createPanelRepositories(storage, '2') }
}

describe('docente: dez empresas do mesmo roteiro', () => {
  it('inclui cinco pedidos distintos e duas orientações, preservando respostas na migração', async () => {
    const { one, storage, data } = setup()
    const seed = await one.teacher.getSnapshot()
    expect(seed.orientationRequests).toHaveLength(5)
    expect(new Set(seed.orientationRequests.map(item => item.subject)).size).toBe(5)
    expect(seed.orientationRequests.every(item => item.status === 'awaiting-teacher')).toBe(true)
    expect(seed.generalOrientations).toHaveLength(2)
    const old = structuredClone(seed)
    delete old.demoCommunicationsVersion
    old.orientationRequests = []
    old.generalOrientations = []
    const key = 'spee.roadmap-2026.teacher.shared.v1'
    data.set(key, JSON.stringify(old))
    const migrated = await createPanelRepositories(storage, '1').teacher.getSnapshot()
    expect(migrated.orientationRequests).toHaveLength(5)
    expect(migrated.generalOrientations).toHaveLength(2)
    expect(migrated.companies).toEqual(seed.companies)
    migrated.orientationRequests[0].status = 'awaiting-student'
    migrated.generalOrientations.pop()
    data.set(key, JSON.stringify(migrated))
    const again = await createPanelRepositories(storage, '1').teacher.getSnapshot()
    expect(again.orientationRequests[0].status).toBe('awaiting-student')
    expect(again.generalOrientations).toHaveLength(1)
  })

  it('atribui a resposta do quiz ao estudante do cenário, sem copiar a pontuação para a equipa', async () => {
    const { one } = setup()
    const snapshot = await one.teacher.getSnapshot()
    const company = snapshot.companies.find(item => item.id === 'horizonte-verde')!
    const quiz = company.activities.find(item => item.id === 'registar-empresa')!.tasks!.find(task => task.kind === 'quiz')!
    expect(quiz.quizResults).toHaveLength(1)
    expect(company.participants.find(person => person.id === quiz.quizResults![0].participantId)?.name).toBe('Ana Machava')
    expect(quiz.quizResults![0].answers).toEqual(quiz.answers)
    expect(snapshot.companies.find(item => item.id === 'nascente-criativa')!.activities.flatMap(item => item.tasks ?? []).filter(task => task.kind === 'quiz').every(task => task.quizResults?.length === 0)).toBe(true)
  })

  it('preenche participação ilustrativa nas conclusões sem fabricar eventos ou alterar os exemplos', async () => {
    const { one, two, data } = setup()
    const before = [await one.student.getSnapshot(), await two.student.getSnapshot()]
    const snapshot = await one.teacher.getSnapshot()
    for (const company of snapshot.companies) {
      for (const activity of company.activities) {
        const ids = [...activity.participantIds, ...(activity.simulatedParticipantIds ?? [])]
        if (activity.status === 'completed') expect(ids.length).toBeGreaterThan(0)
        expect(new Set(ids).size).toBe(ids.length)
        for (const id of ids) expect(company.participants.some(person => person.id === id)).toBe(true)
        if (activity.status !== 'completed') expect(activity.simulatedParticipantIds ?? []).toEqual([])
      }
    }
    const first = snapshot.companies[0]
    expect(first.events).toEqual([])
    expect(first.results).toEqual([])
    const welcome = first.activities.find(activity => activity.id === 'boas-vindas')!
    expect(welcome.participantIds).toEqual([])
    expect(first.participants.filter(person => welcome.simulatedParticipantIds?.includes(person.id)).map(person => person.name)).toEqual(['Ana Machava', 'João Tembe'])
    expect(snapshot.companies[1].activities.every(activity => !activity.participantIds.length && !activity.simulatedParticipantIds?.length)).toBe(true)
    expect([await one.student.getSnapshot(), await two.student.getSnapshot()]).toEqual(before)
    expect(data.size).toBe(0)
    welcome.simulatedParticipantIds = ['pessoa-de-outra-empresa']
    expect(teacherSnapshotSchema.safeParse(snapshot).success).toBe(false)
  })
  it('projecta cada registo sem herdar os cenários, prazos ou resultados antigos', async () => {
    const { one, two } = setup()
    const snapshot = await one.teacher.getSnapshot()
    expect(snapshot).toEqual(await two.teacher.getSnapshot())
    expect(snapshot.companies).toHaveLength(10)
    expect(new Set(snapshot.companies.map(c => c.id)).size).toBe(10)
    expect(snapshot.companies.filter(c => c.linkedToStudent).map(c => c.id)).toEqual(['horizonte-verde', 'nascente-criativa'])
    expect(snapshot.milestones.map(m => m.id)).toEqual(['acolhimento', 'ideacao', 'constituicao', 'inicio-actividades', 'primeiro-ano'])
    expect(snapshot.milestones[4].upcoming).toBe(true)
    for (const [index, panel] of [one, two].entries()) {
      const source = await panel.student.getSnapshot()
      const company = snapshot.companies[index]
      expect(company.example).toBe(String(index + 1))
      expect(company.name).toBe(source.context.companyName)
      expect(company.activities).toHaveLength(15)
      expect(company.activities.flatMap(a => a.tasks ?? [])).toHaveLength(55)
      expect(company.activities.flatMap(a => a.tasks ?? []).filter(t => t.status === 'completed')).toHaveLength(index === 0 ? 24 : 0)
      expect(company.activities.filter(a => a.status === 'completed')).toHaveLength(index === 0 ? 6 : 0)
      expect(company.events).toEqual([])
      expect(company.results).toEqual([])
      expect(company.activities.every(a => a.dueDate === null)).toBe(true)
      expect(company.blocks.map(b => b.state)).toEqual(source.blocks.map(b => b.state))
      for (const activity of source.blocks.flatMap(b => b.activities)) {
        const projected = company.activities.find(a => a.id === activity.id)!
        expect(projected.status).toBe(getActivityStatus(activity, source))
        const tasks = getLearningTasks(activity, source)
        expect(projected.tasks?.map(t => t.id)).toEqual(tasks.map(t => t.id))
        for (const task of tasks) {
          expect(projected.tasks?.find(t => t.id === task.id)).toMatchObject({
            id: task.id, title: task.title, status: task.status, required: task.required,
            ...(task.answers && { answers: task.answers }),
            ...(task.submission && { submission: task.submission }),
            ...(task.completedAt && { completedAt: task.completedAt }),
          })
        }
      }
    }
    expect(snapshot.companies[0].activities.find(a => a.id === 'registar-empresa')?.participantIds).toEqual([])
    expect(snapshot.companies[0].activities.find(a => a.id === 'auditoria-1')?.participantIds).toHaveLength(1)
    expect(snapshot.generalOrientations).toHaveLength(2)
  })

  it('oferece oito cenários independentes com realizações coerentes e equipas próprias', async () => {
    const { one } = setup()
    const snapshot = await one.teacher.getSnapshot()
    const simulated = snapshot.companies.filter(c => !c.linkedToStudent)
    expect(simulated).toHaveLength(8)
    expect(snapshot.classes.map(turma => snapshot.companies.filter(c => c.classId === turma.id).length)).toEqual([4, 3, 3])
    expect(new Set(simulated.map(c => c.currentBlockId)).size).toBe(4)
    for (const company of simulated) {
      expect(company.example).toBeUndefined()
      expect(company.activities.map(a => a.id)).toEqual(snapshot.companies[0].activities.map(a => a.id))
      expect(company.activities.flatMap(a => a.tasks ?? [])).toHaveLength(55)
      expect(company.results).toEqual([])
      expect(company.blocks.at(-1)?.state).toBe('unavailable')
      for (const activity of company.activities) {
        const tasks = activity.tasks!
        expect(activity.status === 'completed').toBe(tasks.filter(t => t.required).every(t => t.status === 'completed'))
        for (const task of tasks.filter(t => t.status === 'completed')) {
          expect(Date.parse(task.completedAt!)).toBeLessThan(Date.parse(snapshot.context.asOf))
          if (task.kind === 'quiz') expect(Object.keys(task.answers ?? {})).toHaveLength(task.questions!.length)
          if (task.submission) {
            expect(company.participants.map(p => p.name)).toContain(task.submission.submittedBy)
            expect(task.submission.fileName).toContain(company.id)
            expect(task.resource).toBeUndefined()
          }
        }
      }
    }
  })

  it('acrescenta empresas ao armazenamento antigo sem substituir comunicações ou registos guardados', async () => {
    const { one, storage, data } = setup()
    const initial = await one.teacher.getSnapshot()
    const old = structuredClone(initial)
    old.orientationRequests = []
    old.companies = old.companies.filter(c => c.linkedToStudent)
    old.classes = old.classes.filter(c => c.id === 'turma-a')
    old.revision = 7
    old.generalOrientations = [{ id: 'nota-guardada', classIds: ['turma-a'], activity: 'Boas-vindas', subject: 'Preparação', message: 'Mensagem já guardada neste browser.', reason: 'Preparação das equipas.', author: 'Vali Issufo', createdAt: '2026-10-24T12:00:00Z' }]
    const key = 'spee.roadmap-2026.teacher.shared.v1'
    const original = JSON.stringify(old)
    data.set(key, original)
    const expanded = await createPanelRepositories(storage, '2').teacher.getSnapshot()
    expect(expanded.companies).toEqual(initial.companies)
    expect(expanded.classes).toEqual(initial.classes)
    expect(expanded.revision).toBe(7)
    expect(expanded.generalOrientations).toEqual(old.generalOrientations)
    expect(data.get(key)).toBe(original)
    const saved = await one.teacher.saveOrientation({ companyId: 'beira-logistica', activityId: 'boas-vindas', message: 'Confirmem os materiais de preparação.', reason: 'Acompanhamento da equipa.', subject: 'Preparação' }, 7)
    const persisted = teacherSnapshotSchema.parse(JSON.parse(data.get(key)!))
    persisted.companies.find(c => c.id === 'beira-logistica')!.name = 'Beira Logística — cenário guardado'
    data.set(key, JSON.stringify(persisted))
    const reloaded = await createPanelRepositories(storage, '1').teacher.getSnapshot()
    expect(reloaded.companies).toHaveLength(10)
    expect(reloaded.companies.find(c => c.id === 'beira-logistica')?.name).toBe('Beira Logística — cenário guardado')
    expect(reloaded.orientations).toEqual(saved.orientations)
    expect(reloaded.generalOrientations).toEqual(old.generalOrientations)
    expect(reloaded.revision).toBe(8)
  })

  it('actualiza só a empresa alterada e conserva os ficheiros, autores e datas após recarregar', async () => {
    const { one, two, storage } = setup()
    const initial = await one.teacher.getSnapshot()
    const changed = await two.student.completeLearningTask('boas-vindas', 'b01-a01-t01', undefined, 0)
    let teacher = await one.teacher.getSnapshot()
    expect(teacher.companies[0]).toEqual(initial.companies[0])
    expect(teacher.companies[1].activities.find(a => a.id === 'boas-vindas')?.tasks?.filter(t => t.status === 'completed')).toHaveLength(1)
    expect(teacher.companies[1].events[0]).toMatchObject({ id: changed.events[0].id, occurredAt: changed.events[0].occurredAt, message: changed.events[0].message })
    const registration = await one.student.confirmRegistration(0)
    const declaration = await one.student.completeLearningTask('registar-empresa', 'b03-a01-t06', undefined, registration.revision)
    const file = { fileName: 'publicacao-da-equipa.pdf', dataUrl: 'data:application/pdf;base64,JVBERi0xLjcK' }
    const submitted = await one.student.completeLearningTask('registar-empresa', 'b03-a01-t07', undefined, declaration.revision, file)
    teacher = await createPanelRepositories(storage, '2').teacher.getSnapshot()
    const task = teacher.companies[0].activities.find(a => a.id === 'registar-empresa')?.tasks?.find(t => t.id === 'b03-a01-t07')
    expect(task?.submission).toEqual(submitted.blocks.flatMap(b => b.activities).find(a => a.id === 'registar-empresa')?.tasks?.find(t => t.id === 'b03-a01-t07')?.submission)
    expect(task?.submission?.file).toEqual(file)
    expect(teacher.companies[0].results[0].reference).toBe(registration.registration?.receiptNumber)
    expect(teacher.companies[1].results).toEqual([])
    expect(teacher.companies[1].activities.filter(a => a.status === 'completed')).toHaveLength(0)
    expect(teacher.companies.slice(2)).toEqual(initial.companies.slice(2))
  })

  it('separa as conversas de cada empresa e partilha apenas orientações gerais da turma', async () => {
    const { one, two } = setup()
    const first = createStudentConversations(one.student, one.teacher, one.companyId)
    const second = createStudentConversations(two.student, two.teacher, two.companyId)
    await first.send('boas-vindas', 'Dúvida exclusiva da Horizonte Verde.')
    await second.send('boas-vindas', 'Dúvida exclusiva da Nascente Criativa.')
    const snapshot = await one.teacher.getSnapshot()
    const firstRequest = snapshot.orientationRequests.find(r => r.companyId === one.companyId)!
    const reply = await one.teacher.replyToOrientationRequest(firstRequest.id, { message: 'Resposta apenas para a Horizonte.' }, snapshot.revision)
    await one.teacher.publishGeneralOrientation({ classIds: [snapshot.classes[0].id], activity: 'Boas-vindas', subject: 'Preparação da turma', message: 'Leiam o guia antes de iniciar as tarefas.', reason: 'As duas equipas devem conhecer o roteiro.' }, reply.revision)
    expect((await first.read()).map(m => m.message)).toEqual(expect.arrayContaining(['Dúvida exclusiva da Horizonte Verde.', 'Resposta apenas para a Horizonte.']))
    expect((await second.read()).map(m => m.message)).not.toContain('Resposta apenas para a Horizonte.')
    expect((await second.read()).map(m => m.message)).toContain('Dúvida exclusiva da Nascente Criativa.')
    for (const gateway of [first, second]) expect((await gateway.read()).some(m => m.message.includes('Preparação da turma'))).toBe(true)
    expect(JSON.stringify(await one.teacher.getSnapshot())).not.toContain((await one.student.getSnapshot()).groupMessages[0].message)
  })

  it('conserva orientações antigas no contexto correcto, sem modificar os originais', async () => {
    const { storage, data } = setup()
    const raw = teacherSnapshotSchema.parse(legacyTeacher)
    raw.orientations = []
    raw.orientationRequests = []
    raw.generalOrientations = [{ id: 'nota-antiga', classIds: ['turma-a'], activity: 'Constituição legal da empresa', subject: 'Orientação anterior', message: 'Mensagem guardada antes da actualização.', reason: 'Manter o contexto da empresa de origem.', author: 'Vali Issufo', createdAt: '2026-10-24T12:00:00Z' }]
    const original = JSON.stringify(raw)
    const key = 'spee.roadmap-2026.2.spee.teacher-mission-control.v1'
    data.set(key, original)
    const one = createPanelRepositories(storage, '1'), two = createPanelRepositories(storage, '2')
    const before = await one.teacher.getSnapshot()
    expect(before.generalOrientations.find(note => note.id === 'nota-antiga')).toMatchObject({ ...raw.generalOrientations[0], companyIds: ['nascente-criativa'] })
    const first = createStudentConversations(one.student, one.teacher, one.companyId)
    const second = createStudentConversations(two.student, two.teacher, two.companyId)
    expect((await first.read()).some(m => m.id === 'nota-antiga')).toBe(false)
    expect((await second.read()).find(m => m.id === 'nota-antiga')?.createdAt).toBe('2026-10-24T12:00:00Z')
    await second.send('boas-vindas', 'Mensagem nova depois da migração.')
    expect(data.get(key)).toBe(original)
    expect(data.has('spee.roadmap-2026.teacher.shared.v1')).toBe(true)
    expect((await createPanelRepositories(storage, '1').teacher.getSnapshot()).generalOrientations).toEqual(before.generalOrientations)
  })

  it('não apresenta dados iniciais como actuais se um dos exemplos estiver corrompido', async () => {
    const { one, data } = setup()
    data.set('spee.roadmap-2026.2.spee.student-journey.v1', '{invalid')
    await expect(one.teacher.getSnapshot()).rejects.toThrow('empresas ligadas')
    expect(data.size).toBe(1)
  })

  it('exige conclusão datada para usar tarefas como prova de actividade concluída', async () => {
    const { one } = setup()
    const snapshot = await one.teacher.getSnapshot()
    expect(teacherSnapshotSchema.safeParse(snapshot).success).toBe(true)
    delete snapshot.companies[0].activities[0].tasks![0].completedAt
    expect(teacherSnapshotSchema.safeParse(snapshot).success).toBe(false)
  })
})

it('prepara os pré-requisitos do demo nos dois exemplos e reflecte-os no docente', async () => {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  for (const id of ['1', '2']) {
    const panels = createPanelRepositories(storage, id, true)
    const snapshot = await panels.student.getSnapshot()
    const activities = snapshot.blocks.flatMap(block => block.activities)
    const tasks = activities.flatMap(activity => activity.tasks ?? [])
    const prerequisites = new Set(tasks.flatMap(task => task.dependsOn ?? []))
    expect(prerequisites.size).toBe(18)
    expect(tasks.filter(task => prerequisites.has(task.id)).every(task => task.status === 'completed')).toBe(true)
    expect(tasks.some(task => task.status === 'not-started')).toBe(true)
    const teacher = await panels.teacher.getSnapshot()
    const company = teacher.companies.find(company => company.id === panels.companyId)!
    expect(company.activities.flatMap(activity => activity.tasks ?? []).some(task => task.status === 'blocked')).toBe(false)
    for (const activity of activities) expect(company.activities.find(item => item.id === activity.id)?.status).toBe(getActivityStatus(activity, snapshot))
    expect(await panels.student.getSnapshot()).toEqual(snapshot)
  }
  expect(values.size).toBe(0)
})
