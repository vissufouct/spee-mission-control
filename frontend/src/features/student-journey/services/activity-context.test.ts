import { describe, expect, it } from 'vitest'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { getActivityContext } from './activity-context'

const snapshot = journeySnapshotSchema.parse(fixture)
describe('contexto sequencial da actividade', () => {
  it('centra na selecção, mesmo fora do bloco em curso e sem precedências', () => {
    const activities = snapshot.blocks.flatMap(block => block.activities)
    const chosen = activities[2]
    const result = getActivityContext(snapshot, chosen.id)
    expect(result.previous?.activity.id).toBe(activities[1].id)
    expect(result.current?.activity.id).toBe(chosen.id)
    expect(result.next?.activity.id).toBe(activities[3].id)
    expect(snapshot.context.currentBlockId).toBe('constituicao')
  })
  it('atravessa limites de blocos sem inventar actividades nos blocos vazios', () => {
    const first = snapshot.blocks[0].activities[0]
    const lastOfFirst = snapshot.blocks[0].activities.at(-1)!
    expect(getActivityContext(snapshot, first.id).previous).toBeUndefined()
    expect(getActivityContext(snapshot, lastOfFirst.id).next?.activity.id).toBe(snapshot.blocks[1].activities[0].id)
    const last = snapshot.blocks.flatMap(block => block.activities).at(-1)!
    expect(getActivityContext(snapshot, last.id).next).toBeUndefined()
    expect(getActivityContext(snapshot, 'missing')).toEqual({ previous: undefined, current: undefined, next: undefined })
  })
})
