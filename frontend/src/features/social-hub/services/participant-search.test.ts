import { expect, it } from 'vitest'
import { searchParticipants } from './participant-search'
const members = [
  { id: 'joao', name: 'João Tembe', className: 'Turma A' },
  { id: 'celina', name: 'Celina Bila', className: 'Turma A' },
  { id: 'leila', name: 'Leila Faife', className: 'Turma B' },
]
it('pesquisa nomes sem acentos e separa a turma das letras dos apelidos', () => {
  expect(searchParticipants(members, '  JOAO turma A  ')).toEqual([members[0]])
  expect(searchParticipants(members, 'turma B')).toEqual([members[2]])
  expect(searchParticipants(members, 'inexistente')).toEqual([])
  expect(searchParticipants(members, 'tembe')).toEqual([members[0]])
  expect(searchParticipants(members, '')).toEqual(members)
})
