import { JsonJourneyRepository, journeySnapshotSchema } from '@/features/student-journey'
import { JsonTeacherRepository, RoadmapTeacherStorage, teacherSnapshotSchema, type Company } from '@/features/teacher-mission-control'
import exampleOne from '@/data/student-roadmap-example-1.fixture.json'
import exampleTwo from '@/data/student-roadmap-example-2.fixture.json'
import teacherFixture from '@/data/teacher-mission-control.fixture.json'
import teacherRoadmap from '@/data/teacher-roadmap.fixture.json'
import { mapStudentJourney } from './mapStudentJourney'

interface Storage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export function exampleStorage(storage: Storage, id: string): Storage {
  return { getItem: key => storage.getItem(`spee.roadmap-2026.${id}.${key}`), setItem: (key, value) => storage.setItem(`spee.roadmap-2026.${id}.${key}`, value) }
}

export function createPanelRepositories(storage: Storage, selected: string) {
  const examples = [exampleOne, exampleTwo].map((seed, index) => ({
    id: String(index + 1), companyId: index === 0 ? 'horizonte-verde' : 'nascente-criativa', seed,
    repository: new JsonJourneyRepository(seed, exampleStorage(storage, String(index + 1))),
  }))
  const current = examples.find(example => example.id === selected) ?? examples[0]
  // Explicitly imported pre-roadmap scenarios retain their original regression path.
  // Invalid storage is still surfaced by the repositories, never silently replaced.
  let legacy = false
  try {
    const raw = exampleStorage(storage, current.id).getItem('spee.student-journey.v1')
    legacy = raw !== null && !JSON.parse(raw).context?.roadmapVersion
  } catch { /* Repository validation presents the read error. */ }
  if (legacy) {
    const seed = teacherSnapshotSchema.parse(teacherFixture)
    const template = seed.companies.find(company => company.linkedToStudent)!
    return { student: current.repository, companyId: template.id,
      teacher: new JsonTeacherRepository(seed, exampleStorage(storage, current.id), async () => mapStudentJourney(await current.repository.getSnapshot(), template)) }
  }
  const seed = teacherSnapshotSchema.parse(teacherRoadmap)
  const identities: Company[] = examples.map(example => ({
    id: example.companyId, name: example.seed.context.companyName, classId: seed.classes[0].id,
    routeId: seed.routes[0].id, definitionVersion: seed.routes[0].version, currentBlockId: example.seed.context.currentBlockId,
    linkedToStudent: true, participants: [], blocks: [], activities: [], events: [], results: [],
  }))
  seed.companies = examples.map((example, index) => mapStudentJourney(journeySnapshotSchema.parse(example.seed), identities[index]))
  const sharedStorage = new RoadmapTeacherStorage(storage, seed, examples.map(example => ({ key: `spee.roadmap-2026.${example.id}.spee.teacher-mission-control.v1`, companyId: example.companyId })))
  const teacher = new JsonTeacherRepository(seed, sharedStorage, async () => Promise.all(examples.map(async (example, index) => {
    const snapshot = await example.repository.getSnapshot()
    if (snapshot.context.roadmapVersion !== seed.routes[0].version) throw new Error('O exemplo não corresponde ao roteiro actual.')
    return mapStudentJourney(snapshot, identities[index])
  })))
  return { student: current.repository, teacher, companyId: current.companyId }
}
