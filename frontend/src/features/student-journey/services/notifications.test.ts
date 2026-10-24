import { describe, expect, it } from 'vitest'
import fixture from '@/data/student-journey.fixture.json'
import { journeySnapshotSchema, supportMaterialSchema } from '../schemas/journey.schema'
import { pendingNotifications } from './notifications'
describe('pré-visualizações pendentes', () => {
  it('filtra destinatário, resolução e actividade antes de ordenar', () => {
    const snapshot = journeySnapshotSchema.parse(fixture)
    snapshot.resolvedNotifications = [{ id: 'resolvida', recipient: snapshot.context.studentName }]
    const messages = ['antiga', 'resolvida', 'recente', 'propria'].map((id, i) => ({ id, activityId: 'registar-empresa', author: 'Vali Issufo', message: id, incoming: id !== 'propria', createdAt: new Date(2026, 9, 24, 10, i).toISOString() }))
    const pending = pendingNotifications(snapshot, messages, 'registar-empresa')
    expect(pending.teacher.map(m => m.id)).toEqual(['recente', 'antiga'])
    expect(pending.teacher.every(m => m.activityTitle === 'Registar empresa')).toBe(true)
    expect(pending.group[0].activityTitle).toBe('Registar empresa')
    expect(pending.group.map(m => m.id)).toEqual(['grupo-documentos'])
    expect(pendingNotifications(snapshot, messages, 'ano1-2').teacher).toEqual([])
    expect(messages[0].id).toBe('antiga')
    snapshot.context.studentName = 'João Tembe'
    expect(pendingNotifications(snapshot, messages).teacher.some(m => m.id === 'resolvida')).toBe(true)
  })
  it('aceita recursos seguros e rejeita links executáveis', () => {
    const material = { title: 'Guia', description: '', format: 'pdf' }
    expect(supportMaterialSchema.safeParse({ ...material, href: 'https://example.org/guia.pdf' }).success).toBe(true)
    expect(supportMaterialSchema.safeParse({ ...material, href: 'javascript:alert(1)' }).success).toBe(false)
  })
})
