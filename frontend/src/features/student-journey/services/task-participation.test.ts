import { expect, it } from 'vitest'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import untouched from '@/data/student-roadmap-example-2.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { getLearningTasks } from './learning-tasks'
import { getTaskParticipants } from './task-participation'

it('apresenta participantes específicos em todas as tarefas realizadas, sem alterar os dados', () => {
  const snapshot = journeySnapshotSchema.parse(fixture)
  const before = structuredClone(snapshot)
  for (const activity of snapshot.blocks.flatMap(block => block.activities)) {
    for (const task of getLearningTasks(activity, snapshot)) {
      const participants = getTaskParticipants(task)
      if (['completed', 'in-progress'].includes(task.status)) {
        expect(participants.length).toBeGreaterThan(0)
        for (const person of participants) expect(snapshot.members).toContain(person.name)
        if (task.submission) expect(participants.map(person => person.name)).toContain(task.submission.submittedBy)
      } else expect(participants).toEqual([])
    }
  }
  const registration = snapshot.blocks.flatMap(block => block.activities).find(activity => activity.id === 'registar-empresa')!
  expect(getTaskParticipants(registration.tasks![1]).map(person => person.name)).toEqual(['Ana Machava'])
  expect(getTaskParticipants(registration.tasks![2]).map(person => person.name)).toEqual(['João Tembe', 'António Sitoe'])
  expect(snapshot).toEqual(before)
})

it('não apresenta contribuições realizadas no exemplo novo ou inventa participantes ausentes', () => {
  const snapshot = journeySnapshotSchema.parse(untouched)
  for (const activity of snapshot.blocks.flatMap(block => block.activities)) for (const task of getLearningTasks(activity, snapshot)) expect(getTaskParticipants(task)).toEqual([])
  expect(getTaskParticipants({ ...snapshot.blocks[0].activities[0].tasks![0], status: 'completed', simulatedParticipants: undefined })).toEqual([])
})
