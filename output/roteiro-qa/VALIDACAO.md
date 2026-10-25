# Validação do roteiro no protótipo

Data: 25 de Outubro de 2026.

- TypeScript, ESLint e fronteiras entre features: sem erros.
- Vitest: 77 testes passaram. Incluem percurso completo das 48 tarefas, limiares dos quizzes, dependências, isolamento dos exemplos, persistência, projecção para o docente, concorrência e privacidade.
- Playwright/Chrome: a execução final integral passou os 50 casos, sem falhas, após as últimas correcções de usabilidade. Os testes de cenários anteriores usam fixtures explicitamente importados; os seis testes dos exemplos novos usam os dados correntes.
- Builds Vite e Storybook: concluídos. Permanece o aviso de bundle superior a 500 kB; não impede o build.
- Revisão visual: selector de exemplos, página inicial da empresa sem tarefas, capa de vídeo no popup, ecrãs de desktop/mobile e componentes sem AppShell.
- Três DOCX guardados, renderizados e revistos depois da última alteração; uma página por modelo, sem sobreposições ou cortes. Integridade ZIP verificada.
- Doze PDF renderizados e revistos; texto extraível e uma página por documento.
- Duas folhas Excel recalculadas e renderizadas, sem erros nas fórmulas. Totais de 103 000 MZN e 246 000 MZN; alteração de valores de entrada verificada e valores originais repostos. Integridade ZIP verificada.
- Gerador de fixtures e mapa HTML reproduzido sem diferenças. Testes confirmam a existência dos recursos locais.

As imagens nesta pasta documentam a revisão. As fontes, limites e decisões por validar estão em [roadmap-scenarios.md](../../frontend/docs/roadmap-scenarios.md).

Teste manual no computador, problemas corrigidos, limites e capturas: [Relatório de usabilidade](usabilidade-2026-10-25/RELATORIO.md).
