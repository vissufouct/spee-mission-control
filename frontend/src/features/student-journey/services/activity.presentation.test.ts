import { describe, expect, it } from 'vitest'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema } from '../schemas/journey.schema'
import { getActivityCriteria, getNextActivity, getNextAction } from './activity.presentation'
const snapshot = journeySnapshotSchema.parse(fixture)
const activities = snapshot.blocks.flatMap(block => block.activities)
const registration = activities.find(item => item.id === 'registar-empresa')!
describe('apresentação compacta da actividade', () => {
  it('mostra apenas passos pendentes e oculta o bloco após conclusão', () => {
    expect(getNextAction(registration, snapshot)).toMatchObject({ title: 'Pré-quiz de registo da empresa', target: 'criteria' })
    expect(getNextAction(registration, { ...snapshot, registration: null })?.title).toBe('Pré-quiz de registo da empresa')
    expect(getNextAction(registration, { ...snapshot, registration: { ...snapshot.registration!, status: 'confirmed' } })?.title).toBe('Pré-quiz de registo da empresa')
    expect(getNextAction({ ...registration, tasks: [], steps: [] }, snapshot)).toBeUndefined()
    expect(getNextAction(activities.find(item => item.id === 'inicio-actividades')!, snapshot)).toBeUndefined()
  })
  it('usa confirmação e validação para contar critérios', () => {
    expect(getActivityCriteria(registration, snapshot)).toEqual({ confirmed: 1, total: 6 })
    expect(getActivityCriteria(registration, { ...snapshot, registration: null }).confirmed).toBe(0)
    expect(getActivityCriteria(registration, { ...snapshot, registration: { ...snapshot.registration!, status: 'confirmed' } }).confirmed).toBe(3)
    const reservation = activities.find(item => item.id === 'reserva-nome')!
    expect(getActivityCriteria(reservation, snapshot)).toEqual({ confirmed: reservation.steps!.length, total: reservation.steps!.length })
  })
  it('escolhe apenas sucessoras explícitas elegíveis', () => {
    expect(getNextActivity(registration, snapshot)?.id).toBe('convidar-socios')
    expect(getNextActivity({ ...registration, nextIds: ['inicio-actividades'] }, snapshot)).toBeUndefined()
    expect(getNextActivity({ ...registration, nextIds: [] }, snapshot)).toBeUndefined()
  })
})
