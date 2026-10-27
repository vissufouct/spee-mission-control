import { describe, expect, it } from 'vitest'
import { coachReply, type CoachBlock } from './CoachRepository'
const blocks: CoachBlock[] = [{ title: 'Criação de empresas', activities: [{ id: 'gestor', title: 'Gestor documental', description: 'Organizar documentos.', tasks: [{ title: 'Criar pastas', description: 'Crie as pastas da empresa.', kind: 'operation', status: 'completed' }, { title: 'Submeter relatório', description: 'Anexe o PDF.', kind: 'evidence', status: 'not-started' }] }] }]
describe('coach local', () => {
  it('orienta com base nas tarefas pendentes sem alterar os dados', () => {
    const original = structuredClone(blocks)
    expect(coachReply('Qual é a próxima tarefa?', blocks, 'gestor')).toContain('Submeter relatório')
    expect(blocks).toEqual(original)
  })
  it('não propõe novas tarefas quando todas estão concluídas', () => {
    const completed = structuredClone(blocks)
    completed[0].activities[0].tasks.forEach(t => { t.status = 'completed' })
    expect(coachReply('O que fazer?', completed, 'gestor')).toContain('estão concluídas')
  })
  it('explica condições e reconhece limites', () => {
    const blocked = structuredClone(blocks)
    blocked[0].activities[0].tasks[1] = { ...blocked[0].activities[0].tasks[1], status: 'blocked', description: 'Conclua a revisão primeiro.' }
    expect(coachReply('Porque está bloqueada?', blocked, 'gestor')).toContain('Conclua a revisão primeiro.')
    expect(coachReply('Qual é a previsão do tempo?', blocks, 'gestor')).toContain('respostas limitadas')
    expect(coachReply('Explique os blocos', blocks, '')).toContain('Criação de empresas')
  })
})

it('usa destinos injectados só para a actividade e tarefas referidas', async () => {
  const { coachLinks } = await import('./CoachRepository')
  const context = structuredClone(blocks)
  context[0].activities[0].href = '/actividade'
  context[0].activities[0].tasks[1].href = '/actividade?tarefa=relatorio'
  const result = coachLinks(coachReply('Qual é a próxima tarefa?', context, 'gestor'), context)
  expect(result.map(link => link.href)).toEqual(['/actividade?tarefa=relatorio', '/actividade'])
  expect(coachLinks('Não conheço essa actividade.', context)).toEqual([])
})
