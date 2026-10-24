# PRD do Mission Control do Docente

**Versão:** 0.6
**Data:** 24 de Outubro de 2026
**Estado:** actualizado após validação funcional com Leila Omar
**Depende de:** `PRD_00_Mission_Control_Comum.md`  

## 1. Resultado esperado

O Mission Control do Docente permite acompanhar todas as turmas de um ciclo sem consultar sucessivamente os diferentes módulos do simulador. O docente começa na visão geral, identifica empresas ou marcos que requerem atenção, acompanha pedidos de orientação, abre o percurso de uma empresa e consulta o detalhe das actividades e respectivos resultados.

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
- O docente abre o módulo de origem a partir dos detalhes e regressa ao mesmo ponto do Mission Control.
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

Retirar as ferramentas e metadados de demonstração do Mission Control do docente, incluindo a reposição de cenário no estado de erro. Preservar dados existentes, estados de erro e a acção funcional de actualizar dados. Os avisos de conteúdo ilustrativo não constituem ferramentas de demonstração.

A conversa docente–empresa é visível e respondível por todos os membros dessa empresa, com autoria individual preservada. Não dar acesso ao canal privado do grupo. A definição de participação permanece adiada até à integração com o simulador (DEC-012); não alterar a atribuição de participação com base nas conversas.
