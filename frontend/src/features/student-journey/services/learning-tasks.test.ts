import { describe, expect, it } from 'vitest'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { quizPassed, quizScore } from './learning-tasks'
import { JsonJourneyRepository } from '../api/JsonJourneyRepository'

const snapshot = journeySnapshotSchema.parse(fixture)
const diagnostic = snapshot.blocks[0].activities[0].tasks!.find(task => task.id === 'entrepreneur-diagnostic')!
describe('diagnóstico e evidência da ideia', () => {
  it('calcula a pontuação pelas respostas, sem exigir 100% ao diagnóstico', () => {
    expect(quizScore(diagnostic)).toEqual({ correct: 4, total: 5, percent: 80 })
    expect(quizPassed(diagnostic, diagnostic.answers!)).toBe(true)
    expect(quizPassed(diagnostic, {})).toBe(false)
    expect(quizPassed(diagnostic, { ...diagnostic.answers, client: 99 })).toBe(false)
    expect(quizPassed({ ...diagnostic, quizMode: 'mastery' }, diagnostic.answers!)).toBe(false)
  })
  it('acrescenta os exemplos antigos sem sobrescrever uma resposta já guardada', async () => {
    const previous = structuredClone(snapshot)
    previous.blocks[0].activities[0].tasks = previous.blocks[0].activities[0].tasks!.filter(task => task.id !== 'audit-report-1')
    previous.blocks[0].activities[0].tasks!.find(task => task.id === diagnostic.id)!.answers = { ...diagnostic.answers, risk: 1 }
    previous.blocks[0].activities[0].tasks!.reverse()
    const registration = previous.blocks.flatMap(b => b.activities).find(a => a.id === 'registar-empresa')!
    registration.tasks = registration.tasks!.filter(t => t.id !== 'registration-declaration').reverse()
    const stored = JSON.stringify(previous)
    const repository = new JsonJourneyRepository(fixture, { getItem: () => stored, setItem: () => { throw new Error('Leitura não deve escrever') } })
    const result = await repository.getSnapshot()
    const tasks = result.blocks[0].activities[0].tasks!
    expect(tasks).toHaveLength(3)
    expect(tasks[0].id).toBe('entrepreneur-diagnostic')
    const registrationTasks = result.blocks.flatMap(b => b.activities).find(a => a.id === 'registar-empresa')!.tasks!
    expect(registrationTasks[0].id).toBe('registration-quiz')
    expect(registrationTasks.at(-1)).toMatchObject({ id: 'registration-declaration', status: 'not-started' })
    expect(tasks.find(task => task.id === 'audit-report-1')?.submission?.fileName).toBe('relatorio-auditoria-1.pdf')
    expect(quizScore(tasks.find(task => task.id === diagnostic.id)!)).toMatchObject({ percent: 100 })
    expect(result.registration).toEqual(previous.registration)
    expect(result.groupMessages).toEqual(previous.groupMessages)
  })
  it('recusa evidência concluída sem PDF e metadados', () => {
    const invalid = structuredClone(snapshot)
    delete invalid.blocks[0].activities[0].tasks!.find(task => task.id === 'audit-report-1')!.submission
    expect(journeySnapshotSchema.safeParse(invalid).success).toBe(false)
  })
})
