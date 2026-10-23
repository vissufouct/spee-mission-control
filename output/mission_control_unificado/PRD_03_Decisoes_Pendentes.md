# Registo de decisões do Mission Control

**Versão:** 0.4
**Data:** 23 de Outubro de 2026
**Finalidade:** manter decisões resolvidas e pendentes com resposta, responsável, data e impacto rastreáveis.  

## Como utilizar

Em cada decisão:

1. assinalar apenas um estado;
2. escrever a resposta no espaço indicado;
3. registar a decisão final, o responsável e a data;
4. actualizar os PRDs e protótipos afectados;
5. acrescentar ligação para acta, teste ou evidência quando exista.

## Resumo

| Estado | Quantidade actual |
|---|---:|
| Resolvidas | 9 |
| Não resolvidas | 15 |

---

## DEC-001 — Fonte principal de verdade

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** Vali Issufo
- **Data da decisão:** 21 de Outubro de 2026
- **Resposta:**

> As imagens dos protótipos são a principal fonte de verdade.

- **Decisão final:** As imagens mais recentes prevalecem. Transcript e backlog servem para fundamentar, completar critérios transversais e identificar lacunas. `mission_control_unificado_v1.png` fica explicitamente excluído das fontes de verdade por resultar de uma interpretação incorrecta.
- **Impacto:** todos os PRDs.
- **Evidência ou acta:** pedido do utilizador nesta conversa.

## DEC-002 — Coordenação única com protótipos separados

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** Vali Issufo
- **Data da decisão:** 22 de Outubro de 2026
- **Resposta:**

> Unificar apenas a gestão das conversas, decisões e documentação neste chat. Não unificar os protótipos, os ecrãs nem as interfaces.

- **Decisão final:** O protótipo docente e o protótipo do estudante permanecem separados e válidos. Apenas o modelo de dados, os estados, o progresso, os eventos, a auditoria, as permissões, a sincronização e outros padrões realmente transversais são documentados no PRD comum. Não será criada agora uma interface unificada.
- **Impacto:** governação do projecto, organização dos quatro PRDs e interpretação dos protótipos; não altera os ecrãs existentes.
- **Evidência ou acta:** clarificação explícita do utilizador neste chat, em 22 de Outubro de 2026.

## DEC-003 — Escalabilidade da matriz docente

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** equipa de produto
- **Data da decisão:** 20 de Outubro de 2026
- **Resposta:**

> Manter deslocamento vertical e horizontal e acrescentar controlos de navegação pelas colunas.

- **Decisão final:** A matriz cresce para baixo e para a direita com barras de deslocamento. Acima da tabela existem controlos para avançar ou recuar uma coluna e para avançar ou recuar o conjunto de colunas visíveis, calculado segundo a largura disponível. O acesso ao detalhe ocorre pelo ícone junto ao nome da empresa.
- **Impacto:** `PRD_01_Mission_Control_Docente.md` e protótipo docente.
- **Evidência ou acta:** transcript e imagem `docente_v2_01_visao_geral`.

## DEC-004 — Painel lateral na visão geral do docente

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** equipa de produto
- **Data da decisão:** 20 de Outubro de 2026
- **Resposta:**

> Retirar o painel lateral para dar espaço à matriz; abrir o detalhe da empresa num ecrã próprio.

- **Decisão final:** A série docente mantém a visão geral sem painel lateral de detalhe; a versão visual corrente é `docente_v3`, que conserva esta decisão da v2.
- **Impacto:** visão geral do docente.
- **Evidência ou acta:** transcript e protótipo docente v2.

## DEC-005 — Acção de actividade concluída do estudante

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** equipa de produto
- **Data da decisão:** 20 de Outubro de 2026
- **Resposta:**

> Usar “Ver” na lista e “Ver detalhes” no modal concluído.

- **Decisão final:** A acção “Ver detalhes” da imagem `estudante_v3_03_actividade_concluida`, conservada na série estudante v4, prevalece sobre alternativas discutidas no transcript.
- **Impacto:** `PRD_02_Mission_Control_Estudante.md`.
- **Evidência ou acta:** protótipo estudante v3.

---

## DEC-006 — Página inicial ou acesso de recurso ao Meu Percurso

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Escrever aqui.

- **Decisão final:** ____________________
- **Impacto:** entrada no Mission Control, navegação e retorno do simulador.
- **Evidência ou acta:** o transcript discute Meu Percurso como página inicial e também como acesso de recurso; a imagem não resolve a precedência.

## DEC-007 — Rotas e permissões do menu real do simulador

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Escrever aqui.

- **Decisão final:** ____________________
- **Impacto:** pontos de entrada por perfil, rotas e retorno entre módulos.
- **Evidência ou acta:** em 22 de Outubro de 2026, o utilizador pediu a reprodução visual do menu do simulador. As séries docente v3 e estudante v4 já o representam. A entrada “Roteiro de Tarefas” surge destacada como contexto visual, sem constituir aprovação da rota técnica ou das permissões por perfil. A escolha visual está registada na DEC-021; a integração funcional continua por definir.

## DEC-008 — Fórmula e designação do progresso global

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir marcos, pesos, arredondamento, tratamento de actividades paralelas, devoluções e versões do percurso.

- **Decisão final:** ____________________
- **Impacto:** percentagem do estudante, percentagem da empresa e conclusão média da turma.
- **Evidência ou acta:** os protótipos mostram 18%, 24% e 63% apenas como dados ilustrativos; não estabelecem uma fórmula de cálculo.

## DEC-009 — Terminologia dos blocos fiscais

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Escolher entre “Primeiro/Segundo ano fiscal” e “Primeiro/Segundo exercício fiscal”.

- **Decisão final:** ____________________
- **Impacto:** consistência entre estudante, docente, Studio e materiais pedagógicos.
- **Evidência ou acta:** as imagens actuais usam designações diferentes.

## DEC-010 — Prazos visíveis ao estudante

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Escrever aqui.

- **Decisão final:** ____________________
- **Impacto:** Meu Percurso, notificações, alertas e coerência com a vista docente.
- **Evidência ou acta:** o docente vê prazos; as imagens do estudante não os apresentam.

## DEC-011 — Autoria e gestão de materiais de apoio

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir quem cria, revê, publica, localiza, versiona e retira vídeos, PDFs, apresentações e ligações.

- **Decisão final:** ____________________
- **Impacto:** SPEE Studio, governação de conteúdos e modal da actividade.
- **Evidência ou acta:** o protótipo mostra materiais; a interface de gestão ainda não foi desenhada.

## DEC-012 — Granularidade da contribuição de vários estudantes

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir como distinguir autoria, preparação, validação, execução conjunta e automatização sem transformar ocorrências em ranking.

- **Decisão final:** ____________________
- **Impacto:** contrato de eventos, vista docente, transparência para estudantes e avaliação.
- **Evidência ou acta:** o protótipo docente aceita vários participantes, mas não define a regra de atribuição.

## DEC-013 — Alertas e pedidos de orientação

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** equipa de produto
- **Data da decisão:** 23 de Outubro de 2026
- **Resposta:**

> Substituir “Actividades com alertas” por “Pedidos de orientação”.

- **Decisão final:** O indicador abre conversas iniciadas por estudantes e associadas a empresa e actividade. Bloqueios, devoluções e prazos não são convertidos automaticamente em pedidos. O contador representa apenas pedidos que aguardam resposta do docente.
- **Impacto:** indicador da visão geral e da empresa, notificações, modelo de conversas e filtros.
- **Evidência ou acta:** reunião de validação com Leila Omar, 23 de Outubro de 2026.

## DEC-014 — Catálogo e permissões de intervenção docente

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Confirmar se o docente pode devolver, reabrir, desbloquear, solicitar correcção e escalar; definir limites por papel.

- **Decisão final:** ____________________
- **Impacto:** segurança, auditoria, notificações e ecrã de intervenções.
- **Evidência ou acta:** existe protótipo anterior de intervenções, mas não uma versão v2 integrada.

## DEC-015 — Ligação aos resultados e evidências de cada módulo

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir a rota de consulta, permissões, estado de retorno e comportamento quando o módulo não disponibiliza uma vista de resultado.

- **Decisão final:** ____________________
- **Impacto:** botões **Ver** e **Ver detalhes**, integração e navegação de retorno.
- **Evidência ou acta:** protótipos e transcript confirmam a intenção, mas não o contrato técnico.

## DEC-016 — Exportação do progresso e das evidências

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Escrever aqui.

- **Decisão final:** ____________________
- **Impacto:** vista docente, acessibilidade, relatórios e protecção de dados.
- **Evidência ou acta:** o backlog prevê exportação; o transcript considera-a desnecessária e as imagens não a incluem.

## DEC-017 — Estados visíveis e correspondência de Devolvido

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** Vali Issufo
- **Data da decisão:** 23 de Outubro de 2026
- **Resposta:**

> Simplificar a vista docente e definir a correspondência de “Devolvido”.

- **Decisão final:** O Mission Control do docente apresenta apenas Concluído, Em curso, Por iniciar e Bloqueado. “Devolvido” passa para “Em curso”; “Disponível” e “Não disponível” aparecem como “Por iniciar”. O estado de origem permanece conservado na pista de dados.
- **Impacto:** modelo de apresentação, filtros, legenda, matriz, percurso da empresa e compatibilidade com dados anteriores.
- **Evidência ou acta:** reunião de validação de 23 de Outubro de 2026 e decisão explícita posterior de Vali Issufo.

## DEC-018 — Retenção, anonimização e uso pedagógico da pista

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir período de retenção, acesso por perfil, anonimização para análise e regras de uso em avaliação.

- **Decisão final:** ____________________
- **Impacto:** arquitectura de dados, privacidade, relatórios e auditoria.
- **Evidência ou acta:** requisito transversal ainda sem política aprovada.

## DEC-019 — Comportamento responsivo e em telemóvel

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir quais elementos colapsam, como a matriz docente é consultada e como os modais do estudante se adaptam a ecrãs pequenos.

- **Decisão final:** ____________________
- **Impacto:** acessibilidade, componentes e testes de usabilidade.
- **Evidência ou acta:** os protótipos actuais são de desktop.

## DEC-020 — Integração do ecrã de intervenções na versão corrente

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Confirmar se “Intervenções” continua como área própria do Mission Control docente, passa a acção contextual ou fica para uma fase posterior.

- **Decisão final:** ____________________
- **Impacto:** navegação e permissões do protótipo docente.
- **Evidência ou acta:** existe apenas a imagem v1 de intervenções; as séries docentes v2 e v3 não incluem esse ecrã.

## DEC-021 — Cores e menu lateral da referência do simulador

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** Vali Issufo
- **Data da decisão:** 22 de Outubro de 2026
- **Resposta:**

> Regenerar duas séries de imagens, uma do docente e outra do estudante, usando as cores da imagem fornecida e respeitando o menu lateral do simulador.

- **Decisão final:** Geradas as séries docente v3 (três ecrãs) e estudante v4 (quatro ecrãs), com as treze entradas do menu original e a paleta clara, turquesa e azul. Os dois protótipos continuam separados. Esta decisão regista a orientação visual solicitada; não substitui a decisão sobre rotas e permissões (DEC-007).
- **Impacto:** referências visuais dos PRDs comum, docente e estudante; cabeçalho, menu lateral, cores e acções dos sete ecrãs.
- **Evidência ou acta:** pedido do utilizador e imagem guardada em `output/mockups/referencias/simulador_menu_2026-10-22.png`; séries em `output/mockups/docente_v3/` e `output/mockups/estudante_v4/`.
- **Nota de revisão:** No exemplo docente, o contador foi reconciliado com os cinco participantes nomeados, e a tabela foi identificada como extracto. No modal concluído do estudante, o resumo do bloco foi actualizado para duas actividades concluídas e zero em curso. São correcções de coerência dos dados ilustrativos, sem alteração das regras pedagógicas ou resolução das decisões pendentes.

## DEC-022 — Pedidos e orientações do docente

- **Estado:** [ ] Não resolvida  [x] Resolvida
- **Responsável:** equipa de produto
- **Data da decisão:** 23 de Outubro de 2026
- **Resposta:**

> Associar cada pedido a empresa e actividade, permitir resposta contextual, conclusão manual e orientações proactivas.

- **Decisão final:** Os pedidos são conversas com histórico e estados “aguarda docente”, “aguarda estudante” e “concluído”. O docente pode concluir manualmente uma conversa respondida presencialmente. Uma nova mensagem do estudante reactiva o pedido. O docente pode iniciar orientações para uma empresa ou para todas ou várias turmas.
- **Impacto:** modelo JSON temporário, repository, indicadores, modais, painel da empresa e painel geral.
- **Evidência ou acta:** reunião de validação com Leila Omar, 23 de Outubro de 2026.

## DEC-023 — Gestão e visibilidade dos prazos docentes

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir se os prazos permanecem na primeira versão e quem os configura, altera ou prolonga por turma ou grupo.

- **Decisão final:** ____________________
- **Impacto:** filtros, tabela de actividades, indicadores, Studio e permissões de gestão.
- **Evidência ou acta:** a reunião reconheceu que apresentar prazos exige uma interface de gestão; não foi aprovada a sua retirada nem permanência definitiva.

## DEC-024 — Futuro da contribuição e pista de actividade

- **Estado:** [x] Não resolvida  [ ] Resolvida
- **Responsável:** ____________________
- **Data-alvo:** ____________________
- **Resposta:**

> Definir a utilidade pedagógica, granularidade, capacidade real de rastreio, retenção e permissões antes de voltar a expor a cronologia detalhada.

- **Decisão final:** ____________________
- **Impacto:** navegação docente, privacidade, modelo de eventos e relatórios.
- **Evidência ou acta:** a vista e os seus acessos ficam ocultos na experiência corrente, mas os artefactos anteriores são preservados para decisão futura.
