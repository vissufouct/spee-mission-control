import { describe, expect, it } from 'vitest'
import studentFixture from '@/data/student-journey.fixture.json'
import teacherFixture from '@/data/teacher-mission-control.fixture.json'
import roadmapFixture from '@/data/student-roadmap-example-1.fixture.json'
import teacherRoadmap from '@/data/teacher-roadmap.fixture.json'
import { JsonJourneyRepository, journeySnapshotSchema } from '@/features/student-journey'
import { JsonTeacherRepository, teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { mapStudentJourney } from './mapStudentJourney'
import { createStudentConversations } from './createStudentConversations'
const template = teacherSnapshotSchema.parse(teacherFixture).companies.find(c => c.linkedToStudent)!
function setup() {
  const data = new Map<string,string>()
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string,value: string) => { data.set(key,value) } }
  const student = new JsonJourneyRepository(studentFixture,storage)
  const teacher = new JsonTeacherRepository(teacherFixture,storage,async () => mapStudentJourney(await student.getSnapshot(), template))
  return { student, teacher }
}
describe('origem comum estudante/docente', () => {
  it('reflecte a confirmação do estudante e o comprovativo sem copiar estados', async () => {
    const { student, teacher } = setup()
    let linked = (await teacher.getSnapshot()).companies.find(c => c.linkedToStudent)!
    expect(linked.activities.filter(a => a.status === 'completed')).toHaveLength(3)
    expect(linked.events.filter(e => e.role === 'student')).toHaveLength(2)
    await student.confirmRegistration(0)
    linked = (await teacher.getSnapshot()).companies.find(c => c.linkedToStudent)!
    expect(linked.activities.filter(a => a.status === 'completed')).toHaveLength(3)
    expect(linked.activities.find(a => a.id === 'registar-empresa')?.status).toBe('in-progress')
    expect(linked.results.find(r => r.activityId === 'registar-empresa')?.reference).toBe((await student.getSnapshot()).registration?.receiptNumber)
    expect(linked.events.filter(e => e.role === 'student')).toHaveLength(3)
    await student.completeLearningTask('registar-empresa', 'registration-guide', undefined, 1)
    await student.completeLearningTask('registar-empresa', 'registration-quiz', { nuit: 1, capital: 0, evidence: 2 }, 2)
    await student.completeLearningTask('registar-empresa', 'registration-declaration', undefined, 3)
    linked = (await teacher.getSnapshot()).companies.find(c => c.linkedToStudent)!
    expect(linked.activities.filter(a => a.status === 'completed')).toHaveLength(4)
  })
  it('sem rascunho volta a por iniciar; não atribui autoria a estados iniciais', async () => {
    const { student, teacher } = setup()
    await student.removeRegistration(0)
    const linked = (await teacher.getSnapshot()).companies.find(c => c.linkedToStudent)!
    expect(linked.activities.find(a => a.id === 'registar-empresa')?.status).toBe('not-started')
    expect(linked.events.filter(e => e.id.startsWith('source-initial')).every(e => e.role === 'system' && e.actorIds.length === 0)).toBe(true)
  })
})

describe('roteiro aplicado à empresa ligada', () => {
  function parseRoadmapSeed() { return journeySnapshotSchema.parse(roadmapFixture) }
  function setupRoadmap() {
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
    const student = new JsonJourneyRepository(roadmapFixture, storage)
    const seed = teacherSnapshotSchema.parse(teacherRoadmap)
    seed.companies = [mapStudentJourney(parseRoadmapSeed(), { ...template, routeId: seed.routes[0].id })]
    seed.generalOrientations = []
    seed.orientations = seed.orientations.filter(note => note.companyId !== template.id)
    seed.orientationRequests = seed.orientationRequests.filter(note => seed.companies.some(company => company.id === note.companyId))
    const teacher = new JsonTeacherRepository(seed, storage, async () => mapStudentJourney(await student.getSnapshot(), seed.companies[0]))
    return { student, teacher, conversations: createStudentConversations(student, teacher) }
  }
  it('mostra as 48 tarefas e permite orientação numa actividade nova sem expor conversas do grupo', async () => {
    const { student, teacher, conversations } = setupRoadmap()
    const linked = (await teacher.getSnapshot()).companies.find(company => company.linkedToStudent)!
    expect(linked.activities.flatMap(activity => activity.tasks ?? [])).toHaveLength(48)
    expect(linked.activities.flatMap(activity => activity.tasks ?? []).filter(task => task.status === 'completed')).toHaveLength(24)
    expect(linked.blocks.find(block => block.id === 'inicio-actividades')?.state).toBe('not-started')
    expect(linked.blocks.find(block => block.id === 'primeiro-ano')?.state).toBe('unavailable')
    await conversations.send('boas-vindas', 'Como organizar o acolhimento da equipa?')
    const snapshot = await teacher.getSnapshot()
    const request = snapshot.orientationRequests.find(item => item.activityId === 'boas-vindas')!
    await teacher.replyToOrientationRequest(request.id, { message: 'Comecem pelo guia de apresentação.' }, snapshot.revision)
    const messages = await conversations.read()
    expect(messages.map(message => message.message)).toEqual(['Como organizar o acolhimento da equipa?', 'Comecem pelo guia de apresentação.'])
    const privateMessages = (await student.getSnapshot()).groupMessages
    expect(privateMessages.length).toBeGreaterThan(0)
    expect(JSON.stringify(await teacher.getSnapshot())).not.toContain(privateMessages[0].message)
  })
  it('recusa uma escrita concorrente depois de actualizar a empresa ligada', async () => {
    const { teacher } = setupRoadmap()
    const results = await Promise.allSettled([
      teacher.receiveStudentMessage(template.id, 'boas-vindas', 'Ana Machava', 'Primeira dúvida sobre o roteiro.', 0),
      teacher.receiveStudentMessage(template.id, 'boas-vindas', 'Ana Machava', 'Segunda dúvida sobre o roteiro.', 0),
    ])
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter(result => result.status === 'rejected')).toHaveLength(1)
    const snapshot = await teacher.getSnapshot()
    expect(snapshot.revision).toBe(1)
    expect(snapshot.orientationRequests.find(item => item.activityId === 'boas-vindas')?.messages).toHaveLength(1)
  })
})
