# Verificação — dez empresas no Painel do Docente

25 de Outubro de 2026. Implementação local.

- Dez empresas: Horizonte Verde e Nascente Criativa preservadas, mais oito cenários independentes sobre as 15 actividades e 48 tarefas do roteiro.
- Etiquetas «Exemplo 1/2» retiradas da listagem.
- TypeScript, lint, fronteiras e 89 testes unitários passaram. Builds da aplicação e do Storybook concluídos; mantém-se o aviso de dimensão dos bundles.
- 20 testes Playwright relevantes passaram: 19 na primeira execução; um selector exacto do filtro Turma foi corrigido no teste e esse caso passou na repetição. Incluem filtros, migração, detalhes, ligação ao estudante, exemplos, móvel e story sem shell.
- No browser do utilizador: dez empresas, Turma C com três empresas, pesquisa «Nadia» encontra Lúrio Digital e o detalhe do plano de negócios mostra 2/3 tarefas, com os participantes correspondentes.
- Progresso existente preservado: neste browser, Horizonte Verde a 53% e Nascente Criativa a 7%; média actual de 47%. Não foram repostos os valores dos fixtures (47%/0%; média inicial de 45%).
- Captura: `painel-docente.png`.
- Nenhuma dependência nova; shell e fixtures dos dois estudantes intactos. O gerador de empresas foi executado novamente e produziu exactamente o mesmo JSON.

As submissões dos novos cenários têm metadados fictícios; onde não há ficheiro, a UI indica a indisponibilidade sem ligar documentos de outra empresa.
