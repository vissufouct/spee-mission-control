import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = "/Users/vali/Documents/Dev/SPEE Helpdesk Analysis";
const chatsDir = path.join(rootDir, "chats");
const outputDir = path.join(rootDir, "outputs", "spee_helpdesk_chats_20260630");
const previewDir = path.join(outputDir, "previews");
const outputPath = path.join(outputDir, "spee_helpdesk_chats_consolidado.xlsx");
const rawChunkSize = 32000;

function colName(index) {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function walkJson(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walkJson(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      out.push(fullPath);
    }
  }
  return out.sort();
}

function asDateOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function pathDateParts(relPath) {
  const parts = relPath.split(path.sep);
  const year = parts[0]?.replace("chats_", "") ?? "";
  const month = parts[1] ?? "";
  const day = parts[2] ?? "";
  return {
    folderYear: year,
    folderMonth: month,
    folderDay: day,
    folderDate: year && month && day ? `${year}-${month}-${day}` : "",
  };
}

function jsonText(value) {
  if (value === undefined || value === null) return "";
  return JSON.stringify(value);
}

function isoDisplay(value) {
  if (value === undefined || value === null || value === "") return "";
  return String(value).replace("T", " ").replace(/Z$/, " UTC");
}

function transcript(messages) {
  return messages.map((message, index) => {
    const senderType = message.sender?.t ?? "";
    const senderName = message.sender?.n ?? "";
    const sender = senderName ? `${senderType}:${senderName}` : senderType;
    const body = typeof message.msg === "string" ? message.msg : "";
    const payload = message.type === "rating" ? jsonText(message.data) : "";
    const extra = payload ? `\r\n${payload}` : "";
    return `[${index + 1}] ${message.time ?? ""} ${sender} ${message.type ?? ""}\r\n${body}${extra}`;
  }).join("\r\n\r\n");
}

function applyHeaderStyle(sheet, range, titleFill = "#1F4E78") {
  sheet.getRange(range).format = {
    fill: titleFill,
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
    verticalAlignment: "top",
  };
}

function setColumnWidths(sheet, rowCount, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, Math.max(rowCount, 1), 1).format.columnWidth = width;
  });
}

function addTable(sheet, rows, name) {
  const rowCount = rows.length;
  const colCount = rows[0].length;
  const rangeAddress = `A1:${colName(colCount - 1)}${rowCount}`;
  const table = sheet.tables.add(rangeAddress, true, name);
  table.showFilterButton = true;
  table.showBandedRows = true;
  return table;
}

function writeMatrix(sheet, rows) {
  const rowCount = rows.length;
  const colCount = rows[0].length;
  sheet.getRange(`A1:${colName(colCount - 1)}${rowCount}`).values = rows;
}

const files = await walkJson(chatsDir);
const conversations = [];
const messages = [];
const rawRows = [];
const invalidRows = [];
let totalBytes = 0;
let minCreated = "";
let maxCreated = "";
const monthlyCounts = new Map();

for (const fullPath of files) {
  const relPath = path.relative(chatsDir, fullPath);
  const raw = await fs.readFile(fullPath, "utf8");
  totalBytes += Buffer.byteLength(raw, "utf8");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    invalidRows.push([relPath, error.message, raw]);
    continue;
  }

  const parts = pathDateParts(relPath);
  const chatMessages = Array.isArray(parsed.messages) ? parsed.messages : [];
  const createdOn = parsed.createdOn ?? "";
  if (createdOn) {
    if (!minCreated || createdOn < minCreated) minCreated = createdOn;
    if (!maxCreated || createdOn > maxCreated) maxCreated = createdOn;
    const ym = createdOn.slice(0, 7);
    monthlyCounts.set(ym, (monthlyCounts.get(ym) ?? 0) + 1);
  }

  const chatId = parsed.id ?? path.basename(fullPath, ".json");
  conversations.push([
    chatId,
    relPath,
    parts.folderDate,
    isoDisplay(createdOn),
    asDateOrNull(createdOn),
    parsed.type ?? "",
    parsed.domain ?? "",
    parsed.pageId ?? "",
    parsed.visitor?.name ?? "",
    parsed.visitor?.id ?? "",
    parsed.visitor?.email ?? "",
    parsed.location?.countryCode ?? "",
    parsed.location?.city ?? "",
    parsed.messageCount ?? null,
    chatMessages.length,
    parsed.chatDuration ?? null,
    parsed.rating ?? null,
    transcript(chatMessages),
    raw.length,
  ]);

  chatMessages.forEach((message, index) => {
    messages.push([
      chatId,
      relPath,
      isoDisplay(createdOn),
      asDateOrNull(createdOn),
      index + 1,
      isoDisplay(message.time ?? ""),
      asDateOrNull(message.time),
      message.sender?.t ?? "",
      message.sender?.n ?? "",
      message.type ?? "",
      typeof message.msg === "string" ? message.msg : "",
      jsonText(message.attchs),
      jsonText(message.data),
      jsonText(message),
    ]);
  });

  const chunks = [];
  for (let start = 0; start < raw.length; start += rawChunkSize) {
    chunks.push(raw.slice(start, start + rawChunkSize));
  }
  chunks.forEach((chunk, index) => {
    rawRows.push([
      chatId,
      relPath,
      index + 1,
      chunks.length,
      chunk,
    ]);
  });
}

conversations.sort((a, b) => String(a[3]).localeCompare(String(b[3])) || String(a[1]).localeCompare(String(b[1])));
messages.sort((a, b) => String(a[2]).localeCompare(String(b[2])) || String(a[1]).localeCompare(String(b[1])) || a[4] - b[4]);
rawRows.sort((a, b) => String(a[1]).localeCompare(String(b[1])) || a[2] - b[2]);

const workbook = Workbook.create();

const summarySheet = workbook.worksheets.add("Resumo");
summarySheet.showGridLines = false;
const generatedAt = new Date().toISOString();
const monthlyRows = [...monthlyCounts.entries()].sort().map(([month, count]) => [month, count]);
const summaryRows = [
  ["SPEE Helpdesk - Export de chats consolidado", ""],
  ["Fonte", chatsDir],
  ["Gerado em", isoDisplay(generatedAt)],
  ["Ficheiros JSON lidos", files.length],
  ["Ficheiros JSON invalidos", invalidRows.length],
  ["Conversas", conversations.length],
  ["Mensagens", messages.length],
  ["Primeira conversa", isoDisplay(minCreated)],
  ["Ultima conversa", isoDisplay(maxCreated)],
  ["Bytes JSON totais", totalBytes],
  ["Folhas", "Conversas: metadados por chat; Mensagens: uma linha por mensagem com texto original; JSON Original: conteudo bruto do ficheiro."],
  ["", ""],
  ["Mes", "Conversas"],
  ...monthlyRows,
];
writeMatrix(summarySheet, summaryRows);
summarySheet.getRange("A1:B1").merge();
summarySheet.getRange("A1").format = {
  fill: "#17365D",
  font: { bold: true, color: "#FFFFFF", size: 15 },
};
summarySheet.getRange("A2:A11").format = { font: { bold: true }, fill: "#D9EAF7" };
applyHeaderStyle(summarySheet, "A13:B13");
summarySheet.getRange(`A13:B${summaryRows.length}`).format.borders = { preset: "outside", style: "thin", color: "#B7C9D6" };
summarySheet.getRange(`B14:B${summaryRows.length}`).format.numberFormat = "#,##0";
summarySheet.getRange("B4:B7").format.numberFormat = "#,##0";
summarySheet.getRange("B10").format.numberFormat = "#,##0";
setColumnWidths(summarySheet, summaryRows.length, [28, 130]);
summarySheet.freezePanes.freezeRows(13);

const conversationsSheet = workbook.worksheets.add("Conversas");
conversationsSheet.showGridLines = false;
const conversationHeaders = [
  "chat_id",
  "ficheiro_origem",
  "data_pasta",
  "created_on_utc",
  "created_on_excel",
  "tipo",
  "dominio",
  "page_id",
  "visitante_nome",
  "visitante_id",
  "visitante_email",
  "pais",
  "cidade",
  "message_count_export",
  "message_count_real",
  "duracao_chat_seg",
  "rating",
  "transcricao_completa",
  "json_caracteres",
];
writeMatrix(conversationsSheet, [conversationHeaders, ...conversations]);
applyHeaderStyle(conversationsSheet, `A1:${colName(conversationHeaders.length - 1)}1`);
addTable(conversationsSheet, [conversationHeaders, ...conversations], "TabelaConversas");
conversationsSheet.freezePanes.freezeRows(1);
conversationsSheet.freezePanes.freezeColumns(2);
conversationsSheet.getRange(`E2:E${conversations.length + 1}`).format.numberFormat = "yyyy-mm-dd hh:mm";
conversationsSheet.getRange(`N2:Q${conversations.length + 1}`).format.numberFormat = "#,##0";
conversationsSheet.getRange(`R2:R${conversations.length + 1}`).format = { wrapText: true, verticalAlignment: "top" };
conversationsSheet.getRange(`A1:${colName(conversationHeaders.length - 1)}${conversations.length + 1}`).format.borders = { preset: "outside", style: "thin", color: "#D9E2EA" };
setColumnWidths(conversationsSheet, conversations.length + 1, [38, 54, 14, 26, 19, 10, 24, 28, 28, 46, 30, 9, 18, 16, 16, 16, 10, 95, 14]);
conversationsSheet.getRange(`A2:${colName(conversationHeaders.length - 1)}${conversations.length + 1}`).format.verticalAlignment = "top";

const messagesSheet = workbook.worksheets.add("Mensagens");
messagesSheet.showGridLines = false;
const messageHeaders = [
  "chat_id",
  "ficheiro_origem",
  "chat_created_on_utc",
  "chat_created_on_excel",
  "numero_mensagem",
  "message_time_utc",
  "message_time_excel",
  "sender_type",
  "sender_name",
  "message_type",
  "texto_original",
  "anexos_json",
  "data_json",
  "mensagem_json",
];
writeMatrix(messagesSheet, [messageHeaders, ...messages]);
applyHeaderStyle(messagesSheet, `A1:${colName(messageHeaders.length - 1)}1`, "#385723");
addTable(messagesSheet, [messageHeaders, ...messages], "TabelaMensagens");
messagesSheet.freezePanes.freezeRows(1);
messagesSheet.freezePanes.freezeColumns(2);
messagesSheet.getRange(`D2:D${messages.length + 1}`).format.numberFormat = "yyyy-mm-dd hh:mm";
messagesSheet.getRange(`G2:G${messages.length + 1}`).format.numberFormat = "yyyy-mm-dd hh:mm";
messagesSheet.getRange(`E2:E${messages.length + 1}`).format.numberFormat = "#,##0";
messagesSheet.getRange(`K2:N${messages.length + 1}`).format = { wrapText: true, verticalAlignment: "top" };
messagesSheet.getRange(`A1:${colName(messageHeaders.length - 1)}${messages.length + 1}`).format.borders = { preset: "outside", style: "thin", color: "#D9EAD3" };
setColumnWidths(messagesSheet, messages.length + 1, [38, 54, 26, 19, 15, 26, 19, 12, 18, 14, 92, 45, 36, 75]);
messagesSheet.getRange(`A2:${colName(messageHeaders.length - 1)}${messages.length + 1}`).format.verticalAlignment = "top";

const rawSheet = workbook.worksheets.add("JSON Original");
rawSheet.showGridLines = false;
const rawHeaders = ["chat_id", "ficheiro_origem", "parte", "total_partes", "json_original"];
writeMatrix(rawSheet, [rawHeaders, ...rawRows]);
applyHeaderStyle(rawSheet, `A1:${colName(rawHeaders.length - 1)}1`, "#5F497A");
addTable(rawSheet, [rawHeaders, ...rawRows], "TabelaJsonOriginal");
rawSheet.freezePanes.freezeRows(1);
rawSheet.freezePanes.freezeColumns(2);
rawSheet.getRange(`C2:D${rawRows.length + 1}`).format.numberFormat = "#,##0";
rawSheet.getRange(`E2:E${rawRows.length + 1}`).format = { wrapText: true, verticalAlignment: "top" };
rawSheet.getRange(`A1:${colName(rawHeaders.length - 1)}${rawRows.length + 1}`).format.borders = { preset: "outside", style: "thin", color: "#E4DFEC" };
setColumnWidths(rawSheet, rawRows.length + 1, [38, 54, 10, 12, 130]);
rawSheet.getRange(`A2:${colName(rawHeaders.length - 1)}${rawRows.length + 1}`).format.verticalAlignment = "top";

if (invalidRows.length > 0) {
  const invalidSheet = workbook.worksheets.add("JSON Invalidos");
  invalidSheet.showGridLines = false;
  const invalidHeaders = ["ficheiro_origem", "erro", "conteudo_original"];
  writeMatrix(invalidSheet, [invalidHeaders, ...invalidRows]);
  applyHeaderStyle(invalidSheet, `A1:${colName(invalidHeaders.length - 1)}1`, "#7F1D1D");
  addTable(invalidSheet, [invalidHeaders, ...invalidRows], "TabelaJsonInvalidos");
  invalidSheet.freezePanes.freezeRows(1);
  invalidSheet.getRange(`C2:C${invalidRows.length + 1}`).format = { wrapText: true, verticalAlignment: "top" };
  setColumnWidths(invalidSheet, invalidRows.length + 1, [54, 44, 130]);
}

await fs.mkdir(previewDir, { recursive: true });
for (const spec of [
  ["Resumo", "A1:B30"],
  ["Conversas", "A1:S18"],
  ["Mensagens", "A1:N18"],
  ["JSON Original", "A1:E12"],
]) {
  const [sheetName, range] = spec;
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(
    path.join(previewDir, `${sheetName.replaceAll(" ", "_")}.png`),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(formulaErrors.ndjson);

const summaryInspect = await workbook.inspect({
  kind: "table",
  range: "Resumo!A1:B30",
  include: "values,formulas",
  tableMaxRows: 30,
  tableMaxCols: 2,
});
console.log(summaryInspect.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  previews: [
    path.join(previewDir, "Resumo.png"),
    path.join(previewDir, "Conversas.png"),
    path.join(previewDir, "Mensagens.png"),
    path.join(previewDir, "JSON_Original.png"),
  ],
  files: files.length,
  conversations: conversations.length,
  messages: messages.length,
  rawRows: rawRows.length,
  invalid: invalidRows.length,
}, null, 2));
