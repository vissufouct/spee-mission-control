# PRD do Painel — núcleo comum

## Terminologia da interface — 25 de Outubro de 2026

As designações oficiais são **Painel do Docente** e **Painel do Estudante**, sem acento em «Painel». Usar estes termos na entrada, introduções, títulos, navegação, mensagens e documentação corrente. Conservar identificadores técnicos, nomes de ficheiros e URLs existentes para manter a compatibilidade; esta decisão altera a terminologia apresentada ao utilizador.

**Versão:** 0.24
**Data:** 25 de Outubro de 2026
**Estado:** rascunho consolidado para validação  
**Produto:** Painéis SPEE

## Validação no browser — 25 de Outubro de 2026

- Os cartões dos exemplos descrevem o ponto de partida; a entrada deve explicar que visitas seguintes retomam alterações guardadas.
- Os PDF de exemplo incluem pré-visualização estática gerada do documento original e ligação de descarga, sem depender do plugin PDF do browser. Ficheiros enviados pelo utilizador nunca mostram a pré-visualização de um exemplo diferente; conservam o ficheiro real e a alternativa de descarga.
- O resultado do registo permite voltar directamente às tarefas da actividade. Não remete para ferramentas de reposição de cenário retiradas da interface.
- Validar os fluxos por interacção no browser, incluindo erros do quiz, confirmação de consulta, persistência e correspondência estudante/docente. Registar evidências em `output/roteiro-qa/usabilidade-2026-10-25/`.

## Decisão de 25 de Outubro — actividades e tarefas

Esta decisão prevalece sobre referências anteriores a critérios/passos executáveis e a botões «Iniciar/Continuar actividade» no estudante. A hierarquia passa a ser **Bloco → Actividade → Tarefas**. «Registar empresa» é uma actividade; preencher dados, submeter o formulário, gerar documentos, consultar um material e responder a um quiz são tarefas.

- Cada tarefa tem identificador estável, tipo, estado e acção própria. Tipos nesta experiência: operação, quiz, vídeo, PDF, página Web e submissão de evidência. As tarefas de aprendizagem são distintas das tarefas atribuídas nas conversas, cujo regime Por fazer/Feito permanece intacto.
- O estudante executa acções nas linhas das tarefas. Os cartões de contexto deixam de ter botões de execução; a navegação por nome continua disponível. As listas de actividades oferecem «Ver tarefas». Estado e contagem da actividade são agregados de leitura, não uma operação autónoma.
- A actividade só fica concluída quando todas as suas tarefas obrigatórias estão concluídas. O progresso global mantém como denominador as actividades, sem contar tarefas como actividades adicionais.
- Abrir popups não confirma resultados. Operações de registo dependem da evidência do formulário; operações genéricas são explicitamente simuladas. Quiz exige validação de respostas; materiais exigem confirmação expressa de consulta. Nos vídeos existentes, a confirmação depende do fim da reprodução. No novo roteiro, capas ilustrativas substituem os vídeos e exigem simulação explícita de visualização.
- Quiz em popup, respostas obrigatórias, feedback de erro e nova tentativa; os quizzes do roteiro usam o limiar configurado (70% no acolhimento e constituição; 100% quando omitido); o diagnóstico exige respostas completas e apresenta a pontuação, mesmo inferior a 100%. Guardar as respostas submetidas e a data de conclusão; apresentar a pontuação calculada a partir dessas respostas. O modelo definitivo de avaliação será validado na integração.
- Materiais obrigatórios pertencem às tarefas; materiais complementares continuam no grupo «Materiais de apoio». PDF e páginas locais têm visualização no popup e abertura alternativa noutro separador; páginas externas abrem no portal de origem. Vídeos existentes usam controlos nativos; as novas capas são identificadas como ilustrações, com simulação explícita de visualização.
- Persistir tarefas, respostas e eventos via repository, com revisão e tratamento de erros. Ao ler cenários antigos sem tarefas, acrescentar as definições dos fixtures sem apagar registos, mensagens ou histórico. Um registo já confirmado continua confirmado, mas a actividade pode passar a Em curso enquanto faltarem as novas tarefas obrigatórias de PDF/quiz; não inventar a conclusão desses requisitos.
- A projecção para o docente consome o agregado actual. O comprovativo de registo pode estar disponível mesmo quando a actividade ainda aguarda outras tarefas. Não expor conversas privadas nesta projecção.
- Preservar cores, menu lateral, header e footer. Não criar backend ou dependências externas para executar os exemplos.

## 1. Finalidade

### Comunicação social dos participantes

O Painel do Estudante inclui um hub social independente das orientações do docente e das conversas de actividade. Comunidade, grupos por convite aceite e mensagens privadas têm contadores próprios e não alteram progresso. O docente não recebe esta comunicação pela projecção de dados. Autoria mostra nome e turma. O protótipo valida os fluxos localmente; autenticação, autorização efectiva e sincronização multiutilizador pertencem à futura integração.

### Pesquisa de participantes e contexto — 25 de Outubro de 2026

- No hub social, pesquisar participantes por nome e turma, sem distinguir maiúsculas ou acentos, tanto ao criar grupos como ao iniciar mensagens privadas. Lista com altura limitada e deslocamento interno; mostrar total de resultados e estado sem resultados. Excluir o próprio utilizador.
- A selecção múltipla de convidados mantém-se ao mudar a pesquisa e permite retirar cada selecção. Escolher um destinatário privado abre ou reutiliza a conversa existente. Só a confirmação do grupo emite convites; pesquisar não envia mensagens nem aceita convites.
- Uniformizar o painel e o popup como **Notificações de actividades**, preservando canais, contadores e resolução por destinatário. O hub social conserva a sua identidade separada.
- Esclarecimento explícito do utilizador: «Esta actividade em contexto» apresenta três cartões de **blocos do roteiro** — anterior, seleccionado e seguinte — pela ordem publicada. O seleccionado é o bloco a que pertence a actividade aberta, mesmo quando é diferente do bloco em curso da empresa. Esta decisão substitui a interpretação anterior de três actividades adjacentes. Exemplo: «Ideação → Criação de empresas → Início de actividades».
- Cada cartão mostra título, descrição e estado do bloco. O estado fica na mesma linha de «Bloco anterior», «Bloco seleccionado» ou «Próximo bloco», permitindo quebra do rótulo em espaços estreitos. Retirar destes três cartões as barras e as contagens de actividades concluídas. Conforme esclarecimento explícito do utilizador, retirar toda a síntese da actividade no cartão central: rótulo, nome, estado e contagem de tarefas. O nome do bloco abre o respectivo resumo em «Meu Percurso», sem alterar progresso. As acções permanecem nas tarefas e as barras das restantes vistas não são alteradas.
- Retirar os participantes dos três cartões de contexto. Na lista de tarefas, apresentar as colunas **Tarefa → Participantes → Estado → Acção**. Usar nomes abreviados e um único ícone por tarefa para consultar nomes completos e contribuições em tooltip. Os exemplos incluem contribuições próprias de cada tarefa concluída ou em curso; não repetir automaticamente a equipa da actividade. Nas tarefas por iniciar, bloqueadas ou sem dados, mostrar «—», com descrição acessível da ausência e sem ícone. A nota de proveniência acompanha a lista. A participação ilustrativa não confirma autoria nem altera progresso.
- Manter três posições nas extremidades, indicando início/fim e sem ligação quando não existir bloco adjacente. Um bloco futuro vazio existe no roteiro e deve aparecer como «Brevemente», sem barra nem conclusão fictícia; não conta para o progresso. Os cartões representam posição no roteiro, não relações de dependência: não usar «Desbloqueia» nem alterar precedências pela posição.

### Exemplos e contagens de tarefas — 25 de Outubro

«Ver tarefas» apresenta X de Y tarefas concluídas. O conteúdo corrente segue o [Roteiro SPEE consolidado](Roteiro_SPEE_Consolidado.md): 15 actividades, 48 tarefas e um bloco futuro vazio. A entrada oferece dois exemplos independentes: empresa a meio da constituição legal e empresa que acaba de iniciar. Os anteriores exemplos de tarefas são substituídos nos novos fixtures; o armazenamento anterior é preservado.

Evidências guardam ficheiro, autor e data; submetido não equivale a aprovado. Aceitar PDF, DOCX ou XLSX conforme a tarefa, até 2 MB, com confirmação explícita e persistência no browser. Não enviar documentos a entidades externas. Disponibilizar modelos editáveis e exemplos locais identificados. Capas geradas por IA representam vídeos previstos, sem simular reprodução de um vídeo inexistente.

A aplicação das condições do roteiro, os limites do armazenamento, as fontes pesquisadas e o catálogo estão em [Roteiro: exemplos e materiais](../../frontend/docs/roadmap-scenarios.md). A numeração não impõe precedências. Os alcances ainda por definir são escolhas reversíveis para validar UX, identificadas na DEC-028.

Este PRD descreve o núcleo partilhado de dados, comportamento e linguagem visual: modelo de dados, estados, progresso, eventos, auditoria, permissões, sincronização e padrões transversais. A linguagem visual comum não define uma interface única nem funde os protótipos.

O Painel é a camada de orientação e acompanhamento do percurso de simulação do SPEE. O estudante usa a vista **Meu Percurso** para saber o que já concluiu, o que está disponível, o que está bloqueado e qual é a próxima acção. O docente usa o **Painel do Docente** para acompanhar turmas e empresas, aprofundar actividades, compreender contribuições e realizar intervenções autorizadas.

Os dois protótipos permanecem separados e válidos. Apresentam perspectivas diferentes sobre a mesma fonte de estado e mantêm ecrãs e fluxos próprios dentro do enquadramento visual do simulador. O cabeçalho e o menu lateral reproduzem a referência fornecida pelo utilizador em 22 de Outubro de 2026. Nenhum deles calcula conclusão a partir de acessos, cliques, tempo de sessão ou volume de operações sem resultado confirmado.

## 2. Hierarquia das fontes

Este PRD aplica a seguinte ordem de autoridade:

1. decisões explícitas mais recentes do utilizador e reuniões de validação posteriores aos protótipos;
2. imagens mais recentes dos protótipos do estudante e do docente;
3. imagens anteriores, apenas para capacidades que não tenham sido substituídas ou contrariadas;
4. decisões registadas nos transcripts das reuniões;
5. requisitos transversais do backlog e da especificação do motor de processos.

Quando duas imagens apresentam designações ou comportamentos diferentes, a divergência não é resolvida por inferência. Fica registada em `PRD_03_Decisoes_Pendentes.md`.

### 2.1. Imagens de referência principais

| Perfil | Ecrã | Ficheiro de referência |
|---|---|---|
| Estudante | Meu Percurso | `output/mockups/estudante_v4/mission_control_estudante_v4_01_meu_percurso.png` |
| Estudante | Actividade em curso | `output/mockups/estudante_v4/mission_control_estudante_v4_02_actividade_em_curso.png` |
| Estudante | Actividade concluída | `output/mockups/estudante_v4/mission_control_estudante_v4_03_actividade_concluida.png` |
| Estudante | Percurso completo | `output/mockups/estudante_v4/mission_control_estudante_v4_04_percurso_completo.png` |
| Docente | Visão geral da turma | `output/mockups/docente_v3/mission_control_docente_v3_01_visao_geral.png` |
| Docente | Percurso da empresa | `output/mockups/docente_v3/mission_control_docente_v3_02_percurso_empresa.png` |
| Docente | Contribuição e pista de actividade | `output/mockups/docente_v3/mission_control_docente_v3_03_contribuicao_pista.png` |

O ecrã anterior `output/assets/mission_control_docente_intervencoes_auditoria_v1.png` mantém-se como referência complementar para intervenções auditadas, mas a sua integração na versão corrente depende de decisão explícita.

### 2.2. Artefacto excluído das fontes

O ficheiro `output/mission_control_unificado/mission_control_unificado_v1.png` resultou de uma interpretação incorrecta do âmbito. Não constitui um protótipo válido, não é fonte de verdade e não deve fundamentar requisitos ou decisões de interface. O ficheiro é mantido apenas porque a sua eliminação exige confirmação explícita do utilizador.

### 2.3. Referência visual do simulador

A imagem `output/mockups/referencias/simulador_menu_2026-10-22.png`, fornecida pelo utilizador, orienta as cores, o cabeçalho e o menu lateral das séries docente v3 e estudante v4. Conservam-se as treze entradas e a ordem original, com fundos claros, ícones turquesa e acções azuis. Os percursos e conteúdos centrais continuam específicos de cada perfil.

Esta adaptação visual não decide as rotas, os pontos de entrada nem as permissões do menu; esses aspectos permanecem na DEC-007. As séries anteriores estão preservadas como histórico. Os prompts e a revisão de cada série constam dos respectivos `README.md` e `prompts.json`.

## 3. Objectivos do núcleo comum

- Garantir que estudante e docente interpretam o mesmo estado sem contradições.
- Tornar visível a relação entre processo, bloco, actividade, critérios de conclusão, resultado e evidência.
- Indicar sempre o próximo passo e, quando aplicável, o motivo de bloqueio.
- Permitir aprofundamento progressivo desde um indicador agregado até ao evento ou resultado que o sustenta.
- Distinguir contribuição individual, trabalho colectivo e acções automáticas sem produzir classificações ou vigilância por volume de cliques.
- Preservar o histórico quando uma actividade é devolvida, corrigida, reaberta ou sincronizada novamente.

## 4. Modelo conceptual comum

```text
Instituição
└── Turma
    └── Empresa simulada
        └── Processo ou percurso
            └── Bloco ou etapa
                └── Actividade
                    └── Critério ou subactividade
                        └── Evento, resultado, documento ou evidência
```

O **SPEE Studio** configura definições, versões, estados, pesos, condições de conclusão, próximos passos e campos visíveis. O **motor de processos** executa as instâncias. Os módulos operacionais conservam os dados do respectivo domínio. A pista de actividade recebe eventos confirmados e fornece o estado que alimenta as duas vistas.

## 5. Estados comuns visíveis

As imagens actuais representam o seguinte núcleo comum:

| Estado | Significado de produto | Representação dominante |
|---|---|---|
| Não disponível | A actividade ainda não pode ser iniciada | cinzento com símbolo de indisponibilidade |
| Por iniciar | A actividade ainda não começou | cinzento neutro |
| Disponível | A actividade pode ser iniciada | turquesa ou verde-claro com ícone de acção, consoante o ecrã |
| Em curso | Existe trabalho confirmado, mas faltam critérios | âmbar ou azul, consoante o contexto |
| Bloqueado | Falta uma condição ou dependência identificável | cinzento/azul com cadeado e motivo |
| Devolvido | O resultado requer correcção | vermelho ou âmbar, com indicação da devolução |
| Concluído | Todos os critérios exigidos foram confirmados | verde com marca de confirmação |

Estados adicionais descritos no backlog — à espera de terceiro, submetido, aprovado, vencido e cancelado — carecem de correspondência visual e regras de apresentação aprovadas.

### 5.1. Projecção de estados no Painel do Docente

Actualização de 24 de Outubro: a mesma projecção aplica-se ao estudante, incluindo filtros e legendas. As duas perspectivas apresentam os quatro estados abaixo.

Na validação de 23 de Outubro de 2026, a vista do docente foi simplificada para quatro estados visíveis: **Concluído**, **Em curso**, **Por iniciar** e **Bloqueado**. A correspondência é:

| Estado de origem | Estado apresentado ao docente |
|---|---|
| Concluído | Concluído |
| Em curso | Em curso |
| Devolvido | Em curso |
| Disponível | Por iniciar |
| Não disponível | Por iniciar |
| Por iniciar | Por iniciar |
| Bloqueado | Bloqueado |

Esta projecção simplifica a leitura pedagógica e não elimina o histórico da transição de origem. Uma devolução continua registada na pista de dados, mas surge como trabalho em curso no Painel do Docente.

## 6. Regras de progresso

1. O progresso resulta de marcos, actividades ou critérios configurados e confirmados.
2. Abrir um ecrã, iniciar sessão, clicar num botão ou repetir uma operação não prova conclusão.
3. O volume de facturas, compras ou outros movimentos pode ser mostrado como resultado descritivo, mas não aumenta automaticamente o progresso global.
4. O cálculo usa a mesma definição e a mesma versão do percurso nas duas vistas.
5. Uma devolução, reabertura ou correcção recalcula o estado sem apagar o histórico.
6. O utilizador consegue aprofundar a percentagem até às actividades que a fundamentam.
7. A interface indica se os dados estão sincronizados e quando ocorreu a última actualização.
8. Os pesos exactos e a terminologia final do indicador global são decisões pendentes.

## 7. Requisitos funcionais comuns

| ID | Requisito |
|---|---|
| MC-COM-001 | O sistema deve calcular as vistas do estudante e do docente a partir da mesma pista de actividade. |
| MC-COM-002 | Cada instância deve manter contexto de instituição, turma, empresa, processo, bloco, actividade e critério ou subactividade. |
| MC-COM-003 | Cada actividade deve apresentar estado actual, resultado conhecido, dependências e próximo passo aplicável. |
| MC-COM-004 | Uma actividade só pode ficar concluída quando a condição de conclusão e o resultado ou evidência exigidos estiverem confirmados. |
| MC-COM-005 | O sistema deve conservar actor, papel, instante, origem, estado anterior, estado posterior e versão aplicável a cada transição. |
| MC-COM-006 | Correcções, devoluções e reaberturas devem acrescentar eventos, sem substituir os eventos anteriores. |
| MC-COM-007 | Cada indicador agregado deve permitir aprofundamento até às actividades, resultados ou eventos que o sustentam. |
| MC-COM-008 | As vistas devem indicar estado de sincronização; dados pendentes não podem ser apresentados como confirmação final. |
| MC-COM-009 | Acções humanas, colectivas, institucionais e automáticas devem ser distinguíveis. |
| MC-COM-010 | As permissões devem considerar papel, turma, empresa, processo e operação solicitada. |
| MC-COM-011 | O Painel deve abrir o módulo operacional apropriado para executar ou consultar o resultado, sem duplicar o formulário do simulador. |
| MC-COM-012 | A navegação de retorno deve preservar o contexto de origem, filtros e actividade seleccionada. |
| MC-COM-013 | Cada instância deve referenciar versões explícitas do percurso, das regras e do pacote de jurisdição. |
| MC-COM-014 | Os dados apresentados devem ser minimizados de acordo com o perfil; o estudante não recebe avaliações confidenciais nem dados restritos de colegas. |
| MC-COM-015 | A linguagem dos estados, ícones e cores deve permanecer coerente entre ecrãs, com texto que não dependa exclusivamente da cor. |
| MC-COM-016 | Dados ilustrativos usados em protótipos devem ser claramente identificados como fictícios. |

## 8. Contrato mínimo de evento

| Campo | Finalidade |
|---|---|
| `event_id` | Identificação única do evento |
| `event_type` | Tipo versionável, por exemplo `activity.completed` |
| `occurred_at` | Data e hora em que o facto ocorreu |
| `producer` | Módulo que confirmou o facto |
| `actor_id` e `actor_role` | Actor e papel no contexto do processo |
| `institution_id`, `class_id`, `company_id` | Âmbito pedagógico autorizado |
| `process_instance_id` | Instância do percurso |
| `step_id`, `activity_id`, `subactivity_id` | Elementos do roteiro afectados |
| `previous_status`, `new_status` | Transição confirmada |
| `result` | Resultado mínimo necessário para interpretação |
| `evidence_id` ou `document_id` | Referência autorizada à evidência |
| `correlation_id` | Ligação entre operações de diferentes módulos |
| `definition_version` | Versão da definição executada |
| `sync_status` | Estado da sincronização |

## 9. Padrões de interface partilhados

- Cabeçalho com contexto do utilizador, estado de sincronização e progresso quando aplicável.
- Navegação por aprofundamento, sem perder o caminho de retorno.
- Estados com rótulo textual, ícone e cor consistente.
- Acção principal única em cada modal de actividade.
- Explicação explícita para bloqueios e dependências.
- Resultados e evidências abertos no módulo do simulador responsável.
- Dados densos em tabelas filtráveis; gráficos apenas quando ajudam a interpretar o estado.
- Ausência de rankings de estudantes ou métricas de presença disfarçadas de desempenho.

### 9.1. Design aprovado em 24 de Outubro de 2026

A referência aprovada é `output/mockups/referencias/mission-control-design-aprovado-2026-10-24.png` (primeira imagem anexada à aprovação). Substitui as explorações visuais anteriores apenas quanto ao look and feel da **área funcional de conteúdo**. A imagem de recorte das notificações identifica o grupo a tornar expansível, não uma segunda alternativa visual.

**Limite obrigatório:** não alterar menu lateral, header, footer, respectivos ícones, cores, dimensões ou comportamento. Os elementos do shell desenhados na imagem não são autorização para modificar o template. As features continuam independentes do AppShell e o seu CSS não deve atingir o shell.

Padrão comum para as duas perspectivas, sem uniformizar os seus fluxos:

- Preservar as cores institucionais: azul de acção `#087EFF` (variante de contraste `#076DD7`), ciano, branco e cinzentos claros. Sem modo escuro ou mudança de identidade.
- Conteúdo em superfícies brancas, contornos azul-cinza claros (`#DCE7F3`), cantos de aproximadamente 8–10 px, sombras mínimas e hierarquia tipográfica sans-serif. Manter a fonte disponível no projecto, sem depender de fontes remotas.
- Cartões de contexto com fundo muito claro; bloco seleccionado destacado com traço azul superior. Estados acompanhados por texto e ícone: verde para Concluído, âmbar para Em curso, ciano para Por iniciar e cinzento para Bloqueado.
- Ícones lineares de apoio e acções discretas de contorno. Os participantes aparecem na linha da tarefa, antes do estado, com nomes abreviados e um ícone de informação conjunto; contribuições em tooltip por hover, clique/toque ou foco. Os cartões de contexto mostram apenas informação dos blocos. Manter uma nota discreta de proveniência junto da lista de tarefas, sem etiquetas «Dados simulados» repetidas.
- Checklist com divisórias suaves e badges de estado. Materiais de apoio mantêm-se expansíveis, com ícone e contagem por formato.
- Os fixtures devem incluir participantes e contribuições fictícias contextualizadas por tarefa, apresentados apenas após início ou conclusão. Não confundir estes metadados com evidência real nem com autoria confirmada. Completar metadados ausentes através do adaptador, preservando listas personalizadas, estados, respostas, submissões, eventos e revisão.
- Preservar a sequência funcional e a organização dos conteúdos; adaptar as colunas ao espaço disponível em ecrãs pequenos, sem esconder acções ou provocar deslocação horizontal da página.

A referência aplica-se às páginas do estudante e do docente. No docente abrange a visão geral, a matriz de empresas, o percurso da empresa, as contribuições e os diálogos de detalhe e orientação. A uniformização é visual: preserva fluxos, filtros, permissões, dados, cálculos e navegação próprios de cada perspectiva. Menu lateral, header e footer permanecem intactos.

No docente, os indicadores são cartões compactos com ícones, as tabelas têm cabeçalhos suaves e deslocação própria, e o bloco seleccionado recebe destaque azul superior. Estados usam a mesma correspondência cromática do estudante, sempre com texto e ícone. Orientações usam cartões de contorno claro; diálogos usam título compacto, superfícies suaves e altura limitada à janela. Os estilos pertencem à feature e aos seus diálogos, incluindo quando renderizados sem AppShell.

### 9.2. Grupo de notificações na página da actividade

O padrão visual aplica-se também ao Percurso completo: painéis brancos com cabeçalhos suaves, contornos claros, destaque azul no bloco actual e barras segmentadas por actividade. Manter consistência de tipografia, estados e espaçamento com o Meu Percurso, sem modificar menu lateral, header ou footer.

O popup segue o mesmo padrão visual do conteúdo: contornos azul-cinza claros, cartões de fundo muito suave e cantos de 10 px, título compacto e hierarquia entre actividade, autor e mensagem. «Abrir conversa» é uma acção azul; «Marcar como resolvida» usa botão de contorno. Separadores têm ícones e badges, sem alterar as cores institucionais. O histórico fica num rodapé discreto. Limitar a altura à janela e deslocar apenas o conteúdo, mantendo título, fecho e separadores acessíveis. Os estilos são locais ao popup, sem afectar outros diálogos ou o shell.

| ID | Critério de aceitação |
|---|---|
| MC-UI-001 | Nos formulários do estudante, as notificações abrem num único popup tabulado, inicialmente fechado a cada entrada ou recarregamento. |
| MC-UI-002 | O painel clicável mostra total na primeira linha e badges por canal na segunda, com pendências do destinatário. Actividade aparece apenas em contexto de actividade. |
| MC-UI-003 | Clicar em qualquer ponto do painel abre o popup; os separadores apresentam pendências com actividade, autor, mensagem, acesso à conversa e resolução explícita. Não expandir cartões na página. |
| MC-UI-004 | Abrir, fechar ou ler não resolve notificações, não conclui tarefas nem altera progresso. |
| MC-UI-005 | Suportar Enter/Espaço no painel, setas/Home/End nos separadores, Escape para fechar e devolução de foco ao painel. Loading/erro têm indicação própria e opção de tentar novamente. |
| MC-UI-006 | Ligações com canal continuam a abrir o chat da actividade. Permitir reabrir a mesma conversa; preservar o histórico persistido e os rascunhos durante mudanças de canal no chat. |
| MC-UI-007 | Nos quatro formulários do estudante (Meu Percurso, Percurso completo, detalhe e registo da empresa), apresentar um único painel clicável à direita do título principal. Primeira linha: «Notificações de actividades» e total; segunda linha: badges Docente/Grupo e Actividade quando contextual. O painel abre directamente um popup tabulado, inicialmente fechado, em vez de expandir cartões na página. Em ecrãs estreitos, permitir quebra de linha sem overflow. Manter progresso global junto do título, marcos abaixo e ligação ao percurso completo apenas no Meu Percurso. Não alterar o shell. |
| MC-UI-008 | Mostrar um badge de total junto de «Notificações de actividades», visível com o popup fechado. Por decisão explícita do utilizador, somar os três badges visíveis: Docente 2 + Grupo 1 + Actividade 1 = total 4 no cenário inicial. É uma soma das pendências apresentadas por categoria, não uma contagem de mensagens distintas; a mesma mensagem pode contribuir para duas categorias. Mostrar zero quando não há pendências; durante carregamento ou erro, apresentar indicação própria, não um total parcial como definitivo. Actualizar após resolução explícita. |

### 9.3. Compactação após anotações no browser — 24/10/2026

As seis anotações posteriores à aprovação visual prevalecem sobre os detalhes de apresentação da imagem original. Não alteram menu lateral, header, footer, cores principais, permissões nem persistência.

- Participantes: coluna da lista de tarefas imediatamente antes de Estado. Nomes compactos, por exemplo «Ana M., João T. e António S.», seguidos de um único ícone. Tooltip conjunto com os nomes completos e contribuições específicas dessa tarefa; abrir por hover, clique/toque ou foco, fechar com Escape ou ao sair da interacção. Em espaços estreitos, a linha reorganiza-se e explicita o rótulo «Participantes», mantendo Estado e Acção disponíveis. Sem dados de participação, mostrar «—» com descrição acessível e sem ícone. Esta regra substitui a colocação nos cartões de contexto.
- No roteiro actual, a execução pertence às linhas das tarefas. Os cartões de contexto navegam pelos nomes dos blocos; não contêm botões de execução de actividades. Esta regra substitui a disposição de 24/10/2026.
- Remover etiquetas «Dados simulados» repetidas; a nota de proveniência mantém clara a natureza ilustrativa dos dados, sem sugerir participação real confirmada.
- As listas de actividades e os botões «Ver tarefas» conservam contagens confirmadas. Os três cartões de blocos do detalhe mostram apenas o estado junto do rótulo, sem contagem nem síntese da actividade, conforme revisão de 25/10/2026. Nunca inferir conclusão pela navegação.
- Retirar o estado e a frase de contagem redundantes acima dos cartões.
- Cabeçalho da actividade: «Registar empresa | Próxima actividade: <designação> <acção>». Mostrar apenas quando existe um passo ainda não confirmado do checklist actual e a actividade não está concluída nem bloqueada. No cenário inicial: «Submeter o formulário de registo», com acção para continuar no formulário. Após conclusão, ocultar todo o bloco, sem o substituir por uma actividade sucessora. Os blocos adjacentes permanecem acessíveis nos cartões de contexto. Sem passo pendente definido, omitir igualmente o segmento. Substitui a descrição isolada acima do contexto, sem apagar a descrição nos dados. O cabeçalho e o checklist usam a mesma fonte de confirmação; clicar não altera progresso.

## 10. Requisitos não funcionais

| Área | Requisito |
|---|---|
| Acessibilidade | Navegação por teclado, foco visível, rótulos para leitores de ecrã, contraste adequado e estados não dependentes apenas da cor. |
| Responsividade | Preservar as tarefas principais em ecrãs menores; o comportamento móvel definitivo carece de protótipo próprio. |
| Desempenho | Carregamento progressivo e paginação ou virtualização técnica quando o volume o exigir, sem alterar o modelo de interacção aprovado. |
| Resiliência | Falhas de sincronização não podem produzir conclusões falsas; o estado deve ser recuperável. |
| Segurança | Autorização contextual, registo de acções privilegiadas e minimização de dados pessoais. |
| Internacionalização | Textos, datas, estados e pacotes de jurisdição devem ser configuráveis e versionados. |
| Auditabilidade | Toda a intervenção material deve conservar actor, motivo, instante, efeito e histórico. |

## 11. Critérios de aceitação do núcleo comum

- A mesma actividade apresenta o mesmo estado confirmado ao estudante e ao docente.
- O estudante consegue responder ao que está feito, ao que falta e ao próximo passo.
- O docente consegue identificar quem participou, o resultado confirmado e o que permanece pendente.
- Uma actividade concluída pode ser rastreada até ao evento e resultado que confirmaram a conclusão.
- Uma actividade devolvida conserva a versão anterior e apresenta a nova acção necessária.
- Um estado não sincronizado é visível e não é confundido com confirmação final.
- Nenhum indicador de contribuição é calculado apenas com base em cliques ou tempo de sessão.

## 12. Fora do âmbito desta iteração

- Fusão, composição lado a lado ou criação de uma interface única para docente e estudante.
- Criação de um novo protótipo que combine os ecrãs dos dois perfis.
- Redesenho do menu real do simulador.
- Implementação do motor de processos, do SPEE Studio ou dos conectores de módulos.
- Definição final de pesos, prazos pedagógicos, retenção de dados e catálogo completo de intervenções.
- Comunicação comercial entre ciclos ou instituições.

## Actualização transversal de 24 de Outubro de 2026

No Meu Percurso, o resumo/progresso do bloco e as suas actividades formam um único painel visual, com separador interno discreto entre resumo e filtros/lista. A composição mantém componentes separados por responsabilidade, sem dependência do shell; header, menu lateral e footer não são alterados.

Os quatro indicadores do bloco alinham-se à direita do título grande e da barra de progresso, não junto do rótulo «Bloco actual». A barra ocupa apenas a coluna esquerda e termina antes dos indicadores. Quando não houver largura suficiente, o resumo passa para baixo, mantendo a grelha 2 × 2.

A barra do bloco usa segmentos iguais, um por actividade pela ordem do percurso, com as cores dos estados: verde (Concluído), âmbar (Em curso), ciano (Por iniciar) e cinzento (Bloqueado). A informação não depende apenas da cor: conservar contagem de concluídas, legenda existente e descrição acessível dos estados por actividade. Filtros não reduzem o número de segmentos; a barra global permanece inalterada.

As ferramentas de demonstração são removidas de ambas as interfaces, incluindo importação/exportação/reposição de cenários e metadados visuais de armazenamento. A persistência temporária e os dados existentes permanecem; retirar controlos não autoriza limpar o armazenamento. Erros mantêm mensagem e tentativa de leitura, sem reposição destrutiva pela UI.

Pré-visualizações mostram exclusivamente notificações pendentes do destinatário, no máximo três por cartão, mais recentes primeiro. O histórico completo continua no chat. Participação/contribuição permanece por definir durante a integração (DEC-012), sem novas inferências a partir de mensagens ou navegação.


## Coerência entre os dois painéis e os exemplos — 25/10/2026

O Painel do Docente deve ler simultaneamente os dois exemplos do estudante, sem depender da selecção activa na entrada. A estrutura de blocos, actividades, tarefas e precedências vem das mesmas fontes. As realizações de cada empresa são independentes: respostas, ficheiros submetidos, nomes, datas, estados e contagens nunca passam de um exemplo para outro.

A composição liga os dois repositories do estudante ao contrato do docente, sem dependências entre componentes. O armazenamento do docente é comum e as comunicações são contextualizadas por empresa/turma; estudante e hub mantêm armazenamento separado por exemplo. A transição preserva os snapshots anteriores e não repõe progresso.

Tarefas obrigatórias concluídas com data podem sustentar a conclusão inicial da actividade. Nas duas empresas ligadas ao estudante, não criar eventos ou resultados fictícios para completar a pista de actividade; distinguir equipa, participação ilustrativa e autoria documentada. Sem dados de prazo/autoria/resultado, mostrar a ausência. O primeiro ano fiscal continua «Brevemente», fora dos cálculos. O docente consulta, não executa tarefas.

Ver regras e critérios no PRD do Docente v0.13 e detalhes em `frontend/docs/roadmap-scenarios.md`. Esta revisão não altera menu lateral, header ou footer.

### Cenários adicionais do docente — 25/10/2026

A matriz do docente passa a conter dez empresas: as duas projecções dos estudantes e oito cenários fictícios independentes, com equipas próprias, três turmas e progressos variados sobre o mesmo roteiro. Não inferir nem acrescentar realizações às empresas ligadas. Os novos fixtures podem conter eventos e metadados de submissão simulados, sem documentos emprestados de outra empresa nem comprovativos oficiais.

A listagem deixa de mostrar «Exemplo 1» e «Exemplo 2», mantendo nomes e percentagens. A entrada do estudante conserva os dois exemplos. Dados existentes são preservados e a migração acrescenta apenas os IDs em falta. Não alterar o AppShell.

### Participação ilustrativa na vista do docente — 25 de Outubro de 2026

Por pedido explícito, o docente vê participantes simulados em todas as actividades concluídas do protótipo. Nas empresas ligadas ao estudante, a síntese reúne os intervenientes definidos nas tarefas concluídas, sem duplicar nomes nem incluir membros de outra empresa. Matriz, tabela e detalhe devem ser coerentes. Uma nota discreta identifica a participação ilustrativa; não criar badges repetidos. Esta decisão complementa a coluna de participantes por tarefa no estudante.

A apresentação de exemplos não constitui autoria confirmada: guardar identificadores ilustrativos em campo separado e conservar os eventos, resultados, progresso e contagens com evidência. Tarefas por iniciar não recebem participação realizada por antecipação. O exemplo 2 continua sem realizações até haver acções explícitas.


### Resultados individuais dos quizzes — 25 de Outubro de 2026

No detalhe docente, cada quiz lista todos os participantes da empresa. Cada resposta identificada apresenta a pontuação individual (acertos/total e percentagem), com expansão das respectivas respostas. Quem não tem realização individual registada apresenta «Não concluído». A conclusão colectiva da tarefa não atribui a mesma nota a todos. Nos dois cenários do estudante, as respostas guardadas pertencem ao estudante identificado no contexto do cenário; os restantes membros não recebem resultados fictícios. Dados antigos sem autoria permanecem explicitamente identificados como resultado sem respondente, nunca distribuídos pela equipa. Esta consulta não altera estados nem progresso.


### Cabeçalho e comunicações de demonstração — 25 de Outubro de 2026

O selector de universidade surge ao lado do título «Painel do Docente», sem legenda visível, mantendo o nome acessível «Universidade». Em espaços estreitos pode passar para a linha seguinte. O cenário inclui cinco pedidos a aguardar resposta do docente, relativos a tarefas distintas de cinco empresas, e duas orientações gerais já publicadas para as três turmas. Os pedidos identificam a tarefa no assunto e na mensagem, dentro da actividade correspondente. A migração acrescenta estes exemplos uma única vez e preserva respostas, conclusões e comunicações existentes, sem alterar progresso.


## Coach IA simulado no hub social — 27/10/2026

O hub do estudante disponibiliza o separador «Coach IA», identificado como simulação local. Permite escolher uma actividade, escrever perguntas e usar sugestões sobre blocos, tarefas, materiais, próximo passo e bloqueios. As respostas determinísticas utilizam o roteiro e estados actuais do exemplo seleccionado, consultados de novo em cada pergunta. Não há serviço de IA externo, avaliação, submissão nem alteração do progresso. Perguntas não reconhecidas recebem uma explicação dos limites e encaminhamento para o docente.

O contrato CoachRepository pertence ao hub; app/providers adapta a API pública do percurso para este contrato. A UI não conhece fixtures ou armazenamento. A conversa é efémera e reinicia ao sair do separador ou fechar o hub. Apresentar carregamento, indisponibilidade e falha recuperável, preservando o rascunho. O coach é separado das mensagens entre participantes e dos respectivos contadores de não lidas.


## Actualização do roteiro e links provisórios — 02/11/2026

O roteiro mantém 15 actividades e passa de 48 para 52 tarefas. Acrescentam-se Conhecer as empresas do mercado (Ideação), Inscrever no INSS, Consultar documentos e regras bancárias e Aceder à banca electrónica (Início de actividades). As tarefas novas são obrigatórias, por iniciar, sem novas dependências bloqueantes. Preservam-se as conclusões anteriores; uma actividade antes concluída pode passar a Em curso até concluir a nova tarefa.

A tarefa Celebrar contratos de custos fixos passa a Contratar fornecedores, mantendo o ID e a actividade Celebrar contratos de serviços. O popup disponibiliza quatro botões: arrendamento, energia, água e Internet/correio electrónico. Preparar a inscrição no INSS apresenta dois botões de referência. Actualizam-se também as ligações ao BAU e ao ERP (página de autenticação).

O catálogo editável é [Links_Provisorios_Tarefas.md](Links_Provisorios_Tarefas.md): 12 botões em oito tarefas, todos provisórios. As ligações abrem novo separador e nunca confirmam conclusão. O estado continua dependente da confirmação/evidência. A consulta do docente apresenta as mesmas ligações e preserva os registos de cada empresa. Os URLs não constituem integração automática com sistemas externos.


## Preparação para a demonstração — pré-requisitos concluídos (02/11/2026)

Por pedido do utilizador, a composição do protótipo activa `demoPrerequisites` nos dois exemplos. As 18 tarefas referenciadas por `dependsOn` são apresentadas como concluídas, com respostas e evidências de exemplo quando necessárias. As restantes tarefas conservam os seus estados, permitindo demonstrar a sua execução sem realizar primeiro os pré-requisitos. Não são criados eventos de realização real. Conclusões e submissões já existentes são preservadas.

A preparação é aplicada no repository antes de calcular os estados agregados, pelo que o docente e o estudante apresentam os mesmos resultados. As regras de dependência permanecem intactas. A leitura não escreve no armazenamento; uma mutação posterior guarda o cenário preparado. Os fixtures de partida permanecem preservados. Para regressar à experiência com bloqueios, desactivar o terceiro argumento de `createPanelRepositories` em AppProviders e usar um cenário inicial sem alterações guardadas. O exemplo 2 deixa, durante esta preparação de demo, de representar zero tarefas realizadas.


## Contratos por fornecedor e abertura de conta — revisão de demonstração

«Contratar fornecedores» passa a quatro tarefas independentes na actividade Celebrar contratos de serviços: Arrendar espaço de trabalho (`b03-a03-t01`), Contratar fornecimento de energia eléctrica (`b03-a03-t03`), Contratar fornecimento de água (`b03-a03-t04`) e Contratar fornecimento de Internet e correio electrónico (`b03-a03-t05`). Cada tarefa tem estado, acção e uma ligação própria. Os endereços existentes são preservados no catálogo editável.

«Abrir a conta bancária» mantém o ID `b03-a03-t02` por compatibilidade com registos anteriores, mas pertence agora a Preparar as operações bancárias (`preparar-banca`), depois de Consultar documentos e regras bancárias e antes de Aceder à banca electrónica. O roteiro passa a 55 tarefas em 15 actividades.

Migração: o estado da conta acompanha a tarefa para a nova actividade; uma conclusão anterior do contrato agregado é preservada nas quatro tarefas que o desdobram. Registos individuais já existentes têm precedência. Não se duplicam tarefas. O modo de demonstração continua a pré-concluir os pré-requisitos.


### Identificação de tarefas do Mercado Real

As tarefas com ligações HTTP(S) fora de `spee.ac.mz`, dos seus subdomínios e de `speedev.simulacao.co.mz` apresentam o sufixo **(Mercado Real)** no título, incluindo listas, próxima tarefa e popup de consulta. Basta uma ligação externa entre os destinos efectivos da tarefa. Recursos locais não recebem o sufixo. A indicação é calculada a partir dos URLs actuais, sem alterar IDs, estados ou títulos persistidos. O mesmo critério aplica-se ao estudante e ao docente.
