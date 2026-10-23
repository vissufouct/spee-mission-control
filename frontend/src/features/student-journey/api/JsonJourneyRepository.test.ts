import { beforeEach, describe, expect, it } from 'vitest'
import fixture from '@/data/student-journey.fixture.json'
import { JsonJourneyRepository, type JsonStorage } from './JsonJourneyRepository'
import { getBlockSummary, getProgress } from '../services/journey.selectors'
import { journeySnapshotSchema } from '../schemas/journey.schema'

describe('JsonJourneyRepository: contrato e invariantes', () => {
  let store: Map<string, string>
  let storage: JsonStorage
  let repository: JsonJourneyRepository
  beforeEach(() => {
    store = new Map()
    storage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => { store.set(key, value) } }
    repository = new JsonJourneyRepository(fixture, storage)
  })
  it('valida fixtures e devolve cópias independentes, sem persistir por leitura', async () => {
    const snapshot = await repository.getSnapshot()
    snapshot.context.studentName = 'Nome alterado'
    expect((await repository.getSnapshot()).context.studentName).toBe('Ana Machava')
    expect(store.size).toBe(0)
    expect(() => new JsonJourneyRepository({}, storage)).toThrow()
  })
  it('abrir o percurso e guardar rascunhos não altera o progresso', async () => {
    const snapshot = await repository.getSnapshot()
    expect(getProgress(snapshot)).toEqual({ completed: 3, total: 17, percent: 18 })
    const updated = await repository.updateRegistration({ ...snapshot.registration!.data, legalName: 'Marrabenta Agro, Lda.' }, 0)
    expect(getProgress(updated).percent).toBe(18)
    expect(updated.revision).toBe(1)
    await expect(new JsonJourneyRepository(fixture, storage).getSnapshot()).resolves.toEqual(updated)
  })
  it('confirmar actualiza resultado, evento e progresso como uma única operação', async () => {
    const confirmed = await repository.confirmRegistration(0)
    expect(confirmed.registration?.status).toBe('confirmed')
    expect(confirmed.registration?.receiptNumber).toMatch(/^REG-/)
    expect(confirmed.events.at(-1)?.type).toBe('registration.confirmed')
    expect(getProgress(confirmed).percent).toBe(24)
    expect(getBlockSummary(confirmed)).toMatchObject({ completed: 2, inProgress: 0, available: 1, blocked: 1 })
  })
  it('permite eliminar e voltar a criar um rascunho incompleto', async () => {
    const initial = await repository.getSnapshot()
    const removed = await repository.removeRegistration(0)
    expect(removed.registration).toBeNull()
    expect(getBlockSummary(removed).available).toBe(2)
    const created = await repository.createRegistration({ ...initial.registration!.data, legalName: '', email: '', capital: 0 }, 1)
    expect(created.registration?.status).toBe('draft')
    await expect(repository.confirmRegistration(2)).rejects.toThrow('obrigatórios')
    expect((await repository.getSnapshot()).revision).toBe(2)
  })
  it('não permite duplicar um rascunho ou alterar/eliminar um resultado confirmado', async () => {
    const snapshot = await repository.getSnapshot()
    await expect(repository.createRegistration(snapshot.registration!.data, 0)).rejects.toThrow('Já existe')
    await repository.confirmRegistration(0)
    await expect(repository.confirmRegistration(1)).rejects.toThrow('já está confirmado')
    await expect(repository.removeRegistration(1)).rejects.toThrow('Só é possível')
    await expect(repository.updateRegistration(snapshot.registration!.data, 1)).rejects.toThrow('consulta')
  })
  it('rejeita operações baseadas numa revisão antiga, incluindo chamadas simultâneas', async () => {
    const data = (await repository.getSnapshot()).registration!.data
    const results = await Promise.allSettled([repository.updateRegistration(data, 0), repository.updateRegistration(data, 0)])
    expect(results.map(result => result.status)).toEqual(['fulfilled', 'rejected'])
    expect((await repository.getSnapshot()).revision).toBe(1)
  })
  it('uma falha de escrita não devolve sucesso nem altera o cenário', async () => {
    const failing = new JsonJourneyRepository(fixture, { getItem: () => null, setItem: () => { throw new Error('Quota') } })
    await expect(failing.confirmRegistration(0)).rejects.toThrow('Não foi possível guardar')
    expect((await failing.getSnapshot()).registration?.status).toBe('draft')
  })
  it('dados corrompidos não são apagados silenciosamente; reset é explícito', async () => {
    store.set('spee.student-journey.v1', '{incompleto')
    await expect(repository.getSnapshot()).rejects.toThrow('Não foi possível ler')
    expect(store.get('spee.student-journey.v1')).toBe('{incompleto')
    expect(await repository.reset()).toEqual(journeySnapshotSchema.parse(fixture))
  })
  it('repor um cenário válido invalida operações que ficaram pendentes na revisão antiga', async () => {
    const reset = await repository.reset()
    expect(reset.revision).toBe(1)
    await expect(repository.confirmRegistration(0)).rejects.toThrow('noutra vista')
  })
  it('um rascunho inválido mostra uma mensagem legível e não altera dados', async () => {
    const snapshot = await repository.getSnapshot()
    await expect(repository.updateRegistration({ ...snapshot.registration!.data, capital: -1 }, 0)).rejects.toThrow('Verifique')
    expect(await repository.getSnapshot()).toEqual(snapshot)
  })
  it('exporta/importa JSON validado e preserva o cenário quando o ficheiro é inválido', async () => {
    const json = await repository.exportSnapshot()
    await repository.confirmRegistration(0)
    const imported = await repository.importSnapshot(json, 1)
    expect(imported.registration?.status).toBe('draft')
    expect(imported.revision).toBe(2)
    expect(imported.events.at(-1)?.type).toBe('scenario.imported')
    await expect(repository.importSnapshot('{}', 2)).rejects.toThrow('Ficheiro inválido')
    await expect(repository.importSnapshot('x'.repeat(2_000_001), 2)).rejects.toThrow('Ficheiro inválido')
    expect(await repository.getSnapshot()).toEqual(imported)
  })
  it('rejeita IDs duplicados, bloco inexistente e confirmação sem comprovativo', async () => {
    const snapshot = await repository.getSnapshot()
    snapshot.blocks[0].activities[1].id = snapshot.blocks[0].activities[0].id
    expect(journeySnapshotSchema.safeParse(snapshot).success).toBe(false)
    const invalidBlock = { ...fixture, context: { ...fixture.context, currentBlockId: 'inexistente' } }
    expect(journeySnapshotSchema.safeParse(invalidBlock).success).toBe(false)
    const invalidRegistration = { ...fixture, registration: { ...fixture.registration, status: 'confirmed' } }
    expect(journeySnapshotSchema.safeParse(invalidRegistration).success).toBe(false)
  })
})
