import { expect, it } from 'vitest'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import { JsonJourneyRepository } from './JsonJourneyRepository'
import { getProgress } from '../services/journey.selectors'

it('actualiza apenas participação genérica ou ausente, preservando realizações e contribuições personalizadas', async () => {
  const seed = await new JsonJourneyRepository(fixture, { getItem: () => null, setItem: () => {} }).getSnapshot()
  const old = structuredClone(seed)
  const activities = old.blocks.flatMap(block => block.activities)
  activities[0].simulatedParticipants = [
    { name: 'Ana Machava', contribution: 'Coordenação da actividade, revisão e submissão dos resultados.' },
    { name: 'João Tembe', contribution: 'Pesquisa, preparação dos dados e conferência das fontes.' },
    { name: 'António Sitoe', contribution: 'Organização dos documentos e verificação com a equipa.' },
  ]
  activities[1].simulatedParticipants = []
  activities[2].simulatedParticipants = [{ name: 'Ana Machava', contribution: 'Contribuição personalizada a preservar.' }]
  delete activities[0].tasks![0].simulatedParticipants
  activities[0].tasks![1].simulatedParticipants = [{ name: 'João Tembe', contribution: 'Contribuição específica da tarefa a preservar.' }]
  const original = JSON.stringify(old)
  const repository = new JsonJourneyRepository(fixture, { getItem: () => original, setItem: () => { throw new Error('A leitura não deve escrever.') } })
  const updated = await repository.getSnapshot()
  const updatedActivities = updated.blocks.flatMap(block => block.activities)
  const seedActivities = seed.blocks.flatMap(block => block.activities)
  expect(updatedActivities[0].simulatedParticipants).toEqual(seedActivities[0].simulatedParticipants)
  expect(updatedActivities[1].simulatedParticipants).toEqual(seedActivities[1].simulatedParticipants)
  expect(updatedActivities[2].simulatedParticipants).toEqual(activities[2].simulatedParticipants)
  expect(updatedActivities[0].tasks![0].simulatedParticipants).toEqual(seedActivities[0].tasks![0].simulatedParticipants)
  expect(updatedActivities[0].tasks![1].simulatedParticipants).toEqual(activities[0].tasks![1].simulatedParticipants)
  // Removing descriptive participation must leave every other value identical.
  for (const snapshot of [updated, old]) for (const block of snapshot.blocks) for (const activity of block.activities) {
    delete activity.simulatedParticipants
    for (const task of activity.tasks ?? []) delete task.simulatedParticipants
  }
  expect(updated).toEqual(old)
  expect(getProgress(updated)).toEqual(getProgress(seed))
  expect(await repository.exportSnapshot()).toContain('Contribuição personalizada a preservar.')
})
