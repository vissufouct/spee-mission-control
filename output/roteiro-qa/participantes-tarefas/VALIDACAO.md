# Participação na lista de tarefas — validação

Data: 25 de Outubro de 2026.

## Alteração

A participação sai dos três cartões de contexto. A lista usa a ordem Tarefa, Participantes, Estado e Acção. Nomes abreviados e um único tooltip por tarefa apresentam os nomes completos e contribuições específicas. Em espaços estreitos, as linhas reorganizam-se sem ocultar a participação ou as acções.

Os fixtures incluem metadados ilustrativos por tarefa. Tarefas por iniciar/bloqueadas ou sem metadados mostram um travessão, sem informação fictícia sobre trabalho realizado. O adaptador completa campos ausentes sem substituir dados personalizados nem alterar progresso, respostas, submissões, eventos ou revisão. A participação ilustrativa não alimenta autoria confirmada do docente.

PRDs actualizados: comum v0.23 e estudante v0.19. Sem novas dependências; sem alterações ao shell.

## Verificação efectuada

- `npm run check`: TypeScript, lint, fronteiras e 92 testes unitários aprovados.
- Playwright: 18 cenários distintos das suites task-participants, activity-context-sequence, activity-entry-refinements, roadmap-examples e teacher-roadmap. Na primeira passagem, 17 passaram; um teste detectou o tooltip para além da margem direita em mobile. Após correcção, os dois testes task-participants passaram, incluindo os limites do popup, teclado, acção do quiz, estado inicial do exemplo 2 e Storybook sem AppShell.
- Builds de produção e Storybook aprovados após a correcção visual. Subsiste o aviso anterior sobre tamanho dos bundles.
- Inspecção no browser local: coluna antes de Estado, participantes diferentes por tarefa, tooltip com nomes completos/contribuições e fecho com Escape. Inspecção adicional da captura móvel a 390 px.
- `git diff --check`: sem erros.

## Evidências

- `lista-participantes.png`: browser local, cartões sem participantes e coluna na lista.
- `detalhes-participacao.png`: tooltip de Reservar o nome da empresa.
- `participantes-desktop.png`, `participantes-mobile.png`: cenários isolados do Playwright.
- `participantes-sem-shell.png`: story sem AppShell.

O browser pessoal conserva os registos anteriores, incluindo tarefas já concluídas; os testes usam cenários isolados. Esta verificação não executou push nem publicação no GitHub Pages.
