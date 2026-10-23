import { describe, expect, it } from 'vitest'
import studentFixture from '@/data/student-journey.fixture.json'
import teacherFixture from '@/data/teacher-mission-control.fixture.json'
import { JsonJourneyRepository } from '@/features/student-journey'
import { JsonTeacherRepository, teacherSnapshotSchema } from '@/features/teacher-mission-control'
import { mapStudentJourney } from './mapStudentJourney'
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
    expect(linked.activities.filter(a => a.status === 'completed')).toHaveLength(4)
    expect(linked.results.find(r => r.activityId === 'registar-empresa')?.reference).toBe((await student.getSnapshot()).registration?.receiptNumber)
    expect(linked.events.filter(e => e.role === 'student')).toHaveLength(3)
  })
  it('sem rascunho volta a por iniciar; não atribui autoria a estados iniciais', async () => {
    const { student, teacher } = setup()
    await student.removeRegistration(0)
    const linked = (await teacher.getSnapshot()).companies.find(c => c.linkedToStudent)!
    expect(linked.activities.find(a => a.id === 'registar-empresa')?.status).toBe('not-started')
    expect(linked.events.filter(e => e.id.startsWith('source-initial')).every(e => e.role === 'system' && e.actorIds.length === 0)).toBe(true)
  })
})
