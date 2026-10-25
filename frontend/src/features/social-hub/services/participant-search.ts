import type { SocialSnapshot } from '../schemas/social.schema'

const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-PT')

export function searchParticipants(members: SocialSnapshot['members'], query: string) {
  const search = normalize(query).trim()
  const classFilter = search.match(/\bturma\s+(\S+)/)?.[1]
  const terms = search.replace(/\bturma\s+\S+/, '').trim().split(/\s+/).filter(Boolean)
  return members.filter(member => {
    if (classFilter && !normalize(member.className).includes(`turma ${classFilter}`)) return false
    const text = normalize(`${member.name} ${member.className}`)
    return terms.every(term => text.includes(term))
  })
}
