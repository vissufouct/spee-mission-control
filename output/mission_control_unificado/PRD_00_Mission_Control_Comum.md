# PRD do Mission Control — núcleo comum

**Versão:** 0.12
**Data:** 24 de Outubro de 2026
**Estado:** rascunho consolidado para validação  
**Produto:** SPEE Mission Control  

## 1. Finalidade

Este PRD descreve o núcleo partilhado de dados, comportamento e linguagem visual: modelo de dados, estados, progresso, eventos, auditoria, permissões, sincronização e padrões transversais. A linguagem visual comum não define uma interface única nem funde os protótipos.

O Mission Control é a camada de orientação e acompanhamento do percurso de simulação do SPEE. O estudante usa a vista **Meu Percurso** para saber o que já concluiu, o que está disponível, o que está bloqueado e qual é a próxima acção. O docente usa o **Mission Control do Docente** para acompanhar turmas e empresas, aprofundar actividades, compreender contribuições e realizar intervenções autorizadas.

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

### 5.1. Projecção de estados no Mission Control do docente

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

Esta projecção simplifica a leitura pedagógica e não elimina o histórico da transição de origem. Uma devolução continua registada na pista de dados, mas surge como trabalho em curso no Mission Control do docente.

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
| MC-COM-011 | O Mission Control deve abrir o módulo operacional apropriado para executar ou consultar o resultado, sem duplicar o formulário do simulador. |
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
- Cartões de contexto com fundo muito claro; actividade actual destacada com traço azul superior. Estados acompanhados por texto e ícone: verde para Concluído, âmbar para Em curso, ciano para Por iniciar e cinzento para Bloqueado.
- Ícones lineares de apoio, acções secundárias de contorno e acção principal azul. Os participantes permanecem no cartão da actividade a que pertencem: apenas nomes e ícone de informação; contribuições em tooltip por hover, clique ou foco. Remover etiquetas «Dados simulados» dos cartões, mantendo uma nota discreta de proveniência do protótipo.
- Checklist com divisórias suaves e badges de estado. Materiais de apoio mantêm-se expansíveis, com ícone e contagem por formato.
- Os fixtures devem incluir participantes e contribuições fictícias contextualizadas nas actividades concluídas ou em curso onde fizer sentido. Evitar cartões vazios por falta de exemplos; não confundir esses exemplos com evidência real nem atribuir trabalho realizado a actividades ainda não iniciadas. Preservar a nota de proveniência.
- Preservar a sequência funcional e a organização dos conteúdos; adaptar as colunas ao espaço disponível em ecrãs pequenos, sem esconder acções ou provocar deslocação horizontal da página.

A aplicação inicial desta referência incide no detalhe da actividade do estudante e nos componentes que este reutiliza. O PRD fixa o padrão para evolução das restantes páginas; não implica reestruturação automática do Mission Control do docente.

### 9.2. Grupo de notificações na página da actividade

| ID | Critério de aceitação |
|---|---|
| MC-UI-001 | Nos formulários do estudante, as notificações abrem num único popup tabulado, inicialmente fechado a cada entrada ou recarregamento. |
| MC-UI-002 | O painel clicável mostra total na primeira linha e badges por canal na segunda, com pendências do destinatário. Actividade aparece apenas em contexto de actividade. |
| MC-UI-003 | Clicar em qualquer ponto do painel abre o popup; os separadores apresentam pendências com actividade, autor, mensagem, acesso à conversa e resolução explícita. Não expandir cartões na página. |
| MC-UI-004 | Abrir, fechar ou ler não resolve notificações, não conclui tarefas nem altera progresso. |
| MC-UI-005 | Suportar Enter/Espaço no painel, setas/Home/End nos separadores, Escape para fechar e devolução de foco ao painel. Loading/erro têm indicação própria e opção de tentar novamente. |
| MC-UI-006 | Ligações com canal continuam a abrir o chat da actividade. Permitir reabrir a mesma conversa; preservar o histórico persistido e os rascunhos durante mudanças de canal no chat. |
| MC-UI-007 | Nos quatro formulários do estudante (Meu Percurso, Percurso completo, detalhe e registo da empresa), apresentar um único painel clicável à direita do título principal. Primeira linha: «Notificações e conversas» e total; segunda linha: badges Docente/Grupo e Actividade quando contextual. O painel abre directamente um popup tabulado, inicialmente fechado, em vez de expandir cartões na página. Em ecrãs estreitos, permitir quebra de linha sem overflow. Manter progresso global junto do título, marcos abaixo e ligação ao percurso completo apenas no Meu Percurso. Não alterar o shell. |
| MC-UI-008 | Mostrar um badge de total junto de «Notificações e conversas», visível com o popup fechado. Por decisão explícita do utilizador, somar os três badges visíveis: Docente 2 + Grupo 1 + Actividade 1 = total 4 no cenário inicial. É uma soma das pendências apresentadas por categoria, não uma contagem de mensagens distintas; a mesma mensagem pode contribuir para duas categorias. Mostrar zero quando não há pendências; durante carregamento ou erro, apresentar indicação própria, não um total parcial como definitivo. Actualizar após resolução explícita. |

### 9.3. Compactação após anotações no browser — 24/10/2026

As seis anotações posteriores à aprovação visual prevalecem sobre os detalhes de apresentação da imagem original. Não alteram menu lateral, header, footer, cores principais, permissões nem persistência.

- Participantes: uma linha compacta, por exemplo «Participantes: Ana M., João T. e António S.», seguida de um único ícone de informação. Abre um único tooltip com todos os nomes completos e respectivas contribuições, por hover, clique/toque ou foco de teclado; Escape fecha. Abreviar pelo primeiro nome e inicial do último apelido, sem alterar os dados. Permitir quebra natural em ecrãs estreitos. Sem participantes, indicar a ausência sem ícone. O popup não deve exceder o cartão nem ocultar permanentemente outros conteúdos. Esta regra substitui os ícones individuais da primeira compactação.
- Acção junto da designação de cada actividade: Ver, Continuar actividade ou Iniciar actividade, segundo o estado. Permitir quebra de linha quando faltar espaço, sem truncar a acção.
- Remover etiquetas «Dados simulados» repetidas; a nota de proveniência mantém clara a natureza ilustrativa dos dados, sem sugerir participação real confirmada.
- Estado e critérios juntos em cada cartão: «Em curso (1 de 3)», «Concluído (2 de 2)». Os números resultam dos critérios existentes; não inventar contagens quando não há critérios definidos nem inferir conclusão pela navegação.
- Retirar o estado e a frase de contagem redundantes acima dos cartões.
- Cabeçalho da actividade: «Registar empresa | Próxima actividade: <designação> <acção>». Mostrar apenas quando existe um passo ainda não confirmado do checklist actual e a actividade não está concluída nem bloqueada. No cenário inicial: «Submeter o formulário de registo», com acção para continuar no formulário. Após conclusão, ocultar todo o bloco, sem o substituir por uma actividade sucessora. As sucessoras permanecem nos cartões de contexto. Sem passo pendente definido, omitir igualmente o segmento. Substitui a descrição isolada acima do contexto, sem apagar a descrição nos dados. O cabeçalho e o checklist usam a mesma fonte de confirmação; clicar não altera progresso.

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

As ferramentas de demonstração são removidas de ambas as interfaces, incluindo importação/exportação/reposição de cenários e metadados visuais de armazenamento. A persistência temporária e os dados existentes permanecem; retirar controlos não autoriza limpar o armazenamento. Erros mantêm mensagem e tentativa de leitura, sem reposição destrutiva pela UI.

Pré-visualizações mostram exclusivamente notificações pendentes do destinatário, no máximo três por cartão, mais recentes primeiro. O histórico completo continua no chat. Participação/contribuição permanece por definir durante a integração (DEC-012), sem novas inferências a partir de mensagens ou navegação.
