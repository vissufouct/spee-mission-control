import { describe, expect, it } from 'vitest'
import fixture from '@/data/student-journey.fixture.json'
import { JsonJourneyRepository } from './JsonJourneyRepository'
import { getProgress } from '../services/journey.selectors'
import { journeySnapshotSchema } from '../schemas/journey.schema'

function setup() {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  return { values, storage, repository: new JsonJourneyRepository(fixture, storage) }
}
describe('tarefas de aprendizagem', () => {
  it('exige respostas correctas e conserva resultados após nova leitura', async () => {
    const { repository, storage, values } = setup()
    await expect(repository.completeLearningTask('registar-empresa', 'registration-quiz', { nuit: 0 }, 0)).rejects.toThrow('Reveja')
    expect(values.size).toBe(0)
    const first = await repository.completeLearningTask('registar-empresa', 'registration-quiz', { nuit: 1, capital: 0, evidence: 2 }, 0)
    expect(first.events.at(-1)?.activityStatus).toBe('in-progress')
    const reloaded = await new JsonJourneyRepository(fixture, storage).getSnapshot()
    expect(reloaded.blocks.flatMap(block => block.activities).find(a => a.id === 'registar-empresa')?.tasks?.find(task => task.id === 'registration-quiz')?.answers).toEqual({ nuit: 1, capital: 0, evidence: 2 })
    expect(getProgress(reloaded).percent).toBe(18)
    await repository.confirmRegistration(1)
    await repository.completeLearningTask('registar-empresa', 'registration-guide', undefined, 2)
    const completed = await repository.completeLearningTask('registar-empresa', 'registration-declaration', undefined, 3)
    expect(completed.blocks.flatMap(b => b.activities).find(a => a.id === 'registar-empresa')?.tasks?.at(-1)?.submission?.fileName).toBe('declaracao-inicio-actividade.pdf')
    expect(getProgress(completed).percent).toBe(24)
    expect(completed.events.at(-1)?.activityStatus).toBe('completed')
  })
  it('recusa operações de registo pelo atalho, tarefas bloqueadas e revisões obsoletas', async () => {
    const { repository } = setup()
    await expect(repository.completeLearningTask('registar-empresa', 'registration-submit', undefined, 0)).rejects.toThrow('módulo')
    await expect(repository.completeLearningTask('inicio-actividades', 'inicio-actividades-0', undefined, 0)).rejects.toThrow('bloqueada')
    await repository.completeLearningTask('convidar-socios', 'socios-guia', undefined, 0)
    await expect(repository.completeLearningTask('convidar-socios', 'socios-video', undefined, 0)).rejects.toThrow('noutra vista')
  })
  it('erro de armazenamento não confirma a tarefa e a migração preserva mensagens', async () => {
    const { values, storage } = setup()
    const old = journeySnapshotSchema.parse(fixture)
    for (const block of old.blocks) for (const activity of block.activities) delete activity.tasks
    const original = JSON.stringify(old)
    values.set('spee.student-journey.v1', original)
    const repository = new JsonJourneyRepository(fixture, storage)
    const migrated = await repository.getSnapshot()
    expect(migrated.groupMessages).toEqual(old.groupMessages)
    expect(migrated.blocks.flatMap(b => b.activities).find(a => a.id === 'registar-empresa')?.tasks).toHaveLength(6)
    expect(values.get('spee.student-journey.v1')).toBe(original)
    const failing = new JsonJourneyRepository(fixture, { getItem: storage.getItem, setItem: () => { throw new Error('quota') } })
    await expect(failing.completeLearningTask('registar-empresa', 'registration-guide', undefined, 0)).rejects.toThrow('Nenhuma alteração')
    expect(values.get('spee.student-journey.v1')).toBe(original)
  })
})
