# PRD do Mission Control do Estudante

**Versão:** 0.4
**Data:** 24 de Outubro de 2026
**Estado:** actualizado após reunião e decisões de 24 de Outubro de 2026
**Depende de:** `PRD_00_Mission_Control_Comum.md`  

## 1. Resultado esperado

A vista **Meu Percurso** orienta o estudante durante a simulação. Em qualquer momento, o estudante deve perceber:

- o que já está concluído;
- o que está em curso;
- o que pode iniciar;
- o que está bloqueado e porquê;
- qual é a próxima actividade relevante;
- o que precisa de acontecer para uma actividade ficar concluída.

Este PRD descreve exclusivamente requisitos, fluxos e ecrãs do estudante. O protótipo do estudante mantém-se separado do protótipo docente.

O Mission Control não substitui os módulos operacionais. A acção principal abre o formulário ou resultado correspondente no simulador e aguarda confirmação do módulo antes de actualizar o progresso.

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

- título, estado e número de critérios confirmados;
- contexto **Vem de → Actividade actual → Desbloqueia**;
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
| MC-EST-002 | O progresso global deve indicar quantos marcos confirmados o sustentam e permitir abrir o percurso completo. |
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
- MC-EST-024: distinguir bloco em consulta de bloco actual; consultar não muda o bloco actual nem o progresso.
- MC-EST-025: disponibilizar «Voltar para o bloco actual»; desactivar a navegação sem destino nos extremos.
- MC-EST-026: manter o percurso completo. O nome de cada bloco liga ao Meu Percurso com foco nesse bloco, independentemente do controlo de expandir/recolher.
- MC-EST-027: usar páginas próprias para actividades e breadcrumbs funcionais com regresso ao bloco.
- MC-EST-028: detalhe equivalente ao docente: descrição, definição de concluído, dependências, próximo passo, participantes e evidências/resultados disponíveis. Não inventar evidência.
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
