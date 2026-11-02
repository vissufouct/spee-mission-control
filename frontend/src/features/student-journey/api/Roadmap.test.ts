import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import exampleOne from '@/data/student-roadmap-example-1.fixture.json'
import exampleTwo from '@/data/student-roadmap-example-2.fixture.json'
import { JsonJourneyRepository } from './JsonJourneyRepository'
import { journeySnapshotSchema, registrationSchema } from '../schemas/journey.schema'
import { getLearningTasks, quizPassed } from '../services/learning-tasks'
import { getProgress } from '../services/journey.selectors'
import type { JourneySnapshot } from '../types'
const tasks = (snapshot: JourneySnapshot) => snapshot.blocks.flatMap(block => block.activities.flatMap(activity => activity.tasks ?? []))
const registrationData = registrationSchema.parse(exampleOne.registration!.data)
function setup(seed: unknown = exampleTwo) {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  return { storage, values, repository: new JsonJourneyRepository(seed, storage, 'example-2') }
}
describe('roteiro SPEE completo', () => {
  it('mantém 52 tarefas e dois pontos de partida isolados, sem contar o bloco futuro', async () => {
    const { repository, storage } = setup()
    const fresh = await repository.getSnapshot()
    const underway = await new JsonJourneyRepository(exampleOne, storage, 'example-1').getSnapshot()
    expect(tasks(fresh)).toHaveLength(52)
    expect(tasks(fresh).filter(task => task.status === 'completed')).toHaveLength(0)
    expect(tasks(underway).filter(task => task.status === 'completed')).toHaveLength(24)
    expect(getProgress(fresh)).toEqual({ completed: 0, total: 15, percent: 0 })
    expect(getProgress(underway)).toEqual({ completed: 6, total: 15, percent: 40 })
    expect(underway.context.currentBlockId).toBe('ideacao')
    await repository.completeLearningTask('boas-vindas', 'b01-a01-t01', undefined, 0)
    expect((await new JsonJourneyRepository(exampleOne, storage, 'example-1').getSnapshot()).revision).toBe(0)
    expect((await new JsonJourneyRepository(exampleTwo, storage, 'example-2').getSnapshot()).revision).toBe(1)
  })
  it('acrescenta previews a dados guardados sem perder conclusões', async () => {
    const { repository, values } = setup()
    await repository.completeLearningTask('boas-vindas', 'b01-a01-t01', undefined, 0)
    const old = JSON.parse(values.get('example-2')!) as JourneySnapshot
    for (const task of tasks(old)) delete task.preview
    values.set('example-2', JSON.stringify(old))
    const reloaded = await repository.getSnapshot()
    expect(tasks(reloaded)[0].status).toBe('completed')
    expect(tasks(reloaded)[0].preview).toBe('apoio/apresentacao-spee-preview.png')
    expect(reloaded.revision).toBe(1)
  })
  it('recusa saltar etapas, inclusive o formulário aberto por URL directa', async () => {
    const { repository, values } = setup()
    await expect(repository.completeLearningTask('registar-empresa', 'b03-a01-t03', undefined, 0)).rejects.toThrow('bloqueada')
    await expect(repository.createRegistration(registrationData, 0)).rejects.toThrow('tarefas anteriores')
    await expect(repository.completeLearningTask('confirmar-preparacao', 'b01-a03-t03', {}, 0)).rejects.toThrow('bloqueada')
    expect(values.size).toBe(0)
  })
  it('aplica o limiar de 70% e a aceitação explícita, sem alterar dados por uma tentativa inválida', async () => {
    const snapshot = journeySnapshotSchema.parse(exampleTwo)
    const quiz = tasks(snapshot).find(task => task.id === 'b01-a03-t02')!
    const answers = Object.fromEntries(quiz.questions!.map((question, index) => [question.id, index === 0 ? 1 : question.correct]))
    expect(quizPassed(quiz, answers)).toBe(true)
    answers[quiz.questions![1].id] = 1
    expect(quizPassed(quiz, answers)).toBe(false)
    expect(quizPassed(quiz, {})).toBe(false)
    const pledge = tasks(snapshot).find(task => task.id === 'b01-a03-t03')!
    expect(quizPassed(pledge, { [pledge.questions![0].id]: 1 })).toBe(false)
    const { repository, values } = setup()
    for (const activity of snapshot.blocks[0].activities) for (const task of activity.tasks!) {
      if (task.kind === 'quiz') continue
      const current = await repository.getSnapshot()
      await repository.completeLearningTask(activity.id, task.id, undefined, current.revision)
    }
    const before = values.get('example-2')
    await expect(repository.completeLearningTask('confirmar-preparacao', quiz.id, answers, 6)).rejects.toThrow('70%')
    expect(values.get('example-2')).toBe(before)
  })
  it('permite realizar as 52 tarefas, persistir evidência e avançar apenas após confirmação', async () => {
    const { repository, storage } = setup()
    let snapshot = await repository.getSnapshot()
    for (const block of snapshot.blocks) for (const activity of block.activities) for (const task of activity.tasks!) {
      snapshot = await repository.getSnapshot()
      const currentActivity = snapshot.blocks.flatMap(item => item.activities).find(item => item.id === activity.id)!
      expect(getLearningTasks(currentActivity, snapshot).find(item => item.id === task.id)?.status).not.toBe('blocked')
      if (task.id === 'b03-a01-t05') {
        snapshot = await repository.createRegistration(registrationData, snapshot.revision)
        await repository.confirmRegistration(snapshot.revision)
      } else {
        const answers = task.questions ? Object.fromEntries(task.questions.map(question => [question.id, question.correct])) : undefined
        const file = task.id === 'b03-a01-t07' ? { fileName: 'evidencia-equipa.pdf', dataUrl: 'data:application/pdf;base64,' + readFileSync(resolve('public/apoio/exemplo-publicacao.pdf')).toString('base64') } : undefined
        await repository.completeLearningTask(activity.id, task.id, answers, snapshot.revision, file)
      }
    }
    const reloaded = await new JsonJourneyRepository(exampleTwo, storage, 'example-2').getSnapshot()
    expect(getProgress(reloaded)).toEqual({ completed: 15, total: 15, percent: 100 })
    expect(tasks(reloaded).every(task => task.status === 'completed')).toBe(true)
    expect(reloaded.context.currentBlockId).toBe('inicio-actividades')
    expect(tasks(reloaded).find(task => task.id === 'b03-a01-t07')?.submission?.file?.fileName).toBe('evidencia-equipa.pdf')
  })
  it('recusa ciclos e confirma a existência de todos os recursos locais e ligações das páginas de apoio', () => {
    const snapshot = journeySnapshotSchema.parse(exampleTwo)
    const all = tasks(snapshot)
    for (const resource of [...all.flatMap(task => [task.resource, task.cover, task.preview]), ...snapshot.blocks.flatMap(block => block.activities.flatMap(activity => activity.materials?.map(material => material.href) ?? []))]) {
      if (resource?.startsWith('apoio/')) expect(existsSync(resolve('public', resource)), resource).toBe(true)
    }
    for (const page of ['relatorio-final', 'plano-negocios', 'identidade-visual']) {
      for (const match of readFileSync(resolve(`public/apoio/${page}.html`), 'utf8').matchAll(/href="([^"]+)"/g)) {
        if (!match[1].startsWith('https://')) expect(existsSync(resolve('public/apoio', match[1])), match[1]).toBe(true)
      }
    }
    all[0].dependsOn = [all[1].id]; all[1].dependsOn = [all[0].id]
    expect(journeySnapshotSchema.safeParse(snapshot).success).toBe(false)
  })
})

it('actualiza links e acrescenta tarefas sem perder respostas ou concluir novas tarefas', async () => {
  const { repository, values } = setup(exampleOne)
  const old = journeySnapshotSchema.parse(exampleOne)
  for (const block of old.blocks) for (const activity of block.activities) {
    activity.tasks = activity.tasks?.filter(task => !['b02-a01-t05', 'b04-a03-t05', 'b04-a04-t03', 'b04-a04-t04'].includes(task.id))
    for (const task of activity.tasks ?? []) delete task.links
  }
  const bau = tasks(old).find(task => task.id === 'b03-a01-t01')!
  bau.resource = 'https://www.bau.gov.mz/'
  values.set('example-2', JSON.stringify(old))
  const updated = await repository.getSnapshot()
  expect(tasks(updated)).toHaveLength(52)
  expect(tasks(updated).find(task => task.id === bau.id)).toMatchObject({ status: 'completed', links: [{ label: 'Consultar licenciamento e registo', url: 'https://www.bau.gov.mz/licenciamento-eregisto-de-actividades-economicas-2/' }] })
  expect(tasks(updated).find(task => task.id === 'b02-a01-t05')?.status).toBe('not-started')
  expect(tasks(updated).find(task => task.id === 'b02-a01-t01')?.answers).toEqual(tasks(old).find(task => task.id === 'b02-a01-t01')?.answers)
  expect(values.get('example-2')).toBe(JSON.stringify(old))
})
