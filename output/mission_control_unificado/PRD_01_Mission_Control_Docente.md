# PRD do Painel do Docente

## Selector de universidade — 25 de Outubro de 2026

### Realização de tarefas no detalhe da actividade

O popup «Detalhes» apresenta as tarefas da actividade, na ordem do estudante, com contagem concluídas/total, tipo, estado, data disponível, pontuação e consulta de respostas de quizzes, e metadados e ligação para evidências PDF, DOCX ou XLSX submetidas. É exclusivamente de leitura: o docente não executa nem conclui tarefas. Submissão não significa aprovação. Preservar os restantes detalhes e resultados.

O docente consulta simultaneamente Horizonte Verde (exemplo 1) e Nascente Criativa (exemplo 2), projectadas dos respectivos repositories do estudante através da composição. Não importar componentes da outra feature nem expor conversas privadas. A vista inclui também oito empresas fictícias independentes, num total de dez, construídas com o roteiro actual. Não são importados os registos dos cenários antigos; os seus fixtures e dados permanecem preservados para consulta histórica e testes de regressão.

Na vista geral, entre o título e o subtítulo da turma/ano, apresentar um dropdown «Universidade»: Universidade Eduardo Mondlane (inicial), Universidade Pedagógica de Maputo e Universidade Joaquim Chissano. A escolha fica na URL e é preservada ao limpar filtros de turma/estado/prazo. Nesta etapa valida-se a selecção visual; os dados de demonstração ainda são comuns às três opções, sem simular isolamento institucional ou permissões. O shell mantém-se inalterado.

**Versão:** 0.13
**Data:** 25 de Outubro de 2026
**Estado:** actualizado após validação funcional com Leila Omar e alinhamento com o design aprovado
**Depende de:** `PRD_00_Mission_Control_Comum.md`  

## Apresentação visual aprovada — 24 de Outubro de 2026

Aplicar a secção 9.1 do PRD comum à visão geral, percurso da empresa, contribuições, orientações e respectivos diálogos. Preservar integralmente menu lateral, header e footer.

No cabeçalho do percurso da empresa, apresentar o nome da empresa, a turma e a identificação do exemplo. Não mostrar a versão técnica do percurso (por exemplo, `percurso-demo-v1`); esta mantém-se nos dados para identificação e consistência, sem ocupar o subtítulo da interface.

Na empresa ligada à experiência do estudante, o estado da actividade agrega as tarefas obrigatórias conforme a decisão de 25 de Outubro do PRD comum. A confirmação do registo pode disponibilizar o comprovativo sem concluir «Registar empresa», caso faltem o material obrigatório ou o quiz. Eventos de conclusão de tarefas actualizam a mesma origem, preservando a privacidade das conversas do grupo.

- Painéis brancos, contorno azul-cinza `#DCE7F3`, cantos de 10 px e fundos suaves `#F7FBFF`; evitar contornos escuros e sombras pesadas.
- Títulos e indicadores compactos, hierarquia legível e ícones lineares. Manter azul e ciano institucionais.
- Estados em pills com texto e ícone: Concluído verde, Em curso âmbar, Por iniciar ciano e Bloqueado cinzento, tanto nas tabelas como no percurso e no detalhe.
- Destacar o bloco seleccionado com fundo azul muito suave e traço azul superior, mantendo a selecção e os filtros existentes.
- Tabelas conservam deslocação interna e cabeçalhos/colunas fixos onde já existem; não provocar deslocação horizontal da página.
- Orientações em cartões suaves; formulários e diálogos com contornos claros, título compacto e scroll dentro da janela. Preservar foco, Escape, validação e feedback.
- Manter os fluxos de consulta, resposta, conclusão, rascunho, publicação e auditoria. A alteração visual não modifica progresso, permissões ou persistência, nem dá acesso às conversas privadas do grupo.
- Validar os três ecrãs principais sem AppShell no Storybook, os fluxos no browser e a apresentação em desktop e ecrãs estreitos.

## 1. Resultado esperado

O Painel do Docente permite acompanhar todas as turmas de um ciclo sem consultar sucessivamente os diferentes módulos do simulador. O docente começa na visão geral, identifica empresas ou marcos que requerem atenção, acompanha pedidos de orientação, abre o percurso de uma empresa e consulta o detalhe das actividades e respectivos resultados.

Este PRD descreve exclusivamente requisitos, permissões, fluxos e ecrãs do docente. O protótipo docente mantém-se separado do protótipo do estudante.

O painel não é um sistema de vigilância nem uma classificação de estudantes. O seu propósito é apoiar orientação pedagógica, diagnóstico de dependências e intervenções autorizadas.

## 2. Utilizadores e permissões

| Perfil | Capacidades previstas |
|---|---|
| Docente da turma | Consultar estados, prazos, participantes, resultados e pista de actividade da turma autorizada |
| Docente com permissão de orientação | Solicitar correcção ou orientar uma próxima acção dentro do âmbito atribuído |
| Avaliador | Consultar evidências e aplicar instrumentos de avaliação autorizados |
| Administrador funcional | Configurar acesso e resolver excepções operacionais, sem substituir o trabalho do estudante |

As permissões de consulta, orientação, correcção, avaliação e administração devem ser independentes.

## 3. Fluxo principal

```text
Visão geral das turmas
→ filtrar ou seleccionar uma empresa
→ percurso da empresa
→ detalhes da actividade, participantes, dependências e critério de conclusão
→ resultado ou evidência no módulo do simulador
→ responder ou iniciar uma orientação, quando aplicável
```

## 4. Ecrãs de referência

A série docente v3 aplica as cores, o cabeçalho e as treze entradas do menu lateral da referência do simulador de 22 de Outubro de 2026. A navegação específica do docente permanece na área central. A integração técnica do menu continua pendente na DEC-007.

### 4.1. Visão geral da turma

Fonte principal: `output/mockups/docente_v3/mission_control_docente_v3_01_visao_geral.png`.

Elementos representados:

- contexto do ciclo e das turmas;
- apresentação inicial de todas as turmas, com filtro opcional por turma;
- filtros por estado e prazo;
- pesquisa por empresa ou estudante;
- indicadores de empresas activas, conclusão média da simulação e pedidos de orientação;
- matriz de empresas por marco;
- percentagem global por empresa;
- estados por marco e identificação resumida de participantes;
- filtros combináveis por coluna;
- deslocamento horizontal e vertical, com controlos para avançar ou recuar uma coluna ou um conjunto de colunas visíveis;
- ícone de consulta que abre o percurso completo da empresa.

O filtro de roteiro foi retirado. O roteiro é configurado centralmente antes da abertura do ciclo e não constitui uma escolha operacional do docente.

O painel lateral e a lista fixa de alertas do protótipo anterior foram removidos para permitir que a matriz cresça. Alertas devem funcionar como sínteses accionáveis e, quando seleccionados, filtrar a matriz ou abrir a lista correspondente.

### 4.2. Percurso da empresa

Fonte principal: `output/mockups/docente_v3/mission_control_docente_v3_02_percurso_empresa.png`.

Elementos representados:

- nome da empresa e turma;
- indicadores de progresso global, actividades em curso, pedidos de orientação e prazos próximos;
- sequência dos blocos do percurso;
- tabela das actividades do bloco actual;
- participantes, estado, prazo e acção **Detalhes**;
- modal com descrição, definição de concluído, participantes, dependências, próximo passo e acesso contextual ao módulo do simulador;
- indicação de que o progresso resulta de eventos e resultados confirmados.

### 4.3. Pedidos e orientações

O indicador **Pedidos de orientação** abre conversas contextualizadas por empresa e actividade. O docente consulta a mensagem do estudante, responde no mesmo contexto e pode marcar a conversa como concluída sem apagar o histórico. Uma nova mensagem do estudante volta a colocar o pedido como aguardando resposta do docente.

O docente pode ainda iniciar orientações proactivas:

- para uma empresa, no respectivo percurso;
- para todas ou várias turmas, no painel abaixo da matriz principal.

A designação “pedido de orientação” distingue este fluxo de pedidos técnicos dirigidos ao helpdesk.

### 4.4. Contribuição e pista de actividade

A vista detalhada de contribuição e cronologia deixa de fazer parte do fluxo visível desta versão. A implementação e as referências visuais anteriores são preservadas como material exploratório, mas os seus acessos devem permanecer ocultos enquanto não forem definidos utilidade pedagógica, granularidade, retenção e capacidade real de rastreio.

Pode ser apresentada uma síntese agregada de participantes com evidência. Não devem ser exibidos rankings, contagens de cliques ou cronologias individuais cuja interpretação exceda os dados confirmados.

### 4.5. Intervenções e auditoria

Fonte complementar: `output/assets/mission_control_docente_intervencoes_auditoria_v1.png`.

O padrão visual apresenta fila de intervenção, motivo obrigatório, efeito previsto, evidências consultadas, confirmação explícita e histórico. Esta capacidade continua prevista, mas o catálogo de alertas, as permissões e a integração na navegação actual carecem de validação.

## 5. Requisitos funcionais

| ID | Requisito |
|---|---|
| MC-DOC-001 | A visão geral deve apresentar inicialmente todas as turmas do ciclo autorizado e permitir filtragem opcional por turma. O roteiro aplicado é informativo e não seleccionável pelo docente. |
| MC-DOC-002 | A visão geral deve permitir filtrar por estado, prazo, empresa ou estudante. |
| MC-DOC-003 | O painel deve mostrar empresas activas, conclusão média da simulação e pedidos de orientação que aguardam resposta do docente. |
| MC-DOC-004 | A conclusão média deve ser calculada a partir do progresso confirmado de cada empresa e da mesma definição usada na vista do estudante. |
| MC-DOC-005 | A matriz deve apresentar empresas nas linhas e marcos ou blocos nas colunas. |
| MC-DOC-006 | Cada linha deve mostrar a percentagem global da empresa e uma acção para abrir o respectivo percurso. |
| MC-DOC-007 | Cada coluna deve aceitar filtros de estado combináveis com os restantes filtros. |
| MC-DOC-008 | A matriz deve suportar crescimento vertical e horizontal, com cabeçalhos fixos e controlos para avançar ou recuar uma coluna ou o conjunto de colunas visíveis. |
| MC-DOC-009 | O indicador de pedidos deve abrir as conversas sem converter bloqueios, devoluções ou prazos em pedidos de orientação. |
| MC-DOC-010 | O percurso da empresa deve mostrar blocos, progresso global, actividades em curso, pedidos de orientação e prazos próximos. |
| MC-DOC-011 | A tabela do bloco actual deve mostrar actividade, participante ou participantes, estado, prazo e acção de consulta. |
| MC-DOC-012 | A acção **Detalhes** deve abrir estado, descrição, definição de concluído, participantes, dependências, próximo passo e resultados; a acção **Ver no simulador** abre o módulo responsável com contexto da empresa e actividade. |
| MC-DOC-013 | O docente deve responder a pedidos associados a uma empresa e actividade, preservando o histórico da conversa. |
| MC-DOC-014 | O docente deve conseguir marcar uma conversa como concluída; uma nova mensagem do estudante volta a colocá-la como pendente. |
| MC-DOC-015 | Uma actividade pode indicar mais de um participante; a interface não deve atribuir todo o resultado apenas ao actor que efectuou a última operação. |
| MC-DOC-016 | A contagem de ocorrências deve ser descritiva e nunca apresentada como classificação de mérito. |
| MC-DOC-017 | Resultados recentes devem ser consultáveis sem expor informação fora da turma autorizada. |
| MC-DOC-018 | O docente deve conseguir aprofundar um estado até ao evento, resultado ou evidência que o sustenta. |
| MC-DOC-019 | Uma intervenção material deve exigir motivo, apresentar o efeito previsto e pedir confirmação. |
| MC-DOC-020 | Intervenções devem preservar o histórico e registar actor, papel, data, motivo, estado anterior e estado posterior. |
| MC-DOC-021 | Uma intervenção não pode executar silenciosamente o trabalho do estudante. |
| MC-DOC-022 | O painel deve apresentar a última actualização e o estado de sincronização. |
| MC-DOC-023 | O docente deve iniciar orientações proactivas para uma empresa, para todas as turmas ou para várias turmas seleccionadas. |
| MC-DOC-024 | A vista docente apresenta apenas Concluído, Em curso, Por iniciar e Bloqueado; Devolvido corresponde a Em curso. |

## 6. Regras de pedidos de orientação

Decisão transversal de 24 de Outubro: o docente recebe apenas o canal de orientação da actividade. As conversas e tarefas privadas dos membros da empresa não podem ser consultadas pelo docente nem gerar notificações docentes. O conteúdo funcional do detalhe pode ser equivalente ao apresentado ao estudante, mantendo as permissões de cada perspectiva.

1. Um pedido nasce de uma mensagem do estudante associada à empresa e actividade em curso.
2. O contador inclui apenas pedidos que aguardam resposta do docente.
3. Uma resposta do docente muda o pedido para “aguarda estudante”, mas não apaga a conversa.
4. O docente pode marcar a conversa como concluída, incluindo quando respondeu presencialmente.
5. Uma nova mensagem do estudante reactiva o pedido.
6. Bloqueios, devoluções e prazos não criam automaticamente pedidos de orientação.

## 7. Regras de contribuição

1. Uma ocorrência representa uma acção de domínio confirmada, não um clique.
2. O mesmo resultado pode ter contribuição de vários estudantes e acções automáticas.
3. A interface deve distinguir autoria, validação, colaboração e automatização quando os eventos o permitirem.
4. A ausência de ocorrências não pode ser interpretada automaticamente como ausência de aprendizagem.
5. Qualquer uso da informação em avaliação exige critérios pedagógicos próprios e transparência para os estudantes.

## 8. Dados visíveis por nível

| Nível | Dados principais |
|---|---|
| Turma | empresas, conclusão média, alertas e sincronização |
| Empresa | percurso, estados, prazos, participantes e próxima acção |
| Actividade | critérios, responsáveis, resultado, estado e módulo de origem |
| Contribuição | actores, papéis, ocorrências confirmadas, trabalho colectivo e automatização |
| Evento | instante, actor, transição, resultado, evidência e correlação |

## 9. Critérios de aceitação

- O docente localiza uma empresa por pesquisa ou filtros e abre o percurso sem perder o contexto da turma.
- É possível combinar estados de dois marcos e obter apenas as empresas correspondentes.
- A matriz mantém-se utilizável com mais linhas e colunas através de deslocamento e controlos de navegação por coluna e por conjunto visível.
- A percentagem da empresa coincide com a percentagem apresentada ao estudante da mesma empresa e versão.
- Uma actividade apresenta descrição, definição de concluído, dependências e participantes confirmados, sem converter ocorrências em ranking.
- O docente abre o módulo de origem a partir dos detalhes e regressa ao mesmo ponto do Painel.
- O docente responde e conclui um pedido sem perder o histórico.
- O docente publica uma orientação proactiva para uma empresa ou para várias turmas.
- Qualquer intervenção autorizada apresenta o efeito previsto, exige motivo e fica auditada.
- O contador de pedidos corresponde apenas a conversas que aguardam resposta do docente.

## 10. Fora do âmbito visual actual

- Exportação da matriz. O backlog prevê exportação, mas o transcript e as imagens actuais não a incluem; a divergência permanece pendente.
- Redesenho do menu global do simulador.
- Avaliação automática da qualidade da contribuição.
- Comparação competitiva ou ranking entre estudantes e empresas.
- Definição final dos limiares de prazo, catálogo de intervenções e política de retenção.

## Continuação da validação de 24 de Outubro de 2026

Retirar as ferramentas e metadados de demonstração do Painel do Docente, incluindo a reposição de cenário no estado de erro. Preservar dados existentes, estados de erro e a acção funcional de actualizar dados. Os avisos de conteúdo ilustrativo não constituem ferramentas de demonstração.

A conversa docente–empresa é visível e respondível por todos os membros dessa empresa, com autoria individual preservada. Não dar acesso ao canal privado do grupo. A definição de participação permanece adiada até à integração com o simulador (DEC-012); não alterar a atribuição de participação com base nas conversas.

## Compatibilidade com o roteiro de 48 tarefas — 25/10/2026

As duas empresas reflectem simultaneamente as actividades, tarefas, respostas, ficheiros e progresso dos respectivos exemplos. Os pedidos/orientações usam as novas actividades na leitura e na escrita; as mensagens de salário do cenário anterior não são associadas a actividades diferentes. Os percursos anteriores permanecem arquivados, fora da vista corrente. O docente consulta resultados, não executa as tarefas do estudante. Preservar a separação das conversas privadas e o shell.

## Coerência dos blocos com o estudante — 25 de Outubro de 2026

Para cada uma das duas empresas, o estado de cada bloco é projectado do mesmo roteiro do estudante. Um bloco com tarefas disponíveis não passa a bloqueado apenas porque outra tarefa está bloqueada. Um bloco futuro sem actividades definidas apresenta «Brevemente» e uma explicação do estado vazio, sem sugerir tarefas executáveis.

O teste no browser confirmou a passagem da constituição de 4/7 para 7/7 tarefas e a consulta no docente do quiz, da pontuação e da evidência submetida, sem expor conversas privadas. Ver `output/roteiro-qa/usabilidade-2026-10-25/RELATORIO.md`.


## Alinhamento integral com os dois exemplos — 25/10/2026

Esta revisão substitui a projecção de apenas uma empresa dependente do exemplo seleccionado. A visão geral inclui sempre as duas empresas ligadas aos estudantes, juntamente com os oito cenários independentes, com os mesmos IDs estáveis em todas as páginas e conversas:

| Empresa | Registos iniciais | Progresso inicial |
| --- | --- | --- |
| Horizonte Verde, Lda. · Exemplo 1 | 24/48 tarefas; acolhimento e ideação concluídos; constituição legal com 4/7 tarefas e registo em rascunho | 7/15 actividades, 47% |
| Nascente Criativa, Lda. · Exemplo 2 | Nenhuma tarefa realizada; inicia no acolhimento; dependências posteriores por cumprir | 0/15 actividades, 0% |

São pontos de partida: se o utilizador já realizou tarefas, apresentar os seus valores actuais. Nunca repor o progresso para voltar a estes números. Nos fixtures, ambas pertencem à Turma A e têm os membros Ana Machava, João Tembe e António Sitoe; conservar essa identidade, sem inventar equipas diferentes.

- A matriz usa exactamente os cinco blocos do roteiro: Acolhimento e preparação, Ideação, Criação de empresas, Início de actividades e Primeiro ano fiscal. O último apresenta «Brevemente», não tem filtro de estado nem actividades inventadas e não entra no denominador.
- Cada célula abre o mesmo bloco da empresa escolhida, inclusive blocos vazios. Filtros por coluna respeitam o estado projectado do estudante; parâmetros antigos de marcos inexistentes não devem ocultar empresas.
- Os detalhes mostram as 15 actividades e as 48 tarefas de cada empresa, com a ordem, estado, respostas de quiz, pontuação calculada, conclusão datada e submissões da própria origem. O docente não executa tarefas nem vê conversas privadas de grupo/hub.
- Abrir um resultado não cria evidência. Não herdar prazos, módulos, referências, participantes ou resultados dos cenários antigos. Sem prazo na origem, mostrar «Sem prazo». Nas actividades concluídas, apresentar também os participantes simulados definidos nas tarefas, com uma nota discreta de proveniência. Sem participantes confirmados ou simulados aplicáveis, mostrar «Sem evidência». Membros da equipa ou descrições ilustrativas não comprovam execução.
- Conclusões iniciais sustentadas por tarefas obrigatórias concluídas e datadas são válidas. Não fabricar eventos, datas ou comprovativos para as justificar. Resultados de registo só aparecem quando existe um registo efectivamente confirmado; ficheiros submetidos mantêm nome, conteúdo, autor e data.
- Comunicações do docente usam armazenamento comum às duas empresas, com revisão de concorrência. Orientações/pedidos específicos ficam associados à empresa correcta; novas orientações gerais da Turma A chegam a ambas. Orientações antigas de um exemplo mantêm o âmbito original, mesmo quando a turma coincide.
- Migrar apenas comunicações compatíveis com as actividades actuais, preservando autor, conteúdo, data e identificadores salvo colisão entre exemplos. Conservar os snapshots anteriores intactos. Mensagens sobre actividades antigas não são reatribuídas por semelhança.
- Falha de leitura de um exemplo ou de migração apresenta erro, sem mostrar dados iniciais como se fossem actuais. Preservar a separação UI/services/repository e todo o AppShell.

Critérios de aceitação: comparar tarefas e metadados com ambos os repositories; efectuar uma conclusão no exemplo 2 e confirmar que só essa empresa muda; consultar respostas e evidência do exemplo 1; confirmar comunicação isolada por empresa, migração sem alteração dos originais, filtros e «Brevemente»; validar desktop, móvel e story sem AppShell.

## Dez empresas na listagem — 25/10/2026

A vista geral contém dez empresas distribuídas por três turmas. Horizonte Verde e Nascente Criativa continuam ligadas aos respectivos repositories do estudante; as oito restantes são cenários fictícios independentes do docente. Todas usam as mesmas 15 actividades, 48 tarefas e cinco blocos do roteiro actual. Não adicionar tarefas ao primeiro ano fiscal.

| Empresa adicional | Turma | Tarefas concluídas / total | Progresso por actividades |
| --- | --- | --- | --- |
| Maputo Soluções, Lda. | A | 48/48 | 100% |
| Beira Logística, Lda. | A | 40/48 | 80% |
| Índico Serviços, Lda. | B | 32/48 | 67% |
| Zambeze Comercial, Lda. | B | 27/48 | 53% |
| Nova Geração, Lda. | B | 23/48 | 47% |
| Lúrio Digital, Lda. | C | 17/48 | 33% |
| Pemba Turismo, Lda. | C | 9/48 | 20% |
| Inhambane Criativa, Lda. | C | 2/48 | 7% |

- Na **listagem de empresas**, apresentar nome e percentagem, sem as etiquetas «Exemplo 1» e «Exemplo 2». A escolha dos exemplos na entrada do estudante e a sua identificação nos dados mantêm-se.
- Os novos cenários têm equipas próprias, conclusões datadas, quizzes respondidos, metadados de submissão e prazos variados para testar pesquisa, filtros e detalhes. Estes registos são explicitamente fictícios; não alteram nem completam a autoria das duas empresas ligadas ao estudante.
- Nos novos cenários, uma submissão sem ficheiro mostra «Ficheiro não disponível neste cenário». Não ligar o documento de outra empresa nem inventar um comprovativo oficial. Os ficheiros das duas empresas ligadas mantêm a origem e o conteúdo.
- O carregamento de um browser com o cenário anterior acrescenta apenas as empresas e turmas em falta. Preserva revisões, orientações, progresso e registos existentes; não duplica empresas ao recarregar. A actualização do estudante substitui apenas a projecção da empresa correspondente.
- Pesquisa por empresa/participante e filtros por turma/estado/prazo abrangem as dez empresas. Inicialmente a distribuição é 4/3/3 empresas nas turmas A/B/C e a conclusão média é 45%.

Validar os filtros, os detalhes de uma nova empresa, a ausência das etiquetas na matriz, a migração não destrutiva e a fidelidade das duas origens do estudante. Manter menu lateral, header e footer intactos.

## Participantes simulados nas actividades concluídas — 25 de Outubro de 2026

Por anotação do utilizador, todas as actividades concluídas dos dez cenários devem apresentar participantes. Nas duas empresas ligadas ao estudante, reunir sem repetição os nomes dos metadados ilustrativos das tarefas concluídas, limitados aos membros dessa empresa. Usar a mesma origem do painel do estudante, sem atribuir toda a equipa indiscriminadamente. As oito empresas independentes mantêm os participantes dos seus registos simulados.

A tabela de actividades, o resumo de participantes na matriz e o popup de detalhe usam a mesma síntese. No detalhe, usar «Participantes» quando incluir simulação, com uma nota de proveniência; não os classificar como «com evidência». Não repetir badges «Dados simulados». Nas actividades não concluídas, conservar a participação sustentada pelos registos; não antecipar participação fictícia no exemplo 2.

Separar `simulatedParticipantIds` de `participantIds`. A primeira lista é apenas descritiva: não cria eventos, datas, resultados, submissões, pontuações ou progresso, nem entra na pista e nas contagens de participação com evidência. O contrato valida que todos os IDs pertencem à empresa. A leitura dos dados existentes passa a incluir estes metadados sem repor ou sobrescrever os registos dos estudantes.

Aceitação: três actividades do acolhimento e quatro da ideação de Horizonte Verde com nomes plausíveis; todas as actividades concluídas das dez empresas com participantes; Nascente Criativa inicial sem participação realizada; consulta/reload sem alteração de estados, progresso, eventos ou ficheiros; tabela e popup coerentes, incluindo Storybook sem AppShell.


### Resultados individuais dos quizzes — 25 de Outubro de 2026

No detalhe docente, cada quiz lista todos os participantes da empresa. Cada resposta identificada apresenta a pontuação individual (acertos/total e percentagem), com expansão das respectivas respostas. Quem não tem realização individual registada apresenta «Não concluído». A conclusão colectiva da tarefa não atribui a mesma nota a todos. Nos dois cenários do estudante, as respostas guardadas pertencem ao estudante identificado no contexto do cenário; os restantes membros não recebem resultados fictícios. Dados antigos sem autoria permanecem explicitamente identificados como resultado sem respondente, nunca distribuídos pela equipa. Esta consulta não altera estados nem progresso.


### Cabeçalho e comunicações de demonstração — 25 de Outubro de 2026

O selector de universidade surge ao lado do título «Painel do Docente», sem legenda visível, mantendo o nome acessível «Universidade». Em espaços estreitos pode passar para a linha seguinte. O cenário inclui cinco pedidos a aguardar resposta do docente, relativos a tarefas distintas de cinco empresas, e duas orientações gerais já publicadas para as três turmas. Os pedidos identificam a tarefa no assunto e na mensagem, dentro da actividade correspondente. A migração acrescenta estes exemplos uma única vez e preserva respostas, conclusões e comunicações existentes, sem alterar progresso.


## Actualização do roteiro e links provisórios — 02/11/2026

O roteiro mantém 15 actividades e passa de 48 para 52 tarefas. Acrescentam-se Conhecer as empresas do mercado (Ideação), Inscrever no INSS, Consultar documentos e regras bancárias e Aceder à banca electrónica (Início de actividades). As tarefas novas são obrigatórias, por iniciar, sem novas dependências bloqueantes. Preservam-se as conclusões anteriores; uma actividade antes concluída pode passar a Em curso até concluir a nova tarefa.

A tarefa Celebrar contratos de custos fixos passa a Contratar fornecedores, mantendo o ID e a actividade Celebrar contratos de serviços. O popup disponibiliza quatro botões: arrendamento, energia, água e Internet/correio electrónico. Preparar a inscrição no INSS apresenta dois botões de referência. Actualizam-se também as ligações ao BAU e ao ERP (página de autenticação).

O catálogo editável é [Links_Provisorios_Tarefas.md](Links_Provisorios_Tarefas.md): 12 botões em oito tarefas, todos provisórios. As ligações abrem novo separador e nunca confirmam conclusão. O estado continua dependente da confirmação/evidência. A consulta do docente apresenta as mesmas ligações e preserva os registos de cada empresa. Os URLs não constituem integração automática com sistemas externos.


## Preparação para a demonstração — pré-requisitos concluídos (02/11/2026)

Por pedido do utilizador, a composição do protótipo activa `demoPrerequisites` nos dois exemplos. As 18 tarefas referenciadas por `dependsOn` são apresentadas como concluídas, com respostas e evidências de exemplo quando necessárias. As restantes tarefas conservam os seus estados, permitindo demonstrar a sua execução sem realizar primeiro os pré-requisitos. Não são criados eventos de realização real. Conclusões e submissões já existentes são preservadas.

A preparação é aplicada no repository antes de calcular os estados agregados, pelo que o docente e o estudante apresentam os mesmos resultados. As regras de dependência permanecem intactas. A leitura não escreve no armazenamento; uma mutação posterior guarda o cenário preparado. Os fixtures de partida permanecem preservados. Para regressar à experiência com bloqueios, desactivar o terceiro argumento de `createPanelRepositories` em AppProviders e usar um cenário inicial sem alterações guardadas. O exemplo 2 deixa, durante esta preparação de demo, de representar zero tarefas realizadas.
