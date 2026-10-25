import type { Company, TeacherActivity } from '../types'

type Task = NonNullable<TeacherActivity['tasks']>[number]

export function QuizParticipantResults({ task, participants }: { task: Task; participants: Company['participants'] }) {
  const questions = task.questions ?? []
  return <section aria-label={`Resultados por participante: ${task.title}`} className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-sm">
    <h5 className="mb-2 font-semibold">Resultados por participante</h5>
    <ul className="divide-y divide-blue-100">{participants.map(person => {
      const result = task.quizResults?.find(item => item.participantId === person.id)
      const correct = questions.filter(question => result?.answers[question.id] === question.correct).length
      return <li key={person.id} className="py-2">
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{person.name}</span>{!result && <span className="text-slate-500">Não concluído</span>}</div>
        {result && questions.length > 0 && <details className="mt-1">
          <summary className="cursor-pointer text-blue-700 focus-visible:outline-2">Pontuação: {correct}/{questions.length} ({Math.round(correct / questions.length * 100)}%) · Ver respostas</summary>
          <ol className="mt-3 space-y-3">{questions.map(question => <li key={question.id}><p className="font-medium">{question.prompt}</p><p>Resposta: {question.options[result.answers[question.id]] ?? 'Sem resposta'}</p><p className="text-xs text-slate-600">{result.answers[question.id] === question.correct ? 'Correcta' : `Resposta correcta: ${question.options[question.correct]}`}</p></li>)}</ol>
        </details>}
      </li>
    })}</ul>
  </section>
}
