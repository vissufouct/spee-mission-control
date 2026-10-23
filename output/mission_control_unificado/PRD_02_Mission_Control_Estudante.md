# PRD do Mission Control do Estudante

**Versão:** 0.3  
**Data:** 22 de Outubro de 2026  
**Estado:** rascunho consolidado a partir das imagens do protótipo  
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
- fecho pelo ícone **X**.

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
| MC-EST-004 | A lista do bloco deve permitir filtrar todas as actividades, disponíveis, em curso e bloqueadas. |
| MC-EST-005 | Cada actividade deve apresentar título, descrição breve, estado e acção coerente com o estado. |
| MC-EST-006 | Uma actividade disponível deve apresentar **Iniciar actividade**. |
| MC-EST-007 | Uma actividade em curso deve apresentar **Continuar** e abrir o modal de contexto. |
| MC-EST-008 | Uma actividade concluída deve apresentar **Ver** e, no modal, **Ver detalhes**. |
| MC-EST-009 | Uma actividade bloqueada deve mostrar a condição que falta cumprir; a acção não deve parecer disponível. |
| MC-EST-010 | O modal deve explicar a origem da actividade, a actividade actual e o que será desbloqueado. |
| MC-EST-011 | O modal em curso deve mostrar os critérios concluídos, em curso e por fazer. |
| MC-EST-012 | O modal concluído deve mostrar apenas critérios confirmados e o resultado da actividade. |
| MC-EST-013 | O modal deve ter uma única acção principal e permitir fecho pelo ícone **X**. |
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

| Estado | Acção na lista | Acção no modal | Resultado esperado |
|---|---|---|---|
| Disponível | Iniciar actividade | Iniciar ou abrir actividade | Abre o módulo responsável |
| Em curso | Continuar | Continuar actividade | Retoma o formulário no simulador |
| Concluído | Ver | Ver detalhes | Abre o resultado no simulador |
| Bloqueado | Bloqueado | Sem acção principal | Explica a condição necessária |
| Não disponível | Sem acção | Sem acção | Informa que ainda não está acessível |

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
- O modal em curso mostra origem, actividade actual, consequências e critérios de conclusão.
- Só existe uma acção principal no modal em curso.
- Depois da confirmação do simulador, todos os critérios concluídos ficam verdes e o modal passa a apresentar o resultado.
- O botão **Ver detalhes** abre o resultado, não um formulário vazio nem uma nova execução.
- O percurso completo está acessível em qualquer momento e mostra a separação entre Ideação e Constituição.
- O mesmo estado e a mesma percentagem são visíveis ao docente no contexto correspondente.
- Abrir, fechar ou repetir o modal não altera o progresso.

## 9. Fora do âmbito visual actual

- Redesenho do menu real do simulador.
- Definição e apresentação de prazos ao estudante.
- Interface de autoria e gestão dos materiais de apoio.
- Regras finais para atribuição e apresentação de contribuição entre colegas.
- Comportamento móvel completo.
