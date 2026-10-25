import type { ConversationGateway, JourneyRepository, TeacherMessage } from '@/features/student-journey'
import type { TeacherRepository } from '@/features/teacher-mission-control'

/** Explicit composition: only the teacher channel crosses feature boundaries. */
export function createStudentConversations(student: JourneyRepository, teacher: TeacherRepository, companyId?: string): ConversationGateway {
  return {
    async read() {
      const [journey, snapshot] = await Promise.all([student.getSnapshot(), teacher.getSnapshot()])
      const company = snapshot.companies.find(c => companyId ? c.id === companyId : c.linkedToStudent)
      if (!company) return []
      const messages: TeacherMessage[] = snapshot.orientationRequests.filter(r => r.companyId === company.id).flatMap(r => r.messages.map(m => ({ id: m.id, activityId: r.activityId, author: m.author, message: m.message, createdAt: m.occurredAt, incoming: m.role === 'teacher' })))
      for (const note of snapshot.orientations.filter(n => n.companyId === company.id && n.status === 'recorded')) messages.push({ id: note.id, activityId: note.activityId, author: note.author, message: note.subject + '\n' + note.message, createdAt: note.updatedAt, incoming: true })
      for (const note of snapshot.generalOrientations.filter(n => n.classIds.includes(company.classId) && (!n.companyIds || n.companyIds.includes(company.id)))) {
        // Compatibility with the original free-text demo orientation, before the dropdown.
        const title = note.activity === 'Processamento de salários' ? 'Processar salários' : note.activity
        const activity = journey.blocks.flatMap(b => b.activities).find(a => a.title === title)
        if (activity) messages.push({ id: note.id, activityId: activity.id, author: note.author, message: note.subject + '\n' + note.message, createdAt: note.createdAt, incoming: true })
      }
      const activities = new Set(journey.blocks.flatMap(block => block.activities.map(activity => activity.id)))
      return messages.filter(message => activities.has(message.activityId)).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    },
    async send(activityId, message) {
      const [journey, snapshot] = await Promise.all([student.getSnapshot(), teacher.getSnapshot()])
      const company = snapshot.companies.find(c => companyId ? c.id === companyId : c.linkedToStudent)
      if (!company) throw new Error('Empresa não encontrada.')
      await teacher.receiveStudentMessage(company.id, activityId, journey.context.studentName, message, snapshot.revision)
    },
  }
}
