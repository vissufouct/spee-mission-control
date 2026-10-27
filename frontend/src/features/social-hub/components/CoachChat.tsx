import { useEffect, useRef, useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { useCoach } from '../hooks/useCoach'
export function CoachChat() {
  const { query, reply, available } = useCoach()
  const [activityId, setActivityId] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<{ role: 'coach' | 'student'; text: string }[]>([])
  const end = useRef<HTMLDivElement>(null)
  const activities = query.data?.flatMap(b => b.activities) ?? []
  const selected = activityId || activities[0]?.id || ''
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [messages, reply.isPending])
  async function send(question: string) {
    if (!question.trim() || reply.isPending) return
    try {
      const answer = await reply.mutateAsync({ question: question.trim(), activityId: selected })
      setMessages(previous => [...previous, { role: 'student', text: question.trim() }, { role: 'coach', text: answer }])
      setText('')
    } catch { /* Keep the draft; the mutation exposes the failure. */ }
  }
  return <section className="social-coach" aria-label="Coach IA simulado">
    <div className="social-coach-context"><h3><Bot size={20} />Coach IA <span>Simulação</span></h3><p>Orientação local sobre o roteiro. Não altera estados nem avalia o seu trabalho. A conversa mantém-se enquanto este separador estiver aberto.</p>
      {!available ? <p role="status">Contexto do roteiro indisponível.</p> : query.isPending ? <p role="status">A consultar o roteiro…</p> : query.isError ? <div role="alert">Não foi possível consultar o roteiro. <button onClick={() => { void query.refetch() }}>Tentar novamente</button></div> : <label>Actividade de referência<select value={selected} onChange={e => setActivityId(e.target.value)}>{query.data?.map(block => <optgroup key={block.title} label={block.title}>{block.activities.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}</optgroup>)}</select></label>}
    </div>
    <div className="social-hub-scroll"><div className="social-messages" role="log" aria-label="Conversa com o coach" aria-live="polite"><article className="social-message"><header><strong>Coach IA · Simulado</strong></header><p>Olá! Posso ajudar a compreender o roteiro, preparar uma tarefa e perceber o que falta para avançar. Escolha uma actividade e coloque a sua pergunta.</p></article>{messages.map((m, i) => <article key={i} className={`social-message${m.role === 'student' ? ' social-message--own' : ''}`}><header><strong>{m.role === 'coach' ? 'Coach IA · Simulado' : 'Eu'}</strong></header><p>{m.text}</p></article>)}</div>{reply.isPending && <p role="status">A preparar a orientação…</p>}<div ref={end} /></div>
    <form className="social-composer" onSubmit={e => { e.preventDefault(); void send(text) }}><div className="social-coach-suggestions">{['Explique os blocos do roteiro', 'Qual é a próxima tarefa?', 'Que materiais e tarefas tenho?', 'Porque está bloqueada?'].map(q => <button type="button" key={q} disabled={!query.data || reply.isPending} onClick={() => { void send(q) }}>{q}</button>)}</div><label htmlFor="coach-question">Pergunte ao coach</label><textarea id="coach-question" maxLength={2000} rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="Como posso preparar esta tarefa?" />{reply.isError && <p role="alert">Não foi possível responder. A pergunta foi preservada; tente novamente.</p>}<div className="social-compose-actions"><small>Respostas simuladas · sem IA externa</small><button className="social-send" disabled={!query.data || !text.trim() || reply.isPending}><Send size={14} /> Enviar</button></div></form>
  </section>
}
