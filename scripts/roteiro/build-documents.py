"""Generate original, explicitly pedagogical support documents for the SPEE roadmap.
Uses python-docx and ReportLab from the bundled workspace runtime.
"""
from pathlib import Path
from html import escape
import json
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'frontend/public/apoio'
OUT.mkdir(parents=True, exist_ok=True)
GUIDES = {
 'apresentacao-spee': ('Conhecer o SPEE', 'Acolhimento e preparação', [
   ('O que vai fazer', 'A equipa vai desenvolver uma ideia de negócio, constituir uma empresa fictícia e preparar a sua entrada no mercado. O percurso organiza-se em blocos, actividades e tarefas. Cada tarefa tem um resultado a confirmar.'),
   ('Como aprender', 'Leia as instruções antes de agir. Compare hipóteses, registe decisões e discuta com os colegas. Utilize os documentos de apoio para organizar o trabalho e peça orientação ao docente quando precisar.'),
   ('O que vê no painel', 'O estado de cada actividade resulta das tarefas obrigatórias. Os botões permitem consultar materiais, responder a quizzes, executar operações simuladas e submeter evidências. Abrir uma página não conclui uma tarefa.'),
   ('O seu primeiro percurso', 'Consulte a apresentação e a capa do vídeo de navegação. Leia as regras e o modelo de relatório. Explore o mapa, responda ao quiz de acolhimento e aceite o compromisso de responsabilidade.'),
   ('Resultado esperado', 'No final, deve conseguir explicar o percurso, reconhecer os canais de apoio e indicar como demonstrará a realização do trabalho. Os resultados deste protótipo ficam no browser utilizado.'),
 ]),
 'regulamento-simulacao': ('Regras de participação', 'Proposta pedagógica para o protótipo', [
   ('Âmbito', 'Estas regras orientam o exemplo de UX. Não constituem um regulamento institucional aprovado. Os prazos, a avaliação e as condições de participação serão definidos pelo docente para cada turma.'),
   ('Trabalho da equipa', 'Distribua responsabilidades e combine momentos de revisão. Cada participante deve compreender as decisões tomadas pela empresa. As contribuições e evidências devem ser registadas de forma transparente.'),
   ('Utilização responsável', 'Utilize dados fictícios nos formulários. Não envie documentos pessoais, palavras-passe ou informação confidencial para o protótipo. Não utilize os exemplos como documentos oficiais ou comprovativos reais.'),
   ('Fontes e IA', 'Identifique a origem de textos, imagens e dados. Use a IA para explorar alternativas, mas verifique o conteúdo e reveja os resultados. Não apresente uma sugestão gerada como pesquisa já realizada.'),
   ('Conclusão das tarefas', 'Os materiais exigem confirmação de consulta; os quizzes obedecem ao critério indicado; as evidências exigem submissão. Submeter não equivale a avaliação ou aprovação pelo docente.'),
   ('Resolução de dificuldades', 'Descreva a actividade, o que tentou e o resultado observado. Use a conversa com o docente para dúvidas pedagógicas e o apoio técnico para falhas de funcionamento.'),
 ]),
 'comunicacao-spee': ('Comunicar durante a simulação', 'Canais e contexto', [
   ('Orientação do docente', 'Use este canal para esclarecer requisitos, discutir decisões e pedir feedback. Indique a actividade e formule uma pergunta concreta. Todos os membros da empresa partilham esta conversa.'),
   ('Conversa da empresa', 'Organize o trabalho com os colegas e atribua tarefas simples. O responsável marca como feita a tarefa de conversa. Esta acção não altera automaticamente o progresso académico.'),
   ('Hub social', 'Partilhe ideias na comunidade, crie grupos por convite e contacte colegas em privado. As mensagens identificam o autor e a turma. Uma publicação social não substitui uma evidência pedida no roteiro.'),
   ('Apoio técnico', 'Descreva os passos para reproduzir a dificuldade, o resultado esperado e o que apareceu. Evite incluir dados pessoais nas capturas. Nesta fase, não há envio automático para um serviço externo de helpdesk.'),
   ('Exemplo de pedido útil', 'Estamos na actividade Constituição legal da empresa. O quiz está concluído, mas o registo continua bloqueado. Já confirmámos a reserva do nome; falta confirmar os sócios. É este o passo necessário?'),
 ]),
 'organizacao-equipa': ('Organizar o trabalho da equipa', 'Planeamento e comunicação', [
   ('Plano semanal', 'Escolha as tarefas da semana, estime o esforço e indique um responsável por cada resultado. Reserve tempo para rever os documentos antes da submissão. Ajuste o plano se surgirem dependências ou dificuldades.'),
   ('Reunião de quinze minutos', 'Cada pessoa apresenta o que concluiu, o que fará a seguir e onde precisa de ajuda. Registe apenas decisões e acções. Termine com responsáveis e datas combinadas.'),
   ('Discordar com respeito', 'Descreva o problema e a evidência, ouça a interpretação do colega e proponha um pequeno teste. Evite julgamentos pessoais. Peça mediação ao docente se a equipa não conseguir chegar a uma decisão.'),
   ('Modelo de mensagem', 'Contexto: [actividade]. Proposta: [o que mudar]. Razão: [evidência]. Pedido: [decisão ou ajuda necessária]. Prazo acordado: [data].'),
 ]),
 'guia-ideia-ia': ('Explorar uma ideia com IA', 'Ideação', [
   ('Antes de escrever o pedido', 'Identifique um problema observado, quem o sente e como é resolvido actualmente. Registe o que sabe e o que ainda precisa de confirmar. Uma oportunidade deve ligar uma necessidade a uma solução plausível.'),
   ('Prompt de trabalho', 'Actua como facilitador de uma equipa de estudantes em Moçambique. Queremos explorar [problema] para [público]. Os recursos disponíveis são [recursos]. Propõe três soluções, explica o benefício, os principais custos e os riscos. Separa factos de hipóteses e indica cinco perguntas para entrevistar potenciais clientes. Não inventes dados de mercado.'),
   ('Revisão da equipa', 'Compare as três alternativas: necessidade do cliente, recursos, diferenciação e possibilidade de testar. Escolha uma hipótese inicial e explique a escolha. Não transforme estimativas em resultados observados.'),
   ('Como validar', 'Prepare uma breve conversa com potenciais clientes. Pergunte como resolvem o problema, quanto lhes custa e o que valorizam. Registe respostas com consentimento e sem dados pessoais desnecessários.'),
   ('O que publicar', 'Apresente o problema, o público, a proposta e o tipo de colaboração procurada. Exemplo fictício: ajudar pequenos escritórios a reduzir descartáveis através de materiais reutilizáveis e acompanhamento.'),
 ]),
 'guia-canvas-ia': ('Preparar o modelo de negócio', 'Guia com apoio de IA', [
   ('Os componentes', 'Descreva os segmentos de clientes, a proposta de valor, os canais, a relação com clientes, as receitas, os recursos, as actividades, as parcerias e os custos. Verifique como cada escolha afecta as restantes.'),
   ('Prompt de trabalho', 'Ajuda-nos a estruturar o modelo da empresa [nome fictício]. O problema é [problema] e o público é [público]. Organiza uma proposta nos nove componentes do Business Model Canvas. Assinala as hipóteses sem evidência, identifica incoerências entre receitas e custos e sugere testes simples. Não inventes pesquisas nem contactos de clientes.'),
   ('Verificação', 'O benefício responde ao problema? Os canais chegam ao público? A equipa tem os recursos necessários? Há uma explicação para quem paga e porquê? Os custos incluem a operação e a entrega do serviço?'),
   ('Resultado esperado', 'Uma versão datada do modelo, com hipóteses e dúvidas explícitas. Reveja-a depois da auditoria de campo. O modelo não é uma garantia de viabilidade.'),
   ('Fonte de referência', 'Business Model Canvas — Strategyzer. Consultado em 25/10/2026. https://www.strategyzer.com/library/the-business-model-canvas'),
 ]),
 'guia-auditoria': ('Auditoria I — guia de campo', 'Validar a ideia de negócio', [
   ('Objectivo', 'Recolher evidências que ajudem a confirmar ou reformular a ideia. Defina uma pergunta principal, por exemplo: os pequenos escritórios consideram a redução de descartáveis um problema prioritário?'),
   ('Preparação', 'Seleccione participantes adequados ao público pretendido. Explique o objectivo pedagógico e peça consentimento. Não prometa benefícios comerciais nem registe dados pessoais que não sejam necessários.'),
   ('Perguntas de exemplo', 'Como resolve este problema? Com que frequência ocorre? Que custos ou dificuldades provoca? O que já tentou? Que critérios usaria para escolher uma solução? Evite perguntas que sugiram a resposta desejada.'),
   ('Registo', 'Use códigos como Entrevista 01. Anote a data, o contexto, a síntese e a relação com a hipótese. Separe observação, interpretação e proposta. Preserve a confidencialidade dos participantes.'),
   ('Relatório', 'Inclua objectivo, método, evidências, limitações e recomendações. Uma amostra pequena permite explorar hipóteses, mas não representa todo o mercado. Explique o que deve ser investigado a seguir.'),
 ]),
 'guia-arquivo': ('Organizar o arquivo da empresa', 'Gestão documental', [
   ('Estrutura inicial', 'Crie as pastas 01_Constituicao, 02_Contratos, 03_Compras, 04_Vendas, 05_Recursos_Humanos e 06_Banca. Dentro de cada pasta, agrupe por período ou operação quando fizer sentido.'),
   ('Nomes dos ficheiros', 'Use data, assunto e versão: AAAA-MM-DD_Assunto_v01.ext. Exemplo fictício: 2026-10-25_PlanoVendas_v01.xlsx. Evite nomes como final-final e não sobrescreva uma versão já submetida.'),
   ('Separadores', 'Cada separador deve indicar o tema, os tipos de documentos e o responsável pela organização. Use um índice simples para localizar as evidências que serão citadas no relatório.'),
   ('Conferência', 'Confirme a legibilidade, a versão, a data e a actividade associada. Verifique se a equipa tem acesso aos documentos necessários. Uma pasta vazia não demonstra que a tarefa foi realizada.'),
   ('Resultado esperado', 'Uma estrutura de pastas criada, separadores identificados e uma regra de nomes partilhada pela equipa. Os documentos produzidos no protótipo são exemplos sem validade oficial.'),
 ]),
 'guia-prospeccao': ('Prospectar clientes e fornecedores', 'Gestão comercial', [
   ('Definir critérios', 'Identifique o tipo de cliente, a necessidade e a área de actuação. Para fornecedores, compare qualidade, preço, prazo, capacidade e condições. Registe a origem e a data de cada informação.'),
   ('Primeiro contacto', 'Assunto: apresentação da empresa [nome]. Bom dia, somos uma equipa de uma simulação pedagógica e estamos a explorar [necessidade]. Gostaríamos de compreender [pergunta concreta]. Podemos combinar uma breve conversa? Não efectuar contactos reais a partir deste protótipo.'),
   ('Pedido de cotação', 'Especifique item, quantidade, unidade, requisitos e data pretendida. Peça que o fornecedor indique preço, condições, prazo e validade da proposta. Na simulação, use contactos fictícios.'),
   ('Comparar propostas', 'Registe os mesmos campos para todos os fornecedores e justifique a escolha. Um preço inferior pode implicar condições diferentes. Identifique informação em falta antes de decidir.'),
   ('Resultado esperado', 'Uma lista de potenciais parceiros, uma comparação fundamentada e mensagens preparadas. Confirme a tarefa apenas depois de efectuar o exercício de prospecção.'),
 ]),
 'guia-imagens-ia': ('Criar a identidade visual com IA', 'Logótipo e cartão de visita', [
   ('Preparar o pedido', 'Defina nome, público, actividade e três atributos da empresa. Escolha duas cores e indique onde o logótipo será usado. Trabalhe com nomes e contactos fictícios.'),
   ('Prompt de exemplo', 'Cria um símbolo simples para a empresa fictícia Horizonte Verde, que fornece soluções reutilizáveis a pequenos escritórios. Deve transmitir cuidado, clareza e confiança. Usa azul e verde, fundo branco e formas legíveis em tamanho pequeno. Evita símbolos de entidades existentes. Apresenta uma proposta sem fotografias.'),
   ('Rever o resultado', 'Verifique legibilidade, contraste e utilização em tamanhos diferentes. Confirme que não reproduz uma marca existente. Ajuste o texto manualmente quando necessário e registe que recorreu a IA.'),
   ('Cartão de visita', 'Inclua nome da empresa, actividade, nome do contacto e endereço fictício. Exporte uma imagem e partilhe-a com a equipa no Hub social. Evite inventar números de registo, selos ou credenciais oficiais.'),
 ]),
 'exemplo-auditoria': ('Relatório de auditoria I', 'Horizonte Verde, Lda. — exemplo preenchido', [
   ('Natureza deste exemplo', 'Todos os dados e entrevistas abaixo são fictícios. O documento demonstra a estrutura da entrega e não comprova trabalho de campo realizado.'),
   ('Objectivo e método', 'Explorar a necessidade de reduzir materiais descartáveis em pequenos escritórios. O cenário considera três entrevistas simuladas e uma observação fictícia do processo de compras.'),
   ('Evidências simuladas', 'Entrevista 01: compras realizadas sem uma lista comum. Entrevista 02: interesse em comparar custo por utilização. Entrevista 03: dificuldade em acompanhar o consumo. A observação fictícia sugere que a reposição depende de pedidos informais.'),
   ('Interpretação', 'As respostas apontam para uma hipótese de serviço que combine produtos reutilizáveis e acompanhamento do consumo. Não permitem estimar a dimensão do mercado nem a disponibilidade efectiva para pagar.'),
   ('Proposta e próximos passos', 'Preparar um pequeno catálogo, explicitar os custos e testar uma proposta com novos participantes. Rever o modelo de negócio e o plano de vendas após a recolha de evidências reais no contexto da disciplina.'),
 ]),
 'exemplo-publicacao': ('Exemplo de evidência de publicação', 'SIMULAÇÃO PEDAGÓGICA — SEM VALIDADE OFICIAL', [
   ('Finalidade', 'Este ficheiro serve apenas para testar a submissão de uma evidência no SPEE. Não é uma publicação do Boletim da República, certidão, acto de constituição ou comprovativo legal.'),
   ('Dados ilustrativos', 'Empresa fictícia: Horizonte Verde, Lda. Actividade do exercício: soluções reutilizáveis para escritórios. Equipa: Ana Machava, João Tembe e António Sitoe. Referência interna: EXEMPLO-SPEE-01.'),
   ('Campos a conferir numa evidência do exercício', 'Denominação da empresa, referência do documento, data, correspondência com os dados da simulação e legibilidade. Os requisitos reais devem ser confirmados nas fontes competentes.'),
   ('Utilização no protótipo', 'Seleccione este PDF na tarefa correspondente ou use a opção de ficheiro de exemplo. A confirmação altera apenas os dados locais do cenário. Não é efectuada qualquer publicação oficial.'),
 ]),
}

styles = {
 'title': ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=23, leading=28, textColor=HexColor('#14243d'), spaceAfter=12),
 'sub': ParagraphStyle('Sub', fontName='Helvetica', fontSize=11, leading=16, textColor=HexColor('#0877dd'), spaceAfter=20),
 'head': ParagraphStyle('Heading', fontName='Helvetica-Bold', fontSize=12, leading=16, spaceBefore=13, spaceAfter=5, textColor=HexColor('#14243d')),
 'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=10.5, leading=15.5, spaceAfter=7, alignment=TA_LEFT),
}
def footer(canvas, doc):
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(HexColor('#62758e'))
    canvas.drawString(48, 30, 'SPEE | Material pedagógico de exemplo | 25/10/2026')
    canvas.drawRightString(A4[0] - 48, 30, str(doc.page))

for slug, (title, subtitle, sections) in GUIDES.items():
    flow = [Paragraph(escape(title), styles['title']), Paragraph(escape(subtitle), styles['sub'])]
    for heading, body in sections:
        flow += [Paragraph(escape(heading), styles['head']), Paragraph(escape(body), styles['body'])]
    SimpleDocTemplate(str(OUT / f'{slug}.pdf'), pagesize=A4, leftMargin=48, rightMargin=48, topMargin=46, bottomMargin=50, title=title, author='SPEE — exemplo pedagógico').build(flow, onFirstPage=footer, onLaterPages=footer)

TEMPLATES = {
 'modelo-relatorio-final': ('Relatório final da simulação', [
   ('Identificação', 'Empresa: [denominação fictícia]\nTurma: [turma] | Equipa: [nomes]\nPeríodo: [início e fim] | Versão: [número e data]'),
   ('1. Síntese da experiência', '[Resuma a ideia, as principais decisões e o que a equipa aprendeu. Escreva esta secção no final.]'),
   ('2. Ideia e modelo de negócio', '[Explique o problema, o público, a proposta de valor e as hipóteses validadas. Identifique as fontes.]'),
   ('3. Constituição e organização', '[Descreva as etapas realizadas, as dificuldades e a estrutura do arquivo. Cite as evidências pela referência do ficheiro.]'),
   ('4. Preparação da operação', '[Apresente recursos, plano de vendas, catálogo, equipa e pressupostos de financiamento.]'),
   ('5. Resultados e reflexão', '[Compare o planeado com o realizado. Explique limitações, decisões a rever e aprendizagem individual e colectiva.]'),
   ('6. Evidências e fontes', '[Liste os documentos, a actividade correspondente e a localização. Declare a utilização de IA e descreva a revisão humana.]'),
 ]),
 'modelo-plano-negocios': ('Plano de negócios', [
   ('Identificação', 'Empresa: [nome fictício] | Equipa: [nomes] | Data: [data]\nVersão: [número] | Responsável pela revisão: [nome]'),
   ('1. Problema e proposta de valor', '[Descreva a necessidade e o benefício. Exemplo fictício: reduzir descartáveis em pequenos escritórios através de produtos reutilizáveis e acompanhamento do consumo.]'),
   ('2. Clientes e mercado', '[Caracterize o público, as alternativas existentes e as evidências recolhidas. Separe observações de hipóteses ainda por testar.]'),
   ('3. Oferta e operação', '[Indique produtos ou serviços, canais, fornecedores e recursos. Explique como a empresa entrega o benefício prometido.]'),
   ('4. Equipa e responsabilidades', '[Indique as funções, competências disponíveis e necessidades de aprendizagem. Combine a forma de tomar decisões.]'),
   ('5. Plano de vendas e recursos', '[Anexe as folhas Excel. Justifique preços, quantidades, custos e período. Os valores de exemplo não são preços de mercado pesquisados.]'),
   ('6. Riscos e testes', '[Para cada hipótese importante, indique o risco, o teste a realizar, o responsável e a evidência necessária.]'),
   ('7. Fontes e revisão', '[Liste as fontes com data de consulta. Indique onde utilizou IA e o que foi verificado pela equipa.]'),
 ]),
 'modelo-auditoria': ('Relatório de auditoria I', [
   ('Identificação', 'Empresa: [nome] | Turma: [turma] | Autores: [nomes]\nData de recolha: [data] | Versão: [número]'),
   ('1. Pergunta e objectivo', '[Defina a hipótese que pretende investigar e explique por que motivo é relevante para a ideia de negócio.]'),
   ('2. Método', '[Descreva participantes, critérios de selecção, perguntas e forma de registo. Explique como obteve consentimento e protegeu dados pessoais.]'),
   ('3. Evidências', '[Apresente sínteses por código de entrevista ou observação. Separe o que foi dito ou observado da sua interpretação.]'),
   ('4. Análise e limitações', '[Explique o que as evidências sugerem e o que não permitem concluir. Identifique lacunas, enviesamentos e dimensão da amostra.]'),
   ('5. Recomendações', '[Indique alterações ao modelo, próximos testes e responsáveis. Relacione cada recomendação com a evidência que a sustenta.]'),
   ('6. Anexos e fontes', '[Inclua o guião e as referências dos registos autorizados. Não anexe dados pessoais desnecessários.]'),
 ]),
}
for slug, (title, sections) in TEMPLATES.items():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = section.bottom_margin = Cm(2)
    section.left_margin = section.right_margin = Cm(2.2)
    for name in ['Normal', 'Title', 'Heading 1']:
        doc.styles[name].font.name = 'Arial'
        doc.styles[name].font.color.rgb = RGBColor(20, 36, 61)
    doc.styles['Normal'].font.size = Pt(10.5)
    doc.styles['Normal'].paragraph_format.space_after = Pt(8)
    doc.styles['Title'].font.size = Pt(23)
    doc.styles['Title'].font.color.rgb = RGBColor(0, 0, 0)
    for border in doc.styles['Title'].element.xpath('./w:pPr/w:pBdr'):
        border.getparent().remove(border)
    doc.styles['Heading 1'].font.size = Pt(12)
    doc.styles['Heading 1'].paragraph_format.space_before = Pt(12)
    doc.add_paragraph(title, 'Title')
    doc.add_paragraph('SPEE · Modelo editável para exercício pedagógico')
    doc.add_paragraph('Substitua os campos entre parênteses rectos. Os exemplos são fictícios; não representam resultados observados nem documentos oficiais.')
    for heading, text in sections:
        doc.add_heading(heading, 1)
        doc.add_paragraph(text)
    section.footer.paragraphs[0].text = 'SPEE | Modelo pedagógico | 25/10/2026'
    section.footer.paragraphs[0].style = doc.styles['Caption']
    doc.core_properties.title = title
    doc.core_properties.author = 'SPEE — exemplo pedagógico'
    doc.save(OUT / f'{slug}.docx')

PAGES = {
 'relatorio-final': ('Relatório final da simulação', 'Descarregue o modelo editável e consulte a estrutura antes de começar. Reúna evidências ao longo do percurso, sem esperar pelo final.', [('modelo-relatorio-final.docx', 'Descarregar modelo Word')]),
 'plano-negocios': ('Preparar o plano de negócios', 'Use o modelo local para estruturar a sua proposta. O recurso do SEBRAE complementa o exercício; os exemplos brasileiros devem ser adaptados ao contexto moçambicano.', [('modelo-plano-negocios.docx', 'Descarregar modelo Word'), ('https://sebrae.com.br/sites/PortalSebrae/cursosonline/como-elaborar-um-plano-de-negocio,1880b8a6a28bb610VgnVCM1000004c00210aRCRD', 'Consultar orientação do SEBRAE')]),
 'identidade-visual': ('Criar a identidade visual', 'Prepare um pedido para a ferramenta de criação de imagens que utiliza. Reveja o resultado com a equipa e registe a utilização de IA. Esta página não envia pedidos para ferramentas externas.', [('guia-imagens-ia.pdf', 'Ler o guia e o prompt de exemplo')]),
}
for slug, (title, body, links) in PAGES.items():
    (OUT / f'{slug}.html').write_text('<!doctype html><html lang="pt"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + escape(title) + '</title><style>body{font:16px/1.7 system-ui;max-width:760px;padding:32px;margin:auto;color:#17243d}h1{font-size:28px}a{display:block;color:#066dd9;margin:18px 0}small{color:#66758a}</style><h1>' + escape(title) + '</h1><p>' + escape(body) + '</p>' + ''.join('<a target="_blank" rel="noreferrer" href="'+escape(url, quote=True)+'">'+escape(label)+'</a>' for url, label in links) + '<small>SPEE · Material pedagógico de exemplo</small></html>')

(OUT / 'catalogo-materiais.json').write_text(json.dumps({'created': '2026-10-25', 'pdf': list(GUIDES), 'word': list(TEMPLATES), 'excel': ['modelo-recursos', 'modelo-vendas'], 'covers': ['capa-acolhimento', 'capa-empreendedorismo', 'capa-mercado']}, ensure_ascii=False, indent=2))
print(f'Created {len(GUIDES)} PDFs, {len(TEMPLATES)} DOCX templates and {len(PAGES)} resource pages.')
