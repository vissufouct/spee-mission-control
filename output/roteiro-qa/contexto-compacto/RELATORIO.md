# Verificação — cartões compactos de contexto

25 de Outubro de 2026. Alterações locais, sem publicação nesta revisão.

## Resultado

- Estado no cabeçalho de cada bloco; sem barras ou contagens de actividades.
- Retirada toda a síntese da actividade seleccionada, conforme confirmação do utilizador.
- Participantes abreviados por bloco, com um tooltip conjunto que identifica as contribuições por actividade. Todas as actividades concluídas têm exemplos específicos; actividades não iniciadas/bloqueadas não apresentam contribuições realizadas.
- Compatibilidade com metadados antigos, preservando contribuições personalizadas. Comparação estrutural dos dois fixtures confirmou que apenas `simulatedParticipants` mudou.
- Menu lateral, header e footer sem alterações.

## Validação executada

- `npm run check`: TypeScript, lint, fronteiras e 92 testes unitários aprovados.
- `npm run build` e `npm run build-storybook`: aprovados. Permanece aviso de bundles acima de 500 kB, já existente.
- 16 testes Playwright: contexto, dois exemplos, registo/submissão, participantes, navegação e coerência docente/estudante.
- Após os últimos ajustes de espaçamento e foco, repetidos os cinco testes de contexto/participantes, incluindo story sem AppShell, e repetido check/build/Storybook: aprovados.
- Inspecção no browser local a 1135 px, abertura das contribuições de Ideação, Tab para os detalhes, End para deslocamento e Escape; revisão visual da captura mobile de 390 px e story isolada.

## Evidências

- `contexto-desktop.png`: browser local com dados já guardados pelo utilizador; a actividade de registo está concluída nesse armazenamento e foi preservada.
- `contexto-mobile.png`: exemplo 1 inicial em armazenamento isolado de teste.
- `contexto-sem-shell.png`: componente em Storybook, independente do template.

PRDs comum v0.22 e estudante v0.18 actualizados. Sem dependências novas, backend ou mudanças de progresso.
