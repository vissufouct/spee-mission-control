"""Build the two isolated demonstration scenarios from the approved roadmap.

Run with Python 3. Source: output/mission_control_unificado/Roteiro_SPEE_Consolidado.md.
Only writes the two new fixtures and the local read-only roadmap resource.
"""
import copy
import json
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'frontend/src/data'
PUBLIC = ROOT / 'frontend/public/apoio'
DATE = '2026-10-25T08:00:00.000Z'

def question(prompt, options, correct=0):
    return {'prompt': prompt, 'options': options, 'correct': correct}

ONBOARDING = [
    question('Qual é a estrutura do roteiro?', ['Bloco, actividade e tarefa.', 'Tarefa, turma e universidade.', 'Apenas uma lista de documentos.']),
    question('O que confirma a realização de uma tarefa?', ['A confirmação explícita ou a evidência pedida.', 'Abrir a página.', 'O tempo com o browser aberto.']),
    question('Onde deve pedir orientação pedagógica?', ['Na conversa com o docente, identificando a actividade.', 'Numa mensagem sem contexto.', 'Num comentário anónimo.']),
    question('Como deve usar conteúdos produzidos com IA?', ['Rever, adaptar e verificar as fontes.', 'Copiar sem ler.', 'Apresentá-los como factos verificados automaticamente.']),
]
DIAGNOSTIC = [
    question('Como começar a validar uma oportunidade?', ['Conversar com potenciais clientes.', 'Comprar equipamento antes de investigar.', 'Escolher apenas pelo nome.']),
    question('O que descreve uma proposta de valor?', ['O benefício para um público e problema concretos.', 'A lista dos sócios.', 'Só o preço.']),
    question('Uma receita é…', ['Um valor proveniente de vendas ou serviços.', 'Sempre igual ao lucro.', 'Um empréstimo recebido.']),
    question('Ao receber uma crítica de um cliente, deve…', ['Procurar compreender e testar melhorias.', 'Ignorá-la.', 'Mudar tudo sem investigar.']),
    question('Como gerir a incerteza de uma ideia?', ['Registar hipóteses e procurar evidências.', 'Prometer que não há riscos.', 'Evitar conversar com a equipa.']),
]
LICENSING = [
    question('Onde confirmar os requisitos aplicáveis à actividade económica?', ['Nas fontes oficiais e com as entidades competentes.', 'Apenas num exemplo de outra empresa.', 'Numa mensagem antiga sem fonte.']),
    question('Reservar um nome significa que todos os passos estão concluídos?', ['Não; é uma etapa do processo.', 'Sim, dispensa as etapas seguintes.', 'Sim, substitui qualquer licença.']),
    question('O que deve verificar antes de submeter um pedido?', ['A coerência dos dados e os documentos exigidos.', 'Apenas a cor do logótipo.', 'A popularidade da empresa.']),
    question('O registo neste protótipo tem validade oficial?', ['Não, é uma simulação pedagógica.', 'Sim, substitui o registo oficial.', 'Sim, em todas as províncias.']),
]

blocks = []
def block(id, title, description):
    result = {'id': id, 'title': title, 'description': description, 'state': 'not-started', 'activities': []}
    blocks.append(result)
    return result

def activity(parent, id, title, description):
    result = {'id': id, 'title': title, 'description': description, 'status': 'not-started', 'tasks': [], 'materials': [], 'simulatedParticipants': [
        {'name': 'Ana Machava', 'contribution': 'Coordenação da actividade, revisão e submissão dos resultados.'},
        {'name': 'João Tembe', 'contribution': 'Pesquisa, preparação dos dados e conferência das fontes.'},
        {'name': 'António Sitoe', 'contribution': 'Organização dos documentos e verificação com a equipa.'},
    ]}
    parent['activities'].append(result)
    return result

def task(parent, id, title, kind, description, resource=None, **extra):
    result = {'id': id, 'title': title, 'kind': kind, 'description': description, 'required': True, 'status': 'not-started', **extra}
    if resource: result['resource'] = resource if resource.startswith('https://') else 'apoio/' + resource
    if resource and resource.endswith('.pdf') and not resource.startswith('https://'):
        result['preview'] = 'apoio/' + resource.removesuffix('.pdf') + '-preview.png'
    if 'questions' in result:
        result['questions'] = [{**q, 'id': f'{id}-q{index + 1}'} for index, q in enumerate(result['questions'])]
    parent['tasks'].append(result)
    return result

def material(parent, title, format, href, description):
    parent['materials'].append({'title': title, 'format': format, 'href': href if href.startswith('https://') else 'apoio/' + href, 'description': description})

b1 = block('acolhimento', 'Acolhimento e preparação', 'Conheça a simulação, as regras e a forma de trabalhar em equipa.')
a = activity(b1, 'boas-vindas', 'Boas-vindas', 'Descubra o propósito do SPEE e aprenda a navegar no painel.')
task(a, 'b01-a01-t01', 'Conhecer a apresentação do SPEE', 'pdf', 'Leia os objectivos, os papéis dos participantes e o percurso da simulação.', 'apresentacao-spee.pdf')
task(a, 'b01-a01-t02', 'Explorar a navegação no painel', 'video', 'Apresentação prevista: percurso, estados, tarefas, materiais e canais de apoio.', 'capa-acolhimento.png', cover='apoio/capa-acolhimento.png')
material(a, 'ITIS — informação institucional', 'url', 'https://www.itis.ac.mz/', 'Referência indicada no roteiro; acesso externo sujeito à disponibilidade do portal.')
material(a, 'Organizar o tempo e o trabalho em equipa', 'pdf', 'organizacao-equipa.pdf', 'Guia local de planeamento semanal e comunicação respeitosa.')
a = activity(b1, 'conhecer-simulacao', 'Conhecer a simulação', 'Consulte as regras de participação, o relatório final e os canais de comunicação.')
task(a, 'b01-a02-t01', 'Ler o regulamento da simulação', 'pdf', 'Consulte as regras pedagógicas propostas para este exemplo. O regulamento institucional será confirmado na integração.', 'regulamento-simulacao.pdf')
task(a, 'b01-a02-t02', 'Consultar o modelo de relatório final', 'url', 'Conheça desde já a estrutura do relatório e descarregue o modelo Word editável.', 'relatorio-final.html')
task(a, 'b01-a02-t03', 'Conhecer os canais de comunicação', 'pdf', 'Escolha entre orientação do docente, conversa da empresa e apoio técnico.', 'comunicacao-spee.pdf')
material(a, 'Modelo de relatório final', 'word', 'modelo-relatorio-final.docx', 'Estrutura editável com campos para evidências e reflexão.')
a = activity(b1, 'confirmar-preparacao', 'Recapitular e confirmar', 'Reveja o roteiro e confirme que está preparado para participar.')
task(a, 'b01-a03-t01', 'Explorar o percurso completo', 'url', 'Consulte o mapa integral, em modo de leitura, antes de iniciar a simulação.', 'roteiro-completo.html')
task(a, 'b01-a03-t02', 'Quiz de acolhimento', 'quiz', 'Verifique os conhecimentos essenciais sobre a simulação. Aprovação a partir de 70%.', questions=ONBOARDING, passPercent=70)
task(a, 'b01-a03-t03', 'Aceitar a declaração de responsabilidade e ética', 'quiz', 'Comprometo-me a colaborar, respeitar os colegas, referenciar fontes e distinguir dados simulados de documentos oficiais. A aceitação é necessária para prosseguir.', questions=[question('Aceita este compromisso de participação?', ['Aceito o compromisso.', 'Não aceito.'])], passPercent=100)

b2 = block('ideacao', 'Ideação', 'Valide a ideia, estruture o modelo e prepare o plano de negócios.')
a = activity(b2, 'definir-ideia', 'Encontrar uma ideia de negócio', 'Identifique um problema real, o público e a proposta de valor da empresa.')
task(a, 'b02-a01-t01', 'Diagnóstico do empreendedor', 'quiz', 'Avalie os conhecimentos de partida. Este diagnóstico apresenta pontuação, sem nota mínima de aprovação.', questions=DIAGNOSTIC, quizMode='diagnostic')
task(a, 'b02-a01-t02', 'Conhecer as características empreendedoras', 'video', 'Apresentação prevista: iniciativa, curiosidade, persistência, colaboração e validação de hipóteses.', 'capa-empreendedorismo.png', cover='apoio/capa-empreendedorismo.png')
task(a, 'b02-a01-t03', 'Explorar uma ideia com apoio de IA', 'pdf', 'Use o prompt do guia, compare alternativas e reveja a proposta com a equipa.', 'guia-ideia-ia.pdf')
task(a, 'b02-a01-t04', 'Publicar a ideia e convidar colegas', 'operation', 'Abra o Hub social na seta à direita, apresente o problema, o público e a proposta de valor. Convide colegas interessados e confirme aqui quando terminar.')
material(a, 'IPEME — página indicada no roteiro', 'url', 'https://www.facebook.com/ipememocambique', 'Pode exigir sessão no Facebook. Referência de apoio, não é condição de conclusão.')
a = activity(b2, 'modelo-negocio', 'Construir o modelo de negócio', 'Relacione a proposta de valor, os clientes, os recursos e a viabilidade da ideia.')
task(a, 'b02-a02-t01', 'Conhecer o Business Model Canvas', 'video', 'Apresentação prevista: os nove componentes do modelo e a ligação entre mercado, operação, custos e receitas.', 'capa-empreendedorismo.png', cover='apoio/capa-empreendedorismo.png')
task(a, 'b02-a02-t02', 'Preparar o modelo com apoio de IA', 'pdf', 'Use o prompt, explicite hipóteses e evite tratar sugestões de IA como pesquisa de mercado.', 'guia-canvas-ia.pdf')
task(a, 'b02-a02-t03', 'Criar o modelo de negócio', 'operation', 'Preencha o modelo com a equipa e confirme a revisão dos nove componentes. Use o recurso oficial de apoio.')
material(a, 'Business Model Canvas — Strategyzer', 'url', 'https://www.strategyzer.com/library/the-business-model-canvas', 'Modelo de referência original; abrir o portal para consultar e descarregar o recurso.')
a = activity(b2, 'plano-negocios', 'Elaborar o plano de negócios', 'Transforme as hipóteses do modelo numa proposta documentada e verificável.')
task(a, 'b02-a03-t01', 'Conhecer a estrutura do plano de negócios', 'video', 'Apresentação prevista: mercado, operação, equipa, previsão de vendas, recursos e riscos.', 'capa-empreendedorismo.png', cover='apoio/capa-empreendedorismo.png')
task(a, 'b02-a03-t02', 'Consultar exemplos e orientações', 'url', 'Consulte o exemplo local e a referência do SEBRAE. Adapte o enquadramento à simulação moçambicana.', 'plano-negocios.html')
task(a, 'b02-a03-t03', 'Criar e entregar o plano de negócios', 'evidence', 'Descarregue o modelo Word, adapte-o à empresa e submeta o documento. Pode usar o exemplo para testar este fluxo.', 'modelo-plano-negocios.docx', accepts=['docx', 'pdf'])
material(a, 'Plano de negócios — modelo editável', 'word', 'modelo-plano-negocios.docx', 'Campos e um exemplo identificado para orientar a elaboração.')
material(a, 'Como elaborar um plano de negócio — SEBRAE', 'url', 'https://sebrae.com.br/sites/PortalSebrae/cursosonline/como-elaborar-um-plano-de-negocio,1880b8a6a28bb610VgnVCM1000004c00210aRCRD', 'Recurso pedagógico brasileiro. A inscrição pode exigir uma conta; os conteúdos legais não substituem fontes moçambicanas.')
a = activity(b2, 'auditoria-1', 'Auditoria I — trabalho de campo', 'Recolha evidências sobre a viabilidade da ideia e apresente conclusões fundamentadas.')
task(a, 'b02-a04-t01', 'Consultar o guia da auditoria I', 'pdf', 'Prepare o objectivo, as perguntas, os participantes e a forma de registar evidências.', 'guia-auditoria.pdf')
task(a, 'b02-a04-t02', 'Submeter o relatório de auditoria I', 'evidence', 'Apresente método, evidências, limitações e melhorias propostas. O exemplo usa entrevistas fictícias.', 'exemplo-auditoria.pdf', accepts=['pdf', 'docx'])
material(a, 'Relatório de auditoria I — modelo', 'word', 'modelo-auditoria.docx', 'Estrutura editável para preparar a entrega.')

b3 = block('constituicao', 'Criação de empresas', 'Constitua a empresa, organize o arquivo e prepare os contratos essenciais.')
a = activity(b3, 'registar-empresa', 'Constituição legal da empresa', 'Reúna os elementos necessários e percorra as etapas da constituição na simulação.')
task(a, 'b03-a01-t01', 'Consultar o portal do BAU', 'url', 'Explore a informação pública do Balcão de Atendimento Único e identifique onde confirmar os requisitos. Não submeta pedidos reais.', 'https://www.bau.gov.mz/')
task(a, 'b03-a01-t02', 'Quiz sobre constituição e licenciamento', 'quiz', 'Confirme a compreensão do processo. É necessário obter pelo menos 70% para executar as tarefas seguintes.', questions=LICENSING, passPercent=70)
task(a, 'b03-a01-t03', 'Reservar o nome da empresa', 'operation', 'Escolha a denominação com a equipa e confirme a reserva simulada do nome.')
task(a, 'b03-a01-t04', 'Convidar os sócios', 'operation', 'Identifique os membros da empresa e confirme a aceitação dos convites na simulação.')
task(a, 'b03-a01-t05', 'Registar a empresa', 'operation', 'Preencha e confirme o formulário de registo local da empresa.')
task(a, 'b03-a01-t06', 'Declarar o início de actividades', 'operation', 'Confirme a preparação dos dados necessários à declaração de início de actividades. Esta confirmação é exclusivamente pedagógica.')
task(a, 'b03-a01-t07', 'Submeter a publicação no Boletim da República', 'evidence', 'Anexe a evidência prevista no exercício. O ficheiro fornecido é um exemplo pedagógico sem validade oficial, não uma publicação autêntica.', 'exemplo-publicacao.pdf', accepts=['pdf'])
a = activity(b3, 'gestor-documental', 'Inicializar o gestor documental', 'Prepare um arquivo que permita localizar as evidências de cada operação.')
task(a, 'b03-a02-t01', 'Consultar o guia de organização documental', 'pdf', 'Leia a convenção de nomes, os separadores e a regra de conservação das versões. Esta leitura antecede as operações de arquivo.', 'guia-arquivo.pdf')
task(a, 'b03-a02-t02', 'Gerar os separadores do arquivo', 'operation', 'Crie separadores para constituição, contratos, vendas, compras, recursos humanos e banca.')
task(a, 'b03-a02-t03', 'Criar as pastas da empresa', 'operation', 'Organize as pastas e confirme que a equipa consegue localizar os documentos.')
a = activity(b3, 'contratos-servicos', 'Celebrar contratos de serviços', 'Prepare os compromissos regulares e o acesso aos serviços bancários.')
task(a, 'b03-a03-t01', 'Celebrar contratos de custos fixos', 'operation', 'Registe na simulação os contratos de instalações, água, electricidade e internet. Compare condições e arquive os documentos.')
task(a, 'b03-a03-t02', 'Abrir a conta bancária', 'operation', 'Confirme os dados da empresa, simule a abertura de conta e arquive a documentação.')

b4 = block('inicio-actividades', 'Início de actividades', 'Prepare recursos, vendas, equipas e rotinas antes de entrar no mercado.')
a = activity(b4, 'preparar-empresa', 'Preparar a empresa', 'Defina a identidade visual e os recursos necessários para começar a operar.')
task(a, 'b04-a01-t01', 'Criar o logótipo da empresa', 'url', 'Consulte o guia de criação de imagens, prepare o pedido e reveja o resultado com a equipa.', 'identidade-visual.html')
task(a, 'b04-a01-t02', 'Elaborar a lista de recursos', 'evidence', 'Preencha a folha de recursos com quantidades, custos unitários, prioridades e justificações.', 'modelo-recursos.xlsx', accepts=['xlsx', 'pdf'])
task(a, 'b04-a01-t03', 'Elaborar o plano de vendas', 'evidence', 'Preencha produtos ou serviços, quantidades previstas e preços. Os totais são calculados no modelo.', 'modelo-vendas.xlsx', accepts=['xlsx', 'pdf'])
task(a, 'b04-a01-t04', 'Criar e publicar o cartão de visita', 'operation', 'Prepare um cartão com nome da empresa, proposta de valor e contactos fictícios. Publique-o no Hub social e confirme a partilha.')
material(a, 'Guia de criação de imagens com IA', 'pdf', 'guia-imagens-ia.pdf', 'Prompt de logótipo e critérios de revisão.')
material(a, 'Lista de recursos — Excel', 'excel', 'modelo-recursos.xlsx', 'Custos e quantidades editáveis, totais automáticos.')
material(a, 'Plano de vendas — Excel', 'excel', 'modelo-vendas.xlsx', 'Previsão mensal com fórmulas e exemplo fictício.')
a = activity(b4, 'configurar-comercial', 'Configurar a gestão comercial', 'Prepare a oferta e a informação necessária para comprar e vender.')
task(a, 'b04-a02-t01', 'Actualizar o perfil comercial', 'operation', 'Complete os dados de identificação, contactos e área de actividade da empresa na simulação.')
task(a, 'b04-a02-t02', 'Registar produtos, serviços e preços', 'operation', 'Defina o catálogo com descrição, unidade, preço e pressupostos utilizados.')
task(a, 'b04-a02-t03', 'Prospectar clientes e fornecedores', 'operation', 'Use o guia para pesquisar parceiros, preparar contactos e comparar propostas. Confirme a conclusão da prospecção simulada.', 'guia-prospeccao.pdf')
task(a, 'b04-a02-t04', 'Registar clientes e fornecedores', 'operation', 'Organize os parceiros seleccionados e verifique contactos e condições comerciais.')
material(a, 'Guia de prospecção e contactos', 'pdf', 'guia-prospeccao.pdf', 'Critérios de selecção, mensagem de apresentação e pedido de cotação.')
a = activity(b4, 'configurar-rh', 'Configurar os recursos humanos', 'Organize a empresa, os trabalhadores e os registos de pessoal.')
task(a, 'b04-a03-t01', 'Actualizar o perfil da empresa em RH', 'operation', 'Confirme identificação e contactos da empresa no módulo de recursos humanos.')
task(a, 'b04-a03-t02', 'Registar os trabalhadores', 'operation', 'Prepare os dados fictícios dos trabalhadores, funções e condições do exercício.')
task(a, 'b04-a03-t03', 'Preparar a inscrição no INSS', 'operation', 'Confirme a preparação da inscrição simulada da empresa e dos trabalhadores. Os campos reais serão definidos na integração.')
task(a, 'b04-a03-t04', 'Gerar e arquivar a relação nominal', 'operation', 'Confira a relação de trabalhadores e arquive o documento na pasta de recursos humanos.')
material(a, 'Lei do Trabalho — fonte INSS', 'url', 'https://www.inss.gov.mz/sdm_downloads/20320/', 'Página oficial de disponibilização da Lei n.º 13/2023. Confirmar o enquadramento aplicável com o docente.')
a = activity(b4, 'preparar-banca', 'Preparar as operações bancárias', 'Organize os comprovativos iniciais e explore o financiamento da empresa.')
task(a, 'b04-a04-t01', 'Arquivar os comprovativos dos encargos iniciais', 'operation', 'Extraia os comprovativos das operações simuladas e arquive-os com referências que permitam a conferência.')
task(a, 'b04-a04-t02', 'Simular o pedido de financiamento', 'operation', 'Indique finalidade, montante e capacidade de reembolso. Compare pressupostos antes de confirmar a simulação.')
preflight = [t['id'] for x in b4['activities'] for t in x['tasks']]
a = activity(b4, 'orientacao-final', 'Orientação final para entrada no mercado', 'Confirme que a empresa reúne as condições do exercício para começar a operar.')
task(a, 'b04-a05-t01', 'Verificar a preparação da empresa', 'quiz', 'Confirme todos os pontos. Se algum estiver pendente, regresse à tarefa correspondente antes de avançar.', questions=[question(item, ['Sim, confirmado.', 'Ainda não.']) for item in ['A empresa está constituída na simulação?', 'O arquivo está organizado?', 'Os recursos e o plano de vendas foram revistos?', 'O catálogo comercial está preparado?', 'Os registos de pessoal estão organizados?', 'Os documentos bancários estão arquivados?']], passPercent=100)
task(a, 'b04-a05-t02', 'Boas-vindas ao mercado', 'video', 'Apresentação prevista: entrada no mercado, compras e vendas, concursos públicos, contabilidade e obrigações do primeiro ano fiscal.', 'capa-mercado.png', cover='apoio/capa-mercado.png')
block('primeiro-ano', 'Primeiro ano fiscal', 'Brevemente: compras, vendas, concursos, contabilidade e obrigações fiscais. Conteúdo ainda por definir.')

# Map only the explicit gates in the source. Numbering does not imply sequence.
# Scope of these gates is a documented UX choice pending pedagogical validation.
for b in blocks:
    for a in b['activities']:
        for t in a['tasks']:
            deps = [] if b['id'] == 'acolhimento' else ['b01-a03-t02', 'b01-a03-t03']
            if t['id'] == 'b01-a03-t03': deps = ['b01-a03-t02']
            if t['id'] in [f'b03-a01-t0{i}' for i in range(3, 8)]: deps += ['b03-a01-t02']
            if t['id'] in ['b03-a02-t02', 'b03-a02-t03', 'b03-a03-t01', 'b03-a03-t02']: deps += ['b03-a02-t01']
            if t['id'] == 'b04-a02-t04': deps += ['b04-a02-t03']
            if a['id'] == 'orientacao-final': deps += preflight
            t['dependsOn'] = list(dict.fromkeys(deps))

base = {'schemaVersion': 1, 'revision': 0, 'context': {'studentName': 'Ana Machava', 'studentEmail': 'ana.machava@example.test', 'className': 'Turma A', 'routeName': 'Roteiro SPEE', 'currentBlockId': 'acolhimento', 'roadmapVersion': 'spee-2026-10-25'}, 'members': ['Ana Machava', 'João Tembe', 'António Sitoe'], 'blocks': blocks, 'registration': None, 'events': [], 'groupMessages': [], 'resolvedNotifications': []}

for example, company in [('1', 'Horizonte Verde, Lda.'), ('2', 'Nascente Criativa, Lda.')]:
    seed = copy.deepcopy(base)
    seed['context'].update(example=example, companyName=company)
    if example == '1':
        seed['context']['currentBlockId'] = 'constituicao'
        for b in seed['blocks']:
            for a in b['activities']:
                for t in a['tasks']:
                    if b['id'] in ['acolhimento', 'ideacao'] or t['id'] in [f'b03-a01-t0{i}' for i in range(1, 5)]:
                        t.update(status='completed', completedAt=DATE)
                        if t['kind'] == 'quiz':
                            t['answers'] = {q['id']: q['correct'] for q in t['questions']}
                            if t.get('quizMode') == 'diagnostic': t['answers'][t['questions'][-1]['id']] = 1
                        if t['kind'] == 'evidence': t['submission'] = {'fileName': t['resource'].split('/')[-1], 'submittedBy': 'Ana Machava', 'submittedAt': DATE}
                    elif t['id'] == 'b03-a01-t05': t['status'] = 'in-progress'
        seed['registration'] = {'id': 'example-one-registration', 'status': 'draft', 'data': {'legalName': company, 'taxId': '400123456', 'sector': 'Produtos de limpeza reutilizáveis e consultoria ambiental', 'province': 'Maputo', 'address': 'Avenida da Cooperação, 120 — endereço fictício', 'email': 'equipa@horizonte.example', 'capital': 150000}, 'updatedAt': DATE, 'receiptNumber': None}
        seed['groupMessages'] = [{'id': 'roadmap-discussion-1', 'activityId': 'registar-empresa', 'author': 'João Tembe', 'message': 'Ana, confirmei os dados dos sócios. Podemos rever o formulário de registo em conjunto.', 'createdAt': DATE, 'assignee': 'Ana Machava', 'doneAt': None}]
    (DATA / f'student-roadmap-example-{example}.fixture.json').write_text(json.dumps(seed, ensure_ascii=False, indent=2) + '\n')

rows = ''.join(f'<section><h2>{escape(b["title"])}</h2><p>{escape(b["description"])}</p>' + ''.join(f'<h3>{escape(a["title"])}</h3><ol>' + ''.join(f'<li>{escape(t["title"])}</li>' for t in a['tasks']) + '</ol>' for a in b['activities']) + '</section>' for b in blocks)
PUBLIC.mkdir(parents=True, exist_ok=True)
(PUBLIC / 'roteiro-completo.html').write_text('<!doctype html><html lang="pt"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Roteiro SPEE</title><style>body{font:16px/1.7 system-ui;color:#17243d;max-width:900px;margin:auto;padding:32px}h1,h2{color:#066dd9}section{border-bottom:1px solid #dbe7f2;padding:16px 0}</style><h1>Roteiro SPEE</h1><p>Mapa de consulta. A execução e o progresso são registados no Painel do Estudante.</p>' + rows + '</html>')
print('Created 2 scenarios:', sum(len(b['activities']) for b in blocks), 'activities,', sum(len(a['tasks']) for b in blocks for a in b['activities']), 'tasks')
