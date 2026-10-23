import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const baseDir = "/Users/vali/Documents/Dev/SPEE Helpdesk Analysis/outputs/spee_helpdesk_chats_20260630";
const workbookPath = path.join(baseDir, "spee_helpdesk_chats_consolidado.xlsx");
const outputPath = path.join(baseDir, "analysis_results.json");

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const convValues = workbook.worksheets.getItem("Conversas").getRange("A1:S577").values;
const msgValues = workbook.worksheets.getItem("Mensagens").getRange("A1:N2706").values;

function toObjects(values) {
  const headers = values[0].map(String);
  return values.slice(1).map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])));
}

const conversations = toObjects(convValues);
const messages = toObjects(msgValues);
const messagesByChat = new Map();
for (const message of messages) {
  if (!messagesByChat.has(message.chat_id)) messagesByChat.set(message.chat_id, []);
  messagesByChat.get(message.chat_id).push(message);
}

const normalise = (value) => String(value ?? "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

function pct(n, d, digits = 1) {
  return d ? Number((n * 100 / d).toFixed(digits)) : 0;
}

function median(values) {
  const clean = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!clean.length) return null;
  const mid = Math.floor(clean.length / 2);
  return clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
}

function percentile(values, p) {
  const clean = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!clean.length) return null;
  const index = (clean.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return clean[lower];
  return clean[lower] + (clean[upper] - clean[lower]) * (index - lower);
}

function countBy(items, keyFn) {
  const counts = new Map();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts].sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}

function topEntries(counts, n = 10) {
  const entries = counts instanceof Map ? [...counts] : Object.entries(counts);
  return entries.sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, n);
}

const topicDefs = [
  ["Acesso, conta e senha", /\b(acesso|aceder|entrar|login|senha|password|palavra[- ]?passe|codigo|codico|c[oó]digo|conta|email|e-mail)\b/i],
  ["Registo, cadastro e dados", /\b(cadastro|cadastrar|registo|registrar|dados|nome|aparece|aparecem|reconhecido|reconhecidos|lista|inscri[cç][aã]o)\b/i],
  ["Sócios, convites e empresa", /\b(s[oó]cio|socia|socios|s[oó]cios|convite|aceitar|empresa|empreendedor|empreendedores|constitui[cç][aã]o|eliminar|editar|alterar)\b/i],
  ["Plano de negócio e pitch", /\b(plano de negocio|plano de neg[oó]cio|plano|pitch|canvas|preencher|preenchido)\b/i],
  ["Operações simuladas", /\b(activo|activo|minimos|mínimos|loja|lojas|contrato|contratos|arrendar|imobiliaria|imobili[aá]ria|licen[cç]a|alvar[aá]|concurso|financiamento|emprestimo|empr[eé]stimo|fornecedor|comprar|vender)\b/i],
  ["Pagamentos e facturação", /\b(pagamento|pagar|factura|fatura|taxa|valor|recibo|saldo|capital)\b/i],
  ["Turmas e gestão pedagógica", /\b(turma|turmas|docente|professor|aluno|alunos|estudante|estudantes|semestre|ciclo|grupo|grupos)\b/i],
  ["Erro técnico ou bloqueio", /\b(erro|problema|nao funciona|não funciona|bloquead|trava|carrega|falha|nao abre|não abre|nao aparece|não aparece|nao aceita|não aceita|bug)\b/i],
  ["Orientação de navegação", /\b(como|onde|qual|o que faco|o que faço|passo|ajuda|orientar|explicar|opcao|opção)\b/i],
  ["Evidência/diagnóstico pedido", /\b(print|screenshot|imagem|envie|mandar|partilha|anexo|verificar|aguarde|dados da empresa)\b/i],
];

const sentimentLexicon = {
  negative: [
    [/nao consigo|não consigo/g, 3],
    [/nao aparece|não aparece|nao aparecem|não aparecem/g, 3],
    [/nao aceita|não aceita|nao aceite|não aceite/g, 3],
    [/erro|problema|problemas|dificuldade|dificuldades/g, 2],
    [/bloquead|falha|nao funciona|não funciona|nao abre|não abre|nao entra|não entra/g, 2],
    [/perdi|errado|errada|urgente|impossivel|impossível/g, 2],
    [/nao sei|não sei|onde entro|como faco|como faço|o que faco|o que faço/g, 1],
    [/sem sucesso|nao da|não dá|nao deixa|não deixa/g, 2],
  ],
  positive: [
    [/obrigad[ao]|grato|grata|agrade[çc]o/g, 2],
    [/resolvid|consegui|deu certo|funcionou|perfeito|excelente/g, 3],
    [/\bok\b|\bcerto\b|\bsim\b/g, 1],
  ],
  confusion: [
    [/nao percebi|não percebi|nao sei|não sei|onde|como|qual|d[uú]vida|duvidas|dúvidas|explicar/g, 1],
  ],
  urgency: [
    [/urgente|preciso|necessito|pe[çc]o|por favor|ajuda|ajudar/g, 1],
  ],
};

const greetingOnly = /^(bom dia|boa tarde|boa noite|boa|ola|olá|ok|sim|certo|obrigad[ao])[\s!.]*$/i;

function sentiment(text) {
  const t = normalise(text);
  let negative = 0;
  let positive = 0;
  let confusion = 0;
  let urgency = 0;
  for (const [re, weight] of sentimentLexicon.negative) {
    negative += (t.match(re) ?? []).length * weight;
  }
  for (const [re, weight] of sentimentLexicon.positive) {
    positive += (t.match(re) ?? []).length * weight;
  }
  for (const [re, weight] of sentimentLexicon.confusion) {
    confusion += (t.match(re) ?? []).length * weight;
  }
  for (const [re, weight] of sentimentLexicon.urgency) {
    urgency += (t.match(re) ?? []).length * weight;
  }
  if (greetingOnly.test(t)) positive = Math.min(positive, 1);
  const score = positive - negative;
  let label = "Neutro";
  if (negative >= 3 && positive >= 2) label = "Misto";
  else if (score <= -2 || negative >= 3) label = "Negativo";
  else if (score >= 2 || positive >= 3) label = "Positivo";
  return { label, score, negative, positive, confusion, urgency };
}

function classifyConversation(conversation) {
  const chatMessages = messagesByChat.get(conversation.chat_id) ?? [];
  const visitorText = chatMessages
    .filter((m) => m.sender_type === "v")
    .map((m) => analysisText(m.texto_original))
    .join("\n");
  const name = String(conversation.visitante_nome ?? "");
  const nName = normalise(name);
  const nText = normalise(visitorText);

  const explicitDocente = /\[docente\]|(^|[\s/,-])(docente|professor|professora|formador|formadora)([\s/,-]|$)/.test(nName)
    || /\bsou (docente|professor|professora|formador|formadora)\b|\bdocente de\b|\bmeus alunos\b|\bminhas turmas\b|\bminha turma\b|\bturmas que lecciono\b/.test(nText);
  if (explicitDocente) {
    return { group: "Docentes", confidence: "alta", evidence: "marcador explícito de docente/professor/turma" };
  }

  const explicitAluno = /\bsou (estudante|aluno|aluna)\b|\bestudante da turma\b|\baluno da turma\b|\bminha turma\b|\bmeu grupo\b|\bnosso grupo\b/.test(nText);
  if (explicitAluno) {
    return { group: "Alunos", confidence: "alta", evidence: "marcador explícito de estudante/aluno/turma/grupo" };
  }

  const likelyAluno = /\b(socio|socia|socios|convite|minha empresa|nossa empresa|pitch|plano de negocio|plano de negocio|activos minimos|ativos minimos|lojas online|cadastro da escola|empreendedor|empreendedores)\b/.test(nText);
  if (likelyAluno) {
    return { group: "Alunos", confidence: "media", evidence: "contexto de actividade estudantil/empresa simulada" };
  }

  return { group: "Visitantes indeterminados", confidence: "baixa", evidence: "sem marcador suficiente" };
}

function topicsForText(text) {
  const topics = [];
  for (const [label, re] of topicDefs) {
    if (re.test(text)) topics.push(label);
  }
  return topics;
}

function primaryTopic(text) {
  const topics = topicsForText(text);
  if (!topics.length) return "Outro/indeterminado";
  const priority = [
    "Acesso, conta e senha",
    "Registo, cadastro e dados",
    "Sócios, convites e empresa",
    "Operações simuladas",
    "Plano de negócio e pitch",
    "Pagamentos e facturação",
    "Turmas e gestão pedagógica",
    "Erro técnico ou bloqueio",
    "Orientação de navegação",
    "Evidência/diagnóstico pedido",
  ];
  return priority.find((topic) => topics.includes(topic)) ?? topics[0];
}

function parseExcelDate(value) {
  if (!Number.isFinite(Number(value))) return null;
  return (Number(value) - 25569) * 86400000;
}

function sanitize(text) {
  return String(text ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, "[telefone]")
    .replace(/Nome\s*:\s*[^\n\r]+/gi, "Nome: [omitido]")
    .replace(/Telefone\s*:\s*[^\n\r]+/gi, "Telefone: [omitido]")
    .replace(/E-mail\s*:\s*[^\n\r]+/gi, "E-mail: [omitido]")
    .replace(/Email\s*:\s*[^\n\r]+/gi, "Email: [omitido]")
    .replace(/\b[0-9a-f]{5,12}\b/gi, "[codigo]")
    .replace(/\s+/g, " ")
    .trim();
}

function analysisText(text) {
  return String(text ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, " ")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, " ")
    .replace(/^\s*Nome\s*:\s*.*$/gim, " ")
    .replace(/^\s*Telefone\s*:\s*.*$/gim, " ")
    .replace(/^\s*E-mail\s*:\s*.*$/gim, " ")
    .replace(/^\s*Email\s*:\s*.*$/gim, " ")
    .replace(/Descri[cç][aã]o do Problema\s*:/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const conversationDerived = conversations.map((conversation) => {
  const chatMessages = (messagesByChat.get(conversation.chat_id) ?? []).sort((a, b) => Number(a.numero_mensagem) - Number(b.numero_mensagem));
  const visitorMessages = chatMessages.filter((m) => m.sender_type === "v" && String(m.texto_original ?? "").trim());
  const assistantMessages = chatMessages.filter((m) => m.sender_type === "a" && String(m.texto_original ?? "").trim());
  const visitorText = visitorMessages.map((m) => analysisText(m.texto_original)).join("\n");
  const allText = chatMessages.map((m) => analysisText(m.texto_original)).join("\n");
  const group = classifyConversation(conversation);
  const s = sentiment(visitorText);
  const firstVisitorTime = visitorMessages.length ? parseExcelDate(visitorMessages[0].message_time_excel) : null;
  const firstAssistant = firstVisitorTime === null
    ? null
    : assistantMessages.find((m) => {
      const t = parseExcelDate(m.message_time_excel);
      return t !== null && t >= firstVisitorTime;
    });
  const firstAssistantTime = firstAssistant ? parseExcelDate(firstAssistant.message_time_excel) : null;
  const responseMinutes = firstAssistantTime !== null && firstVisitorTime !== null
    ? (firstAssistantTime - firstVisitorTime) / 60000
    : null;
  const topicList = topicsForText(visitorText);
  return {
    ...conversation,
    group: group.group,
    groupConfidence: group.confidence,
    groupEvidence: group.evidence,
    visitorText,
    allText,
    primaryTopic: primaryTopic(visitorText),
    topics: topicList,
    sentiment: s.label,
    sentimentScore: s.score,
    negativeSignals: s.negative,
    positiveSignals: s.positive,
    confusionSignals: s.confusion,
    urgencySignals: s.urgency,
    visitorMessageCount: visitorMessages.length,
    assistantMessageCount: assistantMessages.length,
    hasAssistant: assistantMessages.length > 0,
    firstResponseMinutes: responseMinutes,
    firstVisitorExcerpt: sanitize(visitorMessages[0]?.texto_original ?? ""),
    finalVisitorExcerpt: sanitize(visitorMessages[visitorMessages.length - 1]?.texto_original ?? ""),
    assistantExcerpt: sanitize(assistantMessages[0]?.texto_original ?? ""),
  };
});

const messageDerived = messages.map((message) => {
  const conversation = conversationDerived.find((c) => c.chat_id === message.chat_id);
  const group = message.sender_type === "a" ? "Assistentes helpdesk" : conversation?.group ?? "Visitantes indeterminados";
  const cleanText = analysisText(message.texto_original);
  const s = sentiment(cleanText);
  const topics = topicsForText(cleanText);
  return {
    ...message,
    group,
    sentiment: s.label,
    sentimentScore: s.score,
    negativeSignals: s.negative,
    positiveSignals: s.positive,
    confusionSignals: s.confusion,
    urgencySignals: s.urgency,
    primaryTopic: primaryTopic(cleanText),
    topics,
    sanitized: sanitize(message.texto_original),
  };
});

const groupOrder = ["Docentes", "Alunos", "Assistentes helpdesk", "Visitantes indeterminados"];
function groupStats() {
  const stats = {};
  for (const group of groupOrder) {
    const groupConvs = group === "Assistentes helpdesk"
      ? conversationDerived.filter((c) => c.hasAssistant)
      : conversationDerived.filter((c) => c.group === group);
    const groupMessages = messageDerived.filter((m) => m.group === group && String(m.texto_original ?? "").trim());
    const sentimentCounts = countBy(groupMessages, (m) => m.sentiment);
    const convSentimentCounts = countBy(groupConvs, (c) => c.sentiment);
    const topicMap = new Map();
    for (const c of groupConvs) {
      const topics = c.topics.length ? c.topics : ["Outro/indeterminado"];
      for (const topic of new Set(topics)) topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
    }
    const responseTimes = groupConvs.map((c) => c.firstResponseMinutes).filter((v) => Number.isFinite(v) && v >= 0);
    stats[group] = {
      conversations: groupConvs.length,
      messages: groupMessages.length,
      messageSentimentCounts: sentimentCounts,
      messageSentimentPct: Object.fromEntries(Object.entries(sentimentCounts).map(([k, v]) => [k, pct(v, groupMessages.length)])),
      conversationSentimentCounts: convSentimentCounts,
      conversationSentimentPct: Object.fromEntries(Object.entries(convSentimentCounts).map(([k, v]) => [k, pct(v, groupConvs.length)])),
      topTopics: topEntries(topicMap, 10).map(([topic, count]) => ({ topic, count, pct: pct(count, groupConvs.length) })),
      medianResponseMinutes: median(responseTimes),
      p75ResponseMinutes: percentile(responseTimes, 0.75),
      responseCoverage: { withResponse: responseTimes.length, pct: pct(responseTimes.length, groupConvs.length) },
      medianMessagesPerConversation: median(groupConvs.map((c) => Number(c.message_count_real))),
      medianDurationMinutes: median(groupConvs.map((c) => Number(c.duracao_chat_seg) / 60)),
      confidence: group === "Assistentes helpdesk"
        ? "directa por sender_type"
        : countBy(groupConvs, (c) => c.groupConfidence),
    };
  }
  return stats;
}

const totalConvs = conversationDerived.length;
const totalMessages = messageDerived.length;
const visitorConvs = conversationDerived.filter((c) => c.group !== "Visitantes indeterminados");
const allResponseTimes = conversationDerived.map((c) => c.firstResponseMinutes).filter((v) => Number.isFinite(v) && v >= 0);
const noAssistant = conversationDerived.filter((c) => !c.hasAssistant);
const topicMapAll = new Map();
for (const c of conversationDerived) {
  const topics = c.topics.length ? c.topics : ["Outro/indeterminado"];
  for (const topic of new Set(topics)) topicMapAll.set(topic, (topicMapAll.get(topic) ?? 0) + 1);
}

const domainCounts = countBy(conversationDerived, (c) => c.dominio);
const monthlyCounts = countBy(conversationDerived, (c) => String(c.data_pasta).slice(0, 7));
const monthlyNegative = {};
for (const [month, count] of Object.entries(monthlyCounts)) {
  const rows = conversationDerived.filter((c) => String(c.data_pasta).slice(0, 7) === month);
  monthlyNegative[month] = {
    conversations: count,
    negative: rows.filter((c) => c.sentiment === "Negativo").length,
    pctNegative: pct(rows.filter((c) => c.sentiment === "Negativo").length, rows.length),
  };
}

const assistantNames = countBy(messageDerived.filter((m) => m.sender_type === "a"), (m) => m.sender_name || "(sem nome)");
const ratings = messageDerived.filter((m) => m.message_type === "rating").map((m) => {
  try {
    return JSON.parse(m.data_json).rating;
  } catch {
    return null;
  }
}).filter((v) => v !== null);

function statsForConversations(rows) {
  const times = rows.map((c) => c.firstResponseMinutes).filter((v) => Number.isFinite(v) && v >= 0);
  return {
    conversations: rows.length,
    sentimentCounts: countBy(rows, (c) => c.sentiment),
    negative: rows.filter((c) => c.sentiment === "Negativo").length,
    pctNegative: pct(rows.filter((c) => c.sentiment === "Negativo").length, rows.length),
    withResponse: times.length,
    responseCoveragePct: pct(times.length, rows.length),
    medianResponseMinutes: median(times),
    medianMessages: median(rows.map((c) => Number(c.message_count_real))),
    medianDurationMinutes: median(rows.map((c) => Number(c.duracao_chat_seg) / 60)),
  };
}

const domainStats = {};
for (const domain of Object.keys(domainCounts)) {
  domainStats[domain] = statsForConversations(conversationDerived.filter((c) => c.dominio === domain));
}

const assistantStats = {};
for (const name of Object.keys(assistantNames)) {
  const msgRows = messageDerived.filter((m) => m.sender_type === "a" && (m.sender_name || "(sem nome)") === name);
  const chatIds = new Set(msgRows.map((m) => m.chat_id));
  const convRows = conversationDerived.filter((c) => chatIds.has(c.chat_id));
  assistantStats[name] = {
    messages: msgRows.length,
    conversations: convRows.length,
    messageSentimentCounts: countBy(msgRows, (m) => m.sentiment),
    messageSentimentPct: Object.fromEntries(Object.entries(countBy(msgRows, (m) => m.sentiment)).map(([k, v]) => [k, pct(v, msgRows.length)])),
    topTopics: (() => {
      const topicMap = new Map();
      for (const c of convRows) {
        const topics = c.topics.length ? c.topics : ["Outro/indeterminado"];
        for (const topic of new Set(topics)) topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
      }
      return topEntries(topicMap, 6).map(([topic, count]) => ({ topic, count, pct: pct(count, convRows.length) }));
    })(),
  };
}

function chooseExample(predicate) {
  const found = conversationDerived.find(predicate);
  if (!found) return null;
  return {
    chat_id: found.chat_id,
    group: found.group,
    sentiment: found.sentiment,
    primaryTopic: found.primaryTopic,
    excerpt: found.firstVisitorExcerpt.slice(0, 420),
    response: found.assistantExcerpt.slice(0, 260),
  };
}

const examples = {
  alunoAcesso: chooseExample((c) => c.group === "Alunos" && c.topics.includes("Acesso, conta e senha") && c.sentiment === "Negativo"),
  alunoSocio: chooseExample((c) => c.group === "Alunos" && c.topics.includes("Sócios, convites e empresa") && c.sentiment === "Negativo"),
  alunoPlano: chooseExample((c) => c.group === "Alunos" && c.topics.includes("Plano de negócio e pitch")),
  docenteExplicito: chooseExample((c) => c.group === "Docentes"),
  operacao: chooseExample((c) => c.topics.includes("Operações simuladas") && c.sentiment === "Negativo"),
  pagamento: chooseExample((c) => c.topics.includes("Pagamentos e facturação")),
  semResposta: chooseExample((c) => !c.hasAssistant && c.sentiment === "Negativo"),
};

const negativeByTopic = {};
for (const [topic] of topicDefs) {
  const rows = conversationDerived.filter((c) => c.topics.includes(topic));
  negativeByTopic[topic] = {
    conversations: rows.length,
    negative: rows.filter((c) => c.sentiment === "Negativo").length,
    pctNegative: pct(rows.filter((c) => c.sentiment === "Negativo").length, rows.length),
    medianMessages: median(rows.map((c) => Number(c.message_count_real))),
    medianDurationMinutes: median(rows.map((c) => Number(c.duracao_chat_seg) / 60)),
  };
}

const responseByTopic = {};
for (const [topic] of topicDefs) {
  const rows = conversationDerived.filter((c) => c.topics.includes(topic));
  const times = rows.map((c) => c.firstResponseMinutes).filter((v) => Number.isFinite(v) && v >= 0);
  responseByTopic[topic] = {
    conversations: rows.length,
    withResponse: times.length,
    responseCoveragePct: pct(times.length, rows.length),
    medianResponseMinutes: median(times),
    p75ResponseMinutes: percentile(times, 0.75),
  };
}

const initialFinal = {};
for (const group of ["Docentes", "Alunos", "Visitantes indeterminados"]) {
  const rows = conversationDerived.filter((c) => c.group === group);
  let improved = 0;
  let worsened = 0;
  let same = 0;
  for (const c of rows) {
    const visitorMessages = (messagesByChat.get(c.chat_id) ?? []).filter((m) => m.sender_type === "v" && String(m.texto_original).trim());
    if (visitorMessages.length < 2) continue;
    const first = sentiment(visitorMessages[0].texto_original).score;
    const last = sentiment(visitorMessages[visitorMessages.length - 1].texto_original).score;
    if (last > first) improved += 1;
    else if (last < first) worsened += 1;
    else same += 1;
  }
  const denom = improved + worsened + same;
  initialFinal[group] = { compared: denom, improved, worsened, same, improvedPct: pct(improved, denom), worsenedPct: pct(worsened, denom) };
}

const results = {
  source: workbookPath,
  asOf: new Date().toISOString(),
  totals: {
    conversations: totalConvs,
    messages: totalMessages,
    visitorMessages: messageDerived.filter((m) => m.sender_type === "v").length,
    assistantMessages: messageDerived.filter((m) => m.sender_type === "a").length,
    nonEmptyVisitorMessages: messageDerived.filter((m) => m.sender_type === "v" && String(m.texto_original).trim()).length,
    nonEmptyAssistantMessages: messageDerived.filter((m) => m.sender_type === "a" && String(m.texto_original).trim()).length,
    periodStart: conversationDerived.map((c) => c.created_on_utc).sort()[0],
    periodEnd: conversationDerived.map((c) => c.created_on_utc).sort().at(-1),
    withAssistant: conversationDerived.filter((c) => c.hasAssistant).length,
    withoutAssistant: noAssistant.length,
    responseCoveragePct: pct(conversationDerived.filter((c) => c.hasAssistant).length, totalConvs),
    medianFirstResponseMinutes: median(allResponseTimes),
    p75FirstResponseMinutes: percentile(allResponseTimes, 0.75),
    medianMessagesPerConversation: median(conversationDerived.map((c) => Number(c.message_count_real))),
    medianDurationMinutes: median(conversationDerived.map((c) => Number(c.duracao_chat_seg) / 60)),
  },
  groups: groupStats(),
  groupConversationCounts: countBy(conversationDerived, (c) => c.group),
  groupConfidence: countBy(conversationDerived, (c) => `${c.group}:${c.groupConfidence}`),
  domains: topEntries(domainCounts, 10).map(([domain, count]) => ({ domain, count, pct: pct(count, totalConvs) })),
  domainStats,
  monthly: Object.fromEntries(Object.entries(monthlyNegative).sort(([a], [b]) => a.localeCompare(b))),
  topicsOverall: topEntries(topicMapAll, 20).map(([topic, count]) => ({ topic, count, pct: pct(count, totalConvs), ...negativeByTopic[topic], ...responseByTopic[topic] })),
  negativeByTopic,
  responseByTopic,
  assistantNames: topEntries(assistantNames, 10).map(([name, count]) => ({ name, count, pct: pct(count, messageDerived.filter((m) => m.sender_type === "a").length) })),
  assistantStats,
  ratings: {
    count: ratings.length,
    positive: ratings.filter((r) => r > 0).length,
    negative: ratings.filter((r) => r < 0).length,
    neutral: ratings.filter((r) => r === 0).length,
  },
  sentimentOverallByConversation: countBy(conversationDerived, (c) => c.sentiment),
  sentimentOverallByMessage: countBy(messageDerived.filter((m) => String(m.texto_original).trim()), (m) => m.sentiment),
  initialFinal,
  examples,
  unansweredExamples: noAssistant.slice(0, 8).map((c) => ({
    chat_id: c.chat_id,
    group: c.group,
    sentiment: c.sentiment,
    topic: c.primaryTopic,
    excerpt: c.firstVisitorExcerpt.slice(0, 260),
  })),
};

await fs.writeFile(outputPath, JSON.stringify(results, null, 2), "utf8");
console.log(JSON.stringify({
  outputPath,
  totals: results.totals,
  groupConversationCounts: results.groupConversationCounts,
  groupConfidence: results.groupConfidence,
  topicsOverall: results.topicsOverall.slice(0, 8),
  ratings: results.ratings,
}, null, 2));
