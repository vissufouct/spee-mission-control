# Verificação do Painel do Docente — 22 de Outubro de 2026

Verificação técnica e visual do protótipo. Não equivale a validação de UX com utilizadores ou aprovação de regras pedagógicas.

## Resultado observado

- TypeScript, ESLint e guarda de fronteiras: passaram.
- Vitest: **35 testes**, incluindo os 20 existentes e 15 novos testes de repository, selectores e ligação ao estudante.
- Playwright/Chromium: **16 testes** passaram; incluem os fluxos anteriores do estudante, sete fluxos do docente e dois testes de isolamento em Storybook.
- Builds da aplicação e Storybook: passaram. Storybook: **29 stories**.
- In-app browser: visão geral, percurso, contribuição e largura móvel inspeccionados; nenhum erro/warning de consola devolvido na verificação final.
- Ecrã principal: 1607 × 979 CSS px, densidade 1 nos testes; móvel: 390 × 844; stories: 1200 × 900.
- Os 13 itens do menu mantêm-se. O destino de Início/Roteiro de Tarefas respeita o papel demonstrativo.

## Fluxos exercitados

1. Combinar filtros por Constituição e Salários com AND, abrir Nova Geração, consultar resultado, fechar por Escape e regressar com os filtros preservados.
2. Pesquisa sem correspondência, limpeza, troca de turma e filtro de alertas.
3. Separar contribuição humana, trabalho colectivo e eventos automáticos, com contagens distintas.
4. Validar assunto/mensagem/motivo, criar rascunho, recarregar, editar, cancelar eliminação, eliminar, criar nova orientação, confirmar registo e verificar imutabilidade/histórico.
5. Confirmar a empresa na vista do estudante e observar 18% → 24% na vista do docente, incluindo a mesma referência do comprovativo.
6. JSON corrompido: erro sem apagar dados, reposição explícita e confirmação.
7. Falha de escrita: formulário mantém dados e mostra erro, sem anunciar sucesso.
8. Menu móvel, tabelas deslocáveis e ausência de overflow horizontal global.
9. As três vistas do docente funcionam sem AppShell nem escrita no localStorage, incluindo pesquisa interactiva e estado vazio.

## Correcções resultantes da verificação

- Participantes removidos de actividades sem eventos de autoria confirmados.
- Eventos fictícios ordenados de forma coerente com a sequência das actividades.
- Filtros rápidos deixaram de reutilizar query params obsoletos; a actualização é síncrona e conserva o scroll.
- Labels acessíveis da tabela deixaram de aumentar a largura do documento móvel: o contentor de scroll define o contexto de posicionamento.
- Reposição do scroll entre páginas mantida no shell.
- Cores dos cartões, densidade de linhas, tabs e contraste de estados ajustados após comparação visual.

## Evidência

- [Visão geral](screenshots/docente-visao-geral.png)
- [Percurso da empresa](screenshots/docente-percurso.png)
- [Contribuição](screenshots/docente-contribuicao.png)
- [Resultado consultado](screenshots/docente-evidencia.png)
- [Orientação e histórico](screenshots/docente-orientacao.png)
- [Móvel](screenshots/docente-mobile.png)
- [Sem AppShell](screenshots/docente-sem-shell.png)
- [Comparação visual e diferenças esperadas](../design-qa.md)

## Limites

Sem backend, autenticação, permissões reais, notificações ou intervenções no trabalho do estudante. As orientações e o histórico são JSON local, não uma auditoria inviolável. Só Horizonte Verde partilha a fonte operacional demonstrativa do estudante; as restantes empresas são fixtures.

Não foram testados Safari/Firefox nem aparelhos físicos. O teste de contraste existente cobre o azul de acção, não uma certificação WCAG completa. Os builds mantêm avisos de chunks >500 kB e depreciação de Node no Storybook; não foram ocultados. Não houve novas dependências.

A revisão de UX por docentes/estudantes e a definição de permissões, ponderações e integrações continuam pendentes.
