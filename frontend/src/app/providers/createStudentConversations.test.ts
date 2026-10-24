import { describe, expect, it } from 'vitest'
import studentFixture from '@/data/student-journey.fixture.json'
import teacherFixture from '@/data/teacher-mission-control.fixture.json'
import { JsonJourneyRepository } from '@/features/student-journey'
import { JsonTeacherRepository, teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { createStudentConversations } from './createStudentConversations'
import { mapStudentJourney } from './mapStudentJourney'
function setup() {
  const data = new Map<string, string>()
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value) } }
  const student = new JsonJourneyRepository(studentFixture, storage)
  const template = teacherSnapshotSchema.parse(teacherFixture).companies.find(c => c.linkedToStudent)!
  const teacher = new JsonTeacherRepository(teacherFixture, storage, async () => mapStudentJourney(await student.getSnapshot(), template))
  return { data, student, teacher, gateway: createStudentConversations(student, teacher) }
}
describe('colaboração com fronteiras de privacidade', () => {
  it('não projecta mensagens ou tarefas do grupo para o docente', async () => {
    const { student, teacher, gateway } = setup()
    const before = await teacher.getSnapshot()
    await student.sendGroupMessage('registar-empresa', 'Conteúdo exclusivo do grupo', 'Ana Machava', 0)
    expect(JSON.stringify(await teacher.getSnapshot())).not.toContain('Conteúdo exclusivo do grupo')
    expect(await gateway.read()).not.toEqual(expect.arrayContaining([expect.objectContaining({ message: 'Conteúdo exclusivo do grupo' })]))
    expect((await teacher.getSnapshot()).revision).toBe(before.revision)
  })
  it('partilha a conversa docente por empresa com autoria de vários estudantes', async () => {
    const { data, student, gateway } = setup()
    await gateway.send('registar-empresa', 'Ana conferiu os dados do registo.')
    const snapshot = await student.getSnapshot()
    snapshot.context.studentName = 'João Tembe'
    data.set('spee.student-journey.v1', JSON.stringify(snapshot))
    expect(await gateway.read()).toContainEqual(expect.objectContaining({ author: 'Ana Machava', message: 'Ana conferiu os dados do registo.' }))
    await gateway.send('registar-empresa', 'João confirmou os documentos da empresa.')
    snapshot.context.studentName = 'Ana Machava'
    data.set('spee.student-journey.v1', JSON.stringify(snapshot))
    expect(await gateway.read()).toContainEqual(expect.objectContaining({ author: 'João Tembe', message: 'João confirmou os documentos da empresa.' }))
  })
  it('só permite concluir a tarefa ao responsável e mantém notificação independente', async () => {
    const { student } = setup()
    await expect(student.completeTask('grupo-arquivo', 0)).rejects.toThrow('Só o responsável')
    const completed = await student.completeTask('grupo-documentos', 0)
    expect(completed.groupMessages[0].doneAt).not.toBeNull()
    expect(completed.resolvedNotifications).toEqual([])
    const resolved = await student.resolveNotification('grupo-documentos', 1)
    expect(resolved.resolvedNotifications).toContainEqual({ id: 'grupo-documentos', recipient: 'Ana Machava' })
    await expect(student.resolveNotification('grupo-arquivo', 2)).rejects.toThrow('não lhe é destinada')
    expect((await student.getSnapshot()).events).toEqual(completed.events)
  })
  it('reabre pedido concluído e devolve respostas sem expor rascunhos ou outras empresas', async () => {
    const { teacher, gateway } = setup()
    await gateway.send('registar-empresa', 'Precisamos de ajuda para conferir os documentos.')
    let snapshot = await teacher.getSnapshot()
    const request = snapshot.orientationRequests.find(r => r.companyId === 'horizonte-verde' && r.activityId === 'registar-empresa')!
    await teacher.replyToOrientationRequest(request.id, { message: 'Confirmem os documentos antes de submeter.' }, snapshot.revision)
    snapshot = await teacher.getSnapshot()
    await teacher.concludeOrientationRequest(request.id, snapshot.revision)
    await gateway.send('registar-empresa', 'Temos mais uma dúvida sobre a reserva do nome.')
    expect((await teacher.getSnapshot()).orientationRequests.find(r => r.id === request.id)?.status).toBe('awaiting-teacher')
    expect(await gateway.read()).toContainEqual(expect.objectContaining({ incoming: true, message: 'Confirmem os documentos antes de submeter.' }))
    expect((await gateway.read()).some(m => m.message.includes('Dúvida sobre a declaração de IVA'))).toBe(false)
  })
})
