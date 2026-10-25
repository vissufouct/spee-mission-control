# PRD do Painel do Estudante

**Versão:** 0.16
**Data:** 25 de Outubro de 2026
**Estado:** actualizado com o roteiro de 48 tarefas e dois exemplos de empresas
**Depende de:** `PRD_00_Mission_Control_Comum.md`  

## Validação no browser — 25 de Outubro de 2026

- Os cartões dos exemplos descrevem o ponto de partida; a entrada deve explicar que visitas seguintes retomam alterações guardadas.
- Os PDF de exemplo incluem pré-visualização estática gerada do documento original e ligação de descarga, sem depender do plugin PDF do browser. Ficheiros enviados pelo utilizador nunca mostram a pré-visualização de um exemplo diferente; conservam o ficheiro real e a alternativa de descarga.
- O resultado do registo permite voltar directamente às tarefas da actividade. Não remete para ferramentas de reposição de cenário retiradas da interface.
- Validar os fluxos por interacção no browser, incluindo erros do quiz, confirmação de consulta, persistência e correspondência estudante/docente. Registar evidências em `output/roteiro-qa/usabilidade-2026-10-25/`.

## 1. Resultado esperado

### Hub social entre participantes — 25 de Outubro de 2026

Disponível em todas as páginas do estudante através de uma pequena seta fixa à direita, com badge de mensagens por ler, sem ocupar espaço no conteúdo. Abre um painel sobreposto que desliza da direita para a esquerda, ocupando aproximadamente 48% do ecrã em desktop e quase toda a largura em mobile. Pode fechar-se com Escape, botão ou clique exterior.

O hub inclui Comunidade, Grupos e Privadas, publicações com nome e turma, respostas contextuais, emojis e reacções. O topo permite criar grupos por nome e pesquisar participantes por nome ou turma; os convidados só entram depois de aceitarem. Mostrar convites recebidos com Aceitar/Recusar e os convites pendentes do grupo. Mensagens privadas são dirigidas a um participante identificado por nome e turma. Conteúdo de grupos exige pertença aceite; conversas privadas só são visíveis aos intervenientes.

A pesquisa não distingue maiúsculas/minúsculas nem acentos e combina termos de nome e turma. A lista de resultados tem deslocamento interno e indica quantos participantes encontrou; sem correspondências, apresenta orientação para alterar a pesquisa. Excluir o próprio estudante. Nos grupos, preservar as selecções entre pesquisas, mostrar os convidados seleccionados e permitir retirá-los; a criação exige pelo menos um convidado. Nas privadas, «Nova mensagem privada» abre a mesma pesquisa, com escolha única por nome e turma; seleccionar abre ou reutiliza a conversa e recolhe a pesquisa após sucesso. Em erro, manter a escolha disponível e mostrar a falha. Suportar teclado e ecrãs estreitos, sem nova dependência.

Cada separador mostra o total de mensagens por ler da respectiva categoria. Cada grupo e conversa privada mostra também o seu badge individual. Excluir mensagens próprias e canais sem pertença aceite; convites são sinalizados separadamente. «Marcar como lida» actualiza simultaneamente a conversa, a categoria e o total do hub. Apresentar zero com estilo neutro.

Popular com conversas fictícias entre turmas, uma conversa privada e um convite recebido para validar o percurso. Manter erros, estados vazios, rascunhos em falhas de envio, persistência local e contagem de mensagens por ler. Marcar a conversa como lida é uma acção explícita. Não inferir progresso a partir de publicações. Nesta etapa não há envio real nem sincronização entre browsers; a aceitação por outra pessoa é validada no contrato do repository, sem aceitação automática.

### Actualização de 25 de Outubro: execução por tarefa

Aplicar a decisão «actividades e tarefas» do PRD comum, que substitui o checklist passivo e os botões de execução nos cartões de actividade. «Próxima tarefa» identifica a primeira tarefa pendente executável e remete para a lista. Não aparece depois da conclusão de todas as tarefas.

O conteúdo corrente é o [Roteiro SPEE consolidado](Roteiro_SPEE_Consolidado.md): quatro blocos detalhados, 15 actividades e 48 tarefas, mais o primeiro ano fiscal por desenvolver. Esta versão substitui a antiga lista de seis tarefas de registo e a distribuição dos exemplos da ideação. O relatório de auditoria pertence agora à actividade «Auditoria I — trabalho de campo», conforme o novo roteiro; o diagnóstico permanece em «Encontrar uma ideia de negócio».

Na entrada do estudante, oferecer **Exemplo 1 — Horizonte Verde** (acolhimento e ideação concluídos; 4 de 7 tarefas da constituição legal concluídas, registo em curso) e **Exemplo 2 — Nascente Criativa** (zero tarefas realizadas). Os estados são independentes e persistem ao recarregar e alternar exemplos. O exemplo 1 começa com 7/15 actividades (47%); o exemplo 2 com 0/15 (0%).

A constituição legal reúne: consultar BAU; quiz de constituição/licenciamento; reservar nome; convidar sócios; registar empresa; declarar início; submeter evidência de publicação. A execução continua por tarefa. «Ver tarefas» e os estados mostram X de Y tarefas. A actividade só fica concluída quando todas as tarefas obrigatórias estiverem concluídas. O progresso global conta actividades, excluindo o bloco futuro vazio.

Fornecer materiais locais descarregáveis: três modelos Word, duas folhas Excel com fórmulas, doze PDF e três capas ilustrativas utilizadas em cinco tarefas de vídeo. Não gerar nem anunciar vídeos reais. Mostrar a natureza da capa e exigir a acção «Simular visualização» antes da confirmação.

Os quizzes de acolhimento e constituição exigem 70%; diagnóstico sem mínimo, preenchido com 4/5 (80%) no exemplo 1; compromisso por aceitação explícita; verificação final Sim/Não. Perguntas e alcance dos bloqueios são escolhas do protótipo descritas no [mapeamento e catálogo](../../frontend/docs/roadmap-scenarios.md), pendentes de validação pedagógica. Não inferir uma cadeia linear a partir da ordem do roteiro.

Submissão de evidência: seleccionar PDF/DOCX/XLSX nos formatos permitidos, até 2 MB, e confirmar. Alternativa: seleccionar explicitamente o exemplo disponibilizado. Guardar conteúdo, nome, autor e data no repository local; permitir consulta/descarga após reload. Mostrar erros sem falsa confirmação. Submetido não equivale a aprovado.

Botões de tarefas discretos, contornos claros, texto azul, rótulos explícitos e foco visível. Materiais complementares continuam recolhíveis com badges por formato. O contexto mantém três cartões: actividade anterior, actividade actual seleccionada e próxima actividade, pela ordem do roteiro, sem inferir precedências. Nas extremidades, indicar a ausência de actividade anterior/seguinte; blocos futuros vazios não originam actividades fictícias. O cartão central acompanha a actividade aberta, não o bloco em curso da empresa.

Cada tarefa mostra ícone de formato, título, estado e botão: Ver, Iniciar tarefa, Continuar tarefa, Ver condição, Responder ao quiz, Ver respostas, Ver vídeo, Ler PDF ou Consultar página. A actividade mantém apenas o agregado e a navegação. Validar erros do quiz, persistência após reload, confirmação de materiais, bloqueios, revisão obsoleta e ausência de falsa confirmação em falhas de armazenamento.

A vista **Meu Percurso** orienta o estudante durante a simulação. Em qualquer momento, o estudante deve perceber:

- o que já está concluído;
- o que está em curso;
- o que pode iniciar;
- o que está bloqueado e porquê;
- qual é a próxima actividade relevante;
- o que precisa de acontecer para uma actividade ficar concluída.

Este PRD descreve exclusivamente requisitos, fluxos e ecrãs do estudante. O protótipo do estudante mantém-se separado do protótipo docente.

O Painel não substitui os módulos operacionais. A acção principal abre o formulário ou resultado correspondente no simulador e aguarda confirmação do módulo antes de actualizar o progresso.

## 2. Fluxo principal

```text
Meu Percurso
→ seleccionar Iniciar, Continuar ou Ver
→ compreender contexto e critérios da actividade
→ abrir o módulo do simulador
→ executar ou consultar a operação
→ receber confirmação
→ regressar com estado, resultado e próximo passo actualizados
```

## 3. Ecrãs de referência

### 3.1. Meu Percurso

Fonte principal: `output/mockups/estudante_v4/mission_control_estudante_v4_01_meu_percurso.png`.

Elementos representados:

- estado de sincronização, progresso global e perfil;
- progresso global da simulação, sustentado por marcos confirmados;
- ligação permanente para o percurso completo;
- bloco actual com progresso próprio;
- nota de que actividades podem decorrer em paralelo;
- lista de actividades com filtros por estado;
- acções **Ver**, **Continuar** e **Iniciar actividade**;
- motivo visível de bloqueio;
- resumo quantitativo do bloco;
- navegação entre bloco anterior, bloco actual e bloco seguinte.

### 3.2. Actividade em curso

Fonte principal: `output/mockups/estudante_v4/mission_control_estudante_v4_02_actividade_em_curso.png`.

Elementos representados:

- título e próxima actividade elegível no cabeçalho; estado e número de critérios confirmados no respectivo cartão de contexto, sem duplicação acima dos cartões;
- contexto **Actividade anterior → Actividade actual → Próxima actividade**, com três cartões e indicação do respectivo bloco;
- lista do que falta para concluir;
- indicação de que o progresso é actualizado após confirmação do simulador;
- materiais de apoio recolhidos numa área expansível;
- uma única acção principal: **Continuar actividade**;
- regresso por breadcrumbs e ligações para o bloco.

### 3.3. Actividade concluída

Fonte principal: `output/mockups/estudante_v4/mission_control_estudante_v4_03_actividade_concluida.png`.

Elementos representados:

- estado concluído e todos os critérios confirmados;
- contexto da actividade e consequências no percurso;
- lista do que foi confirmado, toda em estado concluído;
- confirmação pelo simulador;
- resultado da actividade;
- materiais de apoio;
- acção **Ver detalhes** para consultar o resultado no simulador.

### 3.4. Percurso completo

Fonte principal: `output/mockups/estudante_v4/mission_control_estudante_v4_04_percurso_completo.png`.

Elementos representados:

- progresso global e marcos confirmados;
- nota sobre actividades paralelas;
- blocos numerados e expansíveis;
- actividades do bloco aberto;
- legenda dos estados;
- botão de retorno às actividades actuais.

## 4. Requisitos funcionais

| ID | Requisito |
|---|---|
| MC-EST-001 | Meu Percurso deve mostrar o estado de sincronização e o progresso global. |
| MC-EST-002 | No Meu Percurso e no Percurso completo, integrar a barra e percentagem do progresso global ao lado do título. Na linha seguinte, mostrar «N de T marcos confirmados», substituindo a descrição introdutória. Apenas no Meu Percurso, acrescentar o hyperlink «Ver percurso completo»; não apresentar ligação para a própria página no Percurso completo. Não duplicar num cartão de progresso separado. Os valores são calculados a partir dos marcos confirmados; em espaços estreitos, permitir quebra de linha. |
| MC-EST-003 | O ecrã principal deve destacar o bloco actual, o seu progresso e a possibilidade de actividades paralelas. |
| MC-EST-004 | A lista do bloco deve permitir filtrar todas as actividades, por iniciar, concluídas, em curso e bloqueadas. |
| MC-EST-005 | Cada actividade deve apresentar título, descrição breve, estado e acção coerente com o estado. |
| MC-EST-006 | Uma actividade por iniciar deve apresentar **Iniciar actividade**. |
| MC-EST-007 | Uma actividade em curso deve apresentar **Continuar** e abrir a página da actividade de contexto. |
| MC-EST-008 | Uma actividade concluída deve apresentar **Ver** e, na página da actividade, **Ver detalhes**. |
| MC-EST-009 | Uma actividade bloqueada deve mostrar a condição que falta cumprir; a acção não deve parecer disponível. |
| MC-EST-010 | A página da actividade deve explicar a origem da actividade, a actividade actual e o que será desbloqueado. |
| MC-EST-011 | A página da actividade em curso deve mostrar os critérios concluídos, em curso e por fazer. |
| MC-EST-012 | A página da actividade concluído deve mostrar apenas critérios confirmados e o resultado da actividade. |
| MC-EST-013 | A página da actividade deve ter uma única acção principal e permitir regresso por breadcrumbs e ligações para o bloco. |
| MC-EST-014 | A secção **Apoio** deve aparecer apenas quando existirem materiais associados e deve poder ser expandida. |
| MC-EST-015 | **Continuar actividade** deve abrir o formulário correspondente no módulo do simulador. |
| MC-EST-016 | **Ver detalhes** deve abrir o resultado correspondente no módulo do simulador. |
| MC-EST-017 | O estado só deve mudar depois de o simulador devolver confirmação válida. |
| MC-EST-018 | O regresso do simulador deve actualizar critérios, resultado, progresso e próximos passos sem perder o contexto. |
| MC-EST-019 | O percurso completo deve mostrar todos os blocos e permitir expandir as respectivas actividades. |
| MC-EST-020 | A legenda deve explicar os estados com texto, ícone e cor. |
| MC-EST-021 | O estudante deve poder regressar do percurso completo às actividades do bloco actual. |
| MC-EST-022 | O ecrã deve impedir que repetição de operações aumente artificialmente o progresso. |

## 5. Matriz de acções por estado

| Estado | Acção na lista | Acção na página da actividade | Resultado esperado |
|---|---|---|---|
| Por iniciar | Iniciar actividade | Iniciar ou abrir actividade | Abre o módulo responsável |
| Em curso | Continuar | Continuar actividade | Retoma o formulário no simulador |
| Concluído | Ver | Ver detalhes | Abre o resultado no simulador |
| Bloqueado | Bloqueado | Sem acção principal | Explica a condição necessária |

## 6. Regras de conteúdo

- O título e a descrição devem usar linguagem orientada à tarefa.
- A definição de conclusão deve ser verificável e apresentada antes de abrir o simulador.
- O motivo de bloqueio deve indicar a condição em falta, não apenas o rótulo “bloqueado”.
- O resultado concluído deve ser concreto, por exemplo “Empresa registada” ou “Documentos de constituição gerados”.
- Os materiais de apoio podem incluir vídeo, PDF, apresentação ou ligação autorizada.
- Quando não existirem materiais, a secção **Apoio** não é apresentada.
- A série estudante v4 reproduz o menu lateral e as cores da referência do simulador de 22 de Outubro de 2026. As rotas e permissões de entrada permanecem por definir na DEC-007.

## 7. Privacidade e colaboração

O estudante pode consultar informação da própria empresa quando necessária para coordenar o trabalho, mas não deve receber dados pessoais desnecessários, avaliações confidenciais ou actividades restritas de outros participantes. A forma exacta de mostrar autoria e contribuição de vários estudantes na vista do estudante permanece por decidir.

## 8. Critérios de aceitação

- Ao abrir Meu Percurso, o estudante identifica o bloco actual, o progresso e a próxima actividade accionável.
- Uma actividade bloqueada apresenta a condição concreta que impede a progressão.
- A página da actividade em curso mostra origem, actividade actual, consequências e critérios de conclusão.
- Só existe uma acção principal na página da actividade em curso.
- Depois da confirmação do simulador, todos os critérios concluídos ficam verdes e a página da actividade passa a apresentar o resultado.
- O botão **Ver detalhes** abre o resultado, não um formulário vazio nem uma nova execução.
- O percurso completo está acessível em qualquer momento e mostra a separação entre Ideação e Constituição.
- O mesmo estado e a mesma percentagem são visíveis ao docente no contexto correspondente.
- Abrir, fechar ou repetir a página da actividade não altera o progresso.

## 9. Fora do âmbito visual actual

- Redesenho do menu real do simulador.
- Definição e apresentação de prazos ao estudante.
- Interface de autoria e gestão dos materiais de apoio.
- Regras finais para atribuição e apresentação de contribuição entre colegas.
- Comportamento móvel completo.

## 10. Decisões aprovadas em 24 de Outubro de 2026

Fonte: reunião «Call with Leila Omar (2)», 0:51–13:39, e esclarecimentos posteriores de Vali Issufo. Estas decisões prevalecem sobre as imagens estudante v4 quando houver divergência.

### Navegação e detalhe

- MC-EST-023: consultar blocos anteriores/seguintes através de setas com os nomes dos destinos. Actualizar actividades, progresso e resumo do bloco seleccionado.
- Apresentação revista do resumo: integrar os quatro indicadores à direita do título grande do bloco e da sua barra de progresso, alinhados verticalmente com esse conjunto, e não com o rótulo «Bloco actual». A barra termina antes dos indicadores, sem passar por baixo deles. Grelha 2 × 2: concluídas/em curso na primeira linha, por iniciar/bloqueadas na segunda, com ícone, contagem e rótulo. Não duplicar num painel lateral. Em espaços estreitos, permitir que a grelha passe abaixo do conjunto título/progresso, mantendo duas colunas. Preservar o acesso ao percurso completo no cabeçalho funcional do Meu Percurso, junto dos marcos confirmados.
- MC-EST-024: distinguir bloco em consulta de bloco actual; consultar não muda o bloco actual nem o progresso.
- MC-EST-025: disponibilizar «Voltar para o bloco actual»; desactivar a navegação sem destino nos extremos.
- MC-EST-026: manter o percurso completo. O nome de cada bloco liga ao Meu Percurso com foco nesse bloco, independentemente do controlo de expandir/recolher.
- MC-EST-027: usar páginas próprias para actividades e breadcrumbs funcionais com regresso ao bloco.
- MC-EST-028: contexto, passos de conclusão, materiais e resultados da actividade. A secção autónoma de detalhe foi retirada pela validação seguinte (MC-EST-043); a regra de participação permanece em aberto (DEC-012).
- MC-EST-029: apresentar apenas Concluído, Em curso, Por iniciar e Bloqueado. Disponível/Não disponível correspondem a Por iniciar; Devolvido corresponde a Em curso. Preservar compatibilidade de leitura dos cenários antigos.

### Conversas e tarefas

- MC-EST-030: dois canais por actividade: docente e grupo da própria empresa.
- MC-EST-039 (actualização de UX): substituir o painel lateral de conversas por um pop-up tabulado, com separadores Docente e Grupo da empresa e badges de notificações pendentes por canal. Abrir uma notificação abre directamente o canal correspondente. O detalhe da actividade ocupa a largura disponível, sem coluna de chat permanente.
- MC-EST-040: apresentação de chat com balões, autor, data/hora e mensagens recentes no fundo. Carregar progressivamente o histórico ao deslocar para cima, preservando a posição de leitura; disponibilizar também um botão acessível para mensagens anteriores. Preservar rascunhos separados por canal. Abrir/ler o chat não resolve notificações.
- MC-EST-031: mensagens do estudante ao docente surgem nos pedidos docentes; respostas e orientações publicadas do docente aparecem na actividade do estudante. Uma nova mensagem reabre um pedido concluído.
- MC-EST-032: o docente não pode consultar as conversas do grupo e não recebe as suas notificações. Não projectar mensagens privadas para o repository/vistas do docente.
- MC-EST-033: uma mensagem de grupo pode indicar um responsável da empresa. A tarefa tem apenas Por fazer/Feito; só o responsável a marca como feita. Sem workflow adicional ou prazos obrigatórios.
- MC-EST-034: mensagens, tarefas e resolução de notificações não concluem actividades nem alteram progresso.

### Notificações

- MC-EST-035: indicadores separados de orientações do docente e conversas do grupo, sempre presentes no Meu Percurso e no percurso completo, também acessíveis no detalhe.
- MC-EST-036: abrir o indicador mostra as notificações pendentes; cada notificação liga à actividade e canal correspondentes.
- MC-EST-037: quem recebe marca como resolvida. Ler, responder ou marcar tarefa como feita não resolve automaticamente a notificação. A resolução é individual por destinatário e mensagem; uma mensagem nova gera nova notificação.
- MC-EST-038: mensagens de grupo sem tarefa destinam-se aos outros membros; mensagens com tarefa notificam o responsável, excepto quando o autor é o próprio responsável.

### Aceitação e limites do protótipo

Testar navegação e URL recarregável, comunicação estudante–docente nas duas direcções, reabertura de pedido, resolução persistente, tarefa concluída apenas pelo responsável e ausência de mensagens privadas na projecção docente. Verificar mobile e conteúdo sem AppShell.

Persistência temporária no browser e fixtures JSON. A identidade é a do participante do cenário; não existe autenticação ou isolamento de segurança contra acesso manual ao armazenamento local. A futura API deve impor a autorização por empresa/canal/responsável. O fluxo operacional de registo continua funcional; os restantes módulos conservam o âmbito demonstrativo anterior.

## 11. Continuação da validação de 24 de Outubro de 2026

Fonte: «Call with Leila Omar (4)», gravação de 15m52s, e esclarecimentos posteriores de Vali Issufo. Prevalece sobre opções visuais anteriores em conflito.

- MC-EST-041: preservar a posição do ecrã ao navegar entre blocos, aplicar filtros ou seleccionar actividades no mesmo tipo de página. Não repor o scroll no topo; aceitar apenas o ajuste natural ao comprimento da página de destino.
- MC-EST-042: materiais de apoio com designação, descrição e ícone/rótulo PDF, Excel, Word, Vídeo ou Página Web. Abrir ligações disponíveis noutro separador, com indicação acessível; recursos sem ligação ficam explicitamente indisponíveis. Os recursos locais são ilustrativos, não manuais oficiais.
- MC-EST-043: remover a secção separada «Detalhe da actividade». Preservar contexto, critérios/passos, resultados e materiais.
- MC-EST-044: cartões de contexto navegáveis, actualizando actividade, critérios, materiais e conversas. A navegação usa as actividades adjacentes na ordem do roteiro, incluindo a passagem entre blocos. Relações de precedência continuam a provir dos dados; não inferir dependências pela posição numa lista. Manter três cartões, mesmo no início/fim, com indicação de ausência e sem ligação no cartão vazio.
- MC-EST-045: participação permanece em aberto até à integração com o simulador (DEC-012). Não atribuir nomes por leitura, cliques, mensagens ou pertença à empresa. A localização futura é junto do cartão de cada actividade; não mostrar participantes em actividades não iniciadas.
- MC-EST-046: chat docente partilhado por todos os membros da mesma empresa, com autoria identificada; mensagens do docente e dos estudantes distinguem-se por cores e rótulos de papel. A conversa privada do grupo continua inacessível ao docente.
- MC-EST-047: título do pop-up «Conversas da actividade: <nome>». Manter separadores, badges e histórico progressivo.
- MC-EST-048: painel único clicável alinhado à direita do título nos quatro formulários do estudante, com título/total na primeira linha e badges na segunda. Substitui os cartões de pré-visualização; as pendências, ordenadas da mais recente para a mais antiga, são consultadas no popup tabulado.
- MC-EST-049: no detalhe e no registo, acrescentar o separador Actividade ao popup de notificações, com pendências apenas dessa actividade e acesso ao histórico do chat. Resolução explícita remove a pendência e actualiza os contadores; não apaga mensagens.
- MC-EST-050: retirar completamente as ferramentas de demonstração da interface do estudante e do docente: importação, exportação de cenário, reposição e indicadores «Dados locais guardados»/metadados do cenário. Não apagar dados existentes. Contratos internos de teste podem continuar a existir; conservar avisos necessários de dados ilustrativos.
- MC-EST-051: redireccionamento de «Continuar actividade» para o simulador fica adiado, à espera das ligações reais. Preservar o fluxo local já existente, sem inventar integrações.

Aceitação: testar scroll, contexto e materiais por actividade, três pendências mais recentes, resolução individual, autoria e cores por papel, ausência de ferramentas nos dois Painéis, dados antigos preservados, desktop/mobile e componentes sem AppShell.

## 12. Anotações visuais posteriores — 24 de Outubro de 2026

O Percurso completo segue a linguagem visual do Meu Percurso: painéis com contornos suaves, cabeçalhos de fundo claro, blocos numerados e destaque azul superior no bloco actual. Cada bloco mostra a contagem de concluídas e a barra segmentada mesmo quando recolhido; as actividades, com descrição e estado, pertencem ao mesmo painel, separadas por divisórias leves. Preservar a expansão/recolha, o bloco actual aberto inicialmente, as ligações ao Meu Percurso, a legenda e o acesso ao detalhe. Adaptar o conteúdo a ecrãs estreitos sem alterar o shell.

A barra do bloco é segmentada: um segmento de igual largura por actividade, pela ordem da lista, independentemente do filtro seleccionado. Usar verde para Concluído, âmbar para Em curso, ciano para Por iniciar e cinzento para Bloqueado. Os segmentos não representam progresso parcial estimado: mostram apenas o estado de cada actividade. Manter a contagem de concluídas, identificar actividade/estado no texto acessível e actualizar segmentos ao mudar de bloco ou confirmar uma operação. No bloco vazio não apresentar segmentos. Não alterar a barra global.

O popup de notificações adopta a linguagem visual aprovada: cartões suaves, contornos claros, tipografia compacta, separadores com ícones e badges e botões distintos para abrir conversa (azul) e resolver (contorno). Manter foco, teclado, estados de carregamento/erro, conteúdo integral e comportamento de resolução; o corpo tem deslocação interna em ecrãs pequenos.

O resumo do bloco e «Actividades deste bloco» passam a integrar um único painel: título, indicadores e progresso no topo; filtros e lista de actividades abaixo de um separador interno discreto. Não apresentar a lista num cartão independente. Aplicar ao bloco actual e aos blocos em consulta, preservando filtros, navegação e acções.

Nos quatro formulários do estudante (Meu Percurso, Percurso completo, detalhe da actividade e registo), o painel de notificações fica à direita do título principal. A primeira linha apresenta «Notificações de actividades» com total; a segunda apresenta badges por canal. Toda a superfície funciona como botão e abre directamente um popup com separadores Docente, Grupo e, nas páginas com actividade, Actividade. O popup começa fechado, suporta teclado e Escape, apresenta pendências e permite resolver ou abrir a conversa. Não existe expansão de cartões na página. Em ecrãs estreitos, o painel pode passar à linha seguinte. A soma dos badges mantém-se como total; abrir não resolve notificações.

O cabeçalho «Notificações de actividades» inclui um badge com a soma dos três badges visíveis, conforme MC-UI-008 do PRD comum: Docente + Grupo + Actividade (2 + 1 + 1 = 4 no cenário inicial). Esta soma por categoria não representa mensagens distintas. Manter os badges por canal.

Fonte: seis comentários do utilizador no browser e esclarecimentos posteriores sobre o próximo passo e a síntese dos participantes, no detalhe «Registar empresa». Complementa o PRD comum v0.11 e prevalece sobre a disposição anterior do detalhe.

- MC-EST-052 (comentário 1, simplificação posterior): apresentar «Participantes: Ana M., João T. e António S.» numa única linha compacta, com quebra natural se necessário. Primeiro nome e inicial do último apelido; um único ícone abre um tooltip conjunto com os nomes completos e as respectivas contribuições. Disponível por hover, clique/toque e foco; fechar com Escape e ao abandonar a interacção. Sem participantes, indicar a ausência sem ícone. Preservar dados originais, associação à actividade e privacidade; não apresentar uma linha/ícone por pessoa no cartão.
- MC-EST-053 (comentário 2): colocar a acção apropriada junto do título em cada cartão; adaptar por quebra de linha em espaços estreitos. Bloqueado/Concluído → Ver; Em curso → Continuar actividade; Por iniciar → Iniciar actividade. A existência do botão não amplia o âmbito funcional dos módulos.
- MC-EST-054 (comentário 3): eliminar as etiquetas «Dados simulados». Manter apenas a nota de proveniência abaixo do contexto; a participação real continua por definir na integração. Estado vazio compacto: «Sem participantes indicados».
- MC-EST-058 (anotação posterior): preencher participantes fictícios e contribuições plausíveis nas actividades concluídas ou em curso do cenário de demonstração, onde fizer sentido. Cobrir ideia de negócio, modelo de negócio, reserva do nome e registo da empresa. Não copiar indiscriminadamente a equipa inteira, nem apresentar contribuições realizadas em actividades não iniciadas/bloqueadas. Manter a síntese abreviada e o tooltip conjunto. Acrescentar metadados ausentes em cenários antigos através do adaptador, sem substituir participantes existentes, alterar progresso ou apagar dados.
- MC-EST-055 (comentário 4): mostrar junto do estado «(confirmados de total)» em cada actividade com critérios definidos. A conclusão usa os critérios confirmados do cenário; no registo da empresa, mantém-se a validação e confirmação existentes. Nos restantes casos, não atribuir confirmação parcial sem evidência.
- MC-EST-056 (comentário 5): retirar o estado repetido acima da secção de contexto, bem como a frase isolada «N de N critérios confirmados».
- MC-EST-057 (comentário 6, corrigido pelos esclarecimentos posteriores): apresentar no cabeçalho «<actividade actual> | Próxima actividade: <passo pendente> <acção>» apenas quando existir um passo não confirmado do checklist actual e a actividade não estiver concluída nem bloqueada. No cenário inicial de registo, mostrar «Submeter o formulário de registo», não «Convidar sócios»; o botão abre o formulário local. Sem dados preenchidos, mostrar «Preencher os dados da empresa». Após conclusão confirmada, ocultar todo o bloco, sem sugerir outra actividade neste local. Sem passo pendente definido, mostrar apenas o título. As sucessoras continuam acessíveis nos cartões de contexto. Nas actividades ainda sem execução implementada, o botão conduz aos critérios da própria actividade, não a outro módulo. A descrição permanece nos dados. Não alterar progresso por clique.

Aceitação: verificar tooltip com rato, teclado e toque, ausência de etiquetas, contagens por actividade, acções próximas dos títulos, navegação da próxima actividade e ausência de overflow em mobile. Manter o popup de notificações fechado na entrada e o shell intacto. Sem novas métricas de participação ou regras de progresso.

### Navegação nas mensagens

As mensagens aparecem por ordem cronológica, com as mais recentes em baixo, junto ao compositor. Ao abrir uma conversa, posicionar na primeira mensagem recebida ainda não lida, identificada por «Mensagens por ler»; se não houver mensagens por ler, abrir no fim. Incluir a primeira mensagem por ler mesmo quando antecede a página inicial de histórico. Carregar mensagens anteriores ao subir, preservando a posição de leitura. Enviar uma mensagem desloca para o fim; reacções não devem provocar saltos. A marcação como lida continua explícita.

### Emojis e GIFs no hub social

O compositor deve disponibilizar «Emojis» e «GIFs» lado a lado. Emojis agrupados em nove categorias, pesquisáveis em português; inserção no cursor sem perder o rascunho. GIFs através do GIPHY com pesquisa, sugestões iniciais, carregamento, erro com repetição e estado vazio. A selecção gera uma pré-visualização removível; só «Publicar mensagem» envia. Permitir GIF com ou sem legenda e respostas a GIFs. Preservar o anexo após recarregar a conversa. As mensagens continuam a identificar nome e turma.

A integração é feita no browser por adaptador injectado, sem backend, com chave Web configurável. Sem chave, apresentar a indisponibilidade de configuração, sem simular pesquisa bem-sucedida. Exibir atribuição GIPHY, solicitar conteúdo com classificação G e enviar apenas os termos de pesquisa ao serviço. A validação com adaptador simulado não constitui validação de uma conta real. As cores e o shell permanecem inalterados.


## Correspondência com o docente — 25/10/2026

O docente consulta simultaneamente os registos dos exemplos 1 e 2. Alterar o exemplo seleccionado pelo estudante não altera a lista de empresas do docente nem transfere realizações entre empresas. O progresso guardado prevalece sobre o ponto inicial dos cartões de entrada.

Mensagens ao docente identificam explicitamente a empresa do exemplo activo. Respostas e orientações específicas regressam apenas a essa empresa; novas orientações gerais da Turma A chegam às duas empresas. Comunicações antigas migradas conservam o âmbito original. Conversas do grupo e do hub continuam privadas e fora da projecção do docente. Os ficheiros, respostas e datas de conclusão apresentados ao docente são os mesmos registos do repository do estudante.
