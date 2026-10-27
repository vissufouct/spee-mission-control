export interface CoachTask { href?: string; title: string; description: string; kind: string; status: string }
export interface CoachActivity { href?: string; id: string; title: string; description: string; tasks: CoachTask[] }
export interface CoachBlock { title: string; activities: CoachActivity[] }
export interface CoachRepository { getContext(): Promise<CoachBlock[]> }
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const states: Record<string, string> = { completed: 'Concluído', 'in-progress': 'Em curso', 'not-started': 'Por iniciar', blocked: 'Bloqueado' }
export function coachReply(question: string, blocks: CoachBlock[], activityId: string): string {
  const text = normalize(question)
  if (/blocos|roteiro|simulacao|percurso completo/.test(text)) return 'O roteiro organiza o trabalho em blocos:\n\n' + blocks.map((b, i) => `${i + 1}. ${b.title}: ${b.activities.length ? b.activities.map(a => a.title).join('; ') : 'conteúdo ainda por definir'}.`).join('\n\n') + '\n\nCada actividade agrupa tarefas. Consulte os materiais, realize as operações e submeta as evidências pedidas; os estados só mudam após confirmação.'
  const activities = blocks.flatMap(b => b.activities)
  const mentioned = activities.find(a => text.includes(normalize(a.title)))
  const activity = mentioned ?? activities.find(a => a.id === activityId)
  if (!activity) return 'Escolha uma actividade para obter orientação sobre as suas tarefas ou pergunte pelos blocos do roteiro.'
  const prefix = `Actividade: ${activity.title}\n${activity.description}\n\n`
  const task = activity.tasks.find(t => text.includes(normalize(t.title)))
  if (task) return prefix + `${task.title} — ${states[task.status] ?? task.status}\n${task.description}\n\nConsulte as instruções e confirme o resultado no formulário da tarefa. Esta conversa não conclui tarefas.`
  if (/bloque|condic|depend/.test(text)) {
    const blocked = activity.tasks.filter(t => t.status === 'blocked')
    return prefix + (blocked.length ? blocked.map(t => `${t.title}: ${t.description}`).join('\n\n') : 'Não há tarefas bloqueadas nesta actividade. Pode consultar as tarefas pendentes e os respectivos materiais.')
  }
  if (/proxim|comec|continu|ajud|fazer/.test(text)) {
    const next = activity.tasks.find(t => t.status === 'in-progress') ?? activity.tasks.find(t => t.status === 'not-started')
    return prefix + (next ? `Sugiro começar por «${next.title}».\n${next.description}\n\n${next.kind === 'quiz' ? 'Consulte os materiais e responda ao quiz pelas suas próprias palavras; use o resultado para identificar o que precisa de rever.' : next.kind === 'evidence' ? 'Prepare o documento solicitado, verifique o formato e submeta-o na tarefa. Submissão não equivale a aprovação do docente.' : 'Abra a tarefa, consulte as instruções e confirme a operação quando tiver terminado.'}` : activity.tasks.some(t => t.status === 'blocked') ? 'As tarefas restantes estão bloqueadas. Consulte as condições antes de avançar.' : 'As tarefas desta actividade estão concluídas. Consulte o percurso para conhecer as actividades seguintes.')
  }
  if (/tarefa|material|quiz|evidencia/.test(text)) return prefix + activity.tasks.map(t => `• ${t.title} — ${states[t.status] ?? t.status}\n${t.description}`).join('\n\n')
  return prefix + 'Sou um coach simulado com respostas limitadas ao roteiro. Posso explicar os blocos, listar as tarefas e materiais, identificar a próxima tarefa ou ajudar a compreender bloqueios. Para uma dúvida específica que não esteja nas instruções, peça orientação ao docente.'
}

export interface CoachLink { label: string; href: string }
/** Only composition-supplied destinations are used; no URLs are inferred from prose. */
export function coachLinks(answer: string, blocks: CoachBlock[]): CoachLink[] {
  const links: CoachLink[] = []
  for (const activity of blocks.flatMap(block => block.activities)) {
    if (!answer.startsWith(`Actividade: ${activity.title}\n`)) continue
    for (const task of activity.tasks) {
      if (task.href && answer.includes(task.title)) links.push({ label: `${task.status === 'blocked' ? 'Ver condição' : 'Abrir tarefa'}: ${task.title}`, href: task.href })
    }
    if (activity.href) links.push({ label: `Ver actividade: ${activity.title}`, href: activity.href })
  }
  return links
}
