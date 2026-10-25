import { describe, expect, it } from 'vitest'
import fixture from '@/data/student-roadmap-example-1.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { getActivityBlockContext } from './activity-context'

const snapshot = journeySnapshotSchema.parse(fixture)
describe('blocos em contexto da actividade', () => {
  it('mostra os blocos anterior, seleccionado e seguinte, sem os confundir com actividades', () => {
    const result = getActivityBlockContext(snapshot, 'registar-empresa')
    expect([result.previous?.id, result.current?.id, result.next?.id]).toEqual(['ideacao', 'constituicao', 'inicio-actividades'])
    expect(getActivityBlockContext(snapshot, 'gestor-documental')).toEqual(result)
  })
  it('segue o bloco da actividade aberta, mesmo fora do bloco em curso da empresa', () => {
    const before = structuredClone(snapshot)
    const result = getActivityBlockContext(snapshot, 'definir-ideia')
    expect([result.previous?.id, result.current?.id, result.next?.id]).toEqual(['acolhimento', 'ideacao', 'constituicao'])
    expect(snapshot.context.currentBlockId).toBe('constituicao')
    expect(snapshot).toEqual(before)
  })
  it('preserva os limites e o bloco futuro vazio, sem inventar actividades', () => {
    expect(getActivityBlockContext(snapshot, 'boas-vindas').previous).toBeUndefined()
    const last = snapshot.blocks.flatMap(block => block.activities).at(-1)!
    const result = getActivityBlockContext(snapshot, last.id)
    expect(result.next?.id).toBe('primeiro-ano')
    expect(result.next?.activities).toHaveLength(0)
    const withoutFuture = { ...snapshot, blocks: snapshot.blocks.slice(0, -1) }
    expect(getActivityBlockContext(withoutFuture, last.id).next).toBeUndefined()
    expect(getActivityBlockContext(snapshot, 'missing')).toEqual({ previous: undefined, current: undefined, next: undefined })
  })
})
