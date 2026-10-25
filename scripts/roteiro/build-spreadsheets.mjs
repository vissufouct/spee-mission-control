import fs from 'node:fs/promises'
import path from 'node:path'
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool'

const root = process.argv[2]
if (!root) throw new Error('Pass the repository root as the first argument.')
const out = path.join(root, 'frontend/public/apoio')
const qa = path.join(root, 'output/roteiro-qa')
await fs.mkdir(qa, { recursive: true })
const books = [
  { slug: 'modelo-recursos', sheet: 'Recursos', title: 'Recursos para iniciar a empresa', total: 'F6', amount: 'F',
    headers: ['Recurso', 'Finalidade', 'Quantidade', 'Unidade', 'Custo unitário (MZN)', 'Total (MZN)', 'Prioridade', 'Pressuposto / justificação'],
    widths: [30, 34, 12, 12, 19, 19, 16, 42],
    rows: [['Computadores', 'Gestão e comunicação', 2, 'Unidade', 35000, null, 'Essencial', 'Exemplo fictício; confirmar necessidades.'], ['Impressora', 'Impressão de documentos', 1, 'Unidade', 12000, null, 'Desejável', 'Comparar compra com serviço externo.'], ['Mesas de trabalho', 'Espaço de trabalho da equipa', 4, 'Unidade', 3000, null, 'Essencial', 'Reaproveitar mobiliário quando possível.'], ['Materiais de demonstração', 'Preparar amostras da oferta', 1, 'Lote', 9000, null, 'Essencial', 'Definir os itens do lote antes de comprar.']],
    formula: row => `=IF(A${row}="","",C${row}*E${row})`, formulaColumn: 'F', expected: 103000,
  },
  { slug: 'modelo-vendas', sheet: 'Vendas', title: 'Plano de vendas inicial', total: 'H6', amount: 'H',
    headers: ['Produto / serviço', 'Unidade', 'Preço (MZN)', 'Mês 1 · quantidade', 'Mês 2 · quantidade', 'Mês 3 · quantidade', 'Quantidade total', 'Receita total (MZN)'],
    widths: [39, 15, 18, 21, 21, 21, 21, 24],
    rows: [['Kit reutilizável para escritório', 'Kit', 1800, 20, 25, 30, null, null], ['Acompanhamento de consumo', 'Serviço', 2500, 8, 10, 12, null, null], ['Formação breve para equipas', 'Sessão', 4000, 2, 3, 4, null, null]],
    formula: row => `=IF(A${row}="","",C${row}*G${row})`, formulaColumn: 'H', expected: 246000,
  },
]
for (const spec of books) {
  const wb = Workbook.create()
  const sheet = wb.worksheets.add(spec.sheet)
  sheet.showGridLines = false
  sheet.tabColor = '#096dd9'
  sheet.getRange('A1:H22').format.font = { name: 'Arial', size: 11, color: '#17243d' }
  sheet.getRange('A1:H22').format.rowHeight = 25
  for (let c = 0; c < spec.widths.length; c++) sheet.getRangeByIndexes(0, c, 22, 1).format.columnWidth = spec.widths[c]
  sheet.getRange('A2').values = [[spec.title]]
  sheet.getRange('A2').format.font = { name: 'Arial', size: 16, bold: true, color: '#17243d' }
  sheet.getRange('A2:H2').format.rowHeight = 30
  sheet.getRange('A3').values = [['Empresa: [indicar nome] · Valores em MZN · Períodos relativos ao início da operação']]
  sheet.getRange('A4').values = [['Exemplo fictício. Edite as células amarelas; mantenha as fórmulas nas colunas de total.']]
  sheet.getRange('A4').format.font = { name: 'Arial', size: 11, color: '#63748b' }
  sheet.getRange('A6').values = [[spec.sheet === 'Recursos' ? 'Investimento previsto (MZN)' : 'Receita prevista em 3 meses (MZN)']]
  sheet.getRange(spec.total).formulas = [[`=SUM(${spec.amount}9:${spec.amount}18)`]]
  sheet.getRange(spec.total).format.font = { name: 'Arial', size: 15, bold: true, color: '#096dd9' }
  sheet.getRange(spec.total).setNumberFormat('#,##0.00')
  sheet.getRange('A8:H8').values = [spec.headers]
  sheet.getRange('A8:H8').format = { fill: '#096dd9', font: { name: 'Arial', size: 11, bold: true, color: '#FFFFFF' }, wrapText: true, rowHeight: 36, verticalAlignment: 'center', horizontalAlignment: 'center' }
  sheet.getRange(`A9:H${8 + spec.rows.length}`).values = spec.rows
  sheet.getRange('A9:H18').format.fill = '#FFF9E6'
  sheet.getRange('A9:H18').format.rowHeight = 37
  sheet.getRange('A9:B18').format.wrapText = true
  sheet.getRange('H9:H18').format.wrapText = true
  for (let row = 9; row <= 18; row++) {
    sheet.getRange(`${spec.formulaColumn}${row}`).formulas = [[spec.formula(row)]]
    if (spec.sheet === 'Vendas') sheet.getRange(`G${row}`).formulas = [[`=IF(A${row}="","",SUM(D${row}:F${row}))`]]
  }
  sheet.getRange(`${spec.formulaColumn}9:${spec.formulaColumn}18`).format.fill = '#F0F7FF'
  sheet.getRange(`${spec.formulaColumn}9:${spec.formulaColumn}18`).setNumberFormat('#,##0.00')
  if (spec.sheet === 'Recursos') {
    sheet.getRange('E9:E18').setNumberFormat('#,##0.00')
    sheet.getRange('G9:G18').dataValidation = { rule: { type: 'list', values: ['Essencial', 'Desejável', 'Adiar'] } }
  } else {
    sheet.getRange('C9:C18').setNumberFormat('#,##0.00')
    sheet.getRange('G9:G18').format.fill = '#F0F7FF'
  }
  sheet.getRange('A20').values = [['Fonte: dados fictícios criados para o exercício SPEE. Não representam preços de mercado.']]
  sheet.getRange('A21').values = [['Use as linhas disponíveis para acrescentar itens. Guarde uma cópia com o nome e a versão da empresa.']]
  sheet.getRange('A20:A21').format.font = { name: 'Arial', size: 10, color: '#63748b' }
  // Verify changes propagate, then restore the intended example before export.
  const input = spec.sheet === 'Recursos' ? 'C9' : 'D9'
  const original = sheet.getRange(input).values[0][0]
  sheet.getRange(input).values = [[original + 1]]
  const delta = spec.sheet === 'Recursos' ? 35000 : 1800
  if (Number(sheet.getRange(spec.total).values[0][0]) !== spec.expected + delta) throw new Error('Input recalculation failed: ' + spec.slug)
  sheet.getRange(input).values = [[original]]
  wb.recalculate()
  if (Number(sheet.getRange(spec.total).values[0][0]) !== spec.expected) throw new Error('Unexpected total: ' + spec.slug)
  const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!', options: { useRegex: true, maxResults: 20 }, maxChars: 1000 })
  console.log(spec.slug, spec.total, sheet.getRange(spec.total).values, errors.ndjson)
  const preview = await wb.render({ sheetName: spec.sheet, range: 'A1:H22', scale: 1.5, format: 'png' })
  await fs.writeFile(path.join(qa, spec.slug + '.png'), new Uint8Array(await preview.arrayBuffer()))
  await (await SpreadsheetFile.exportXlsx(wb)).save(path.join(out, spec.slug + '.xlsx'))
}
