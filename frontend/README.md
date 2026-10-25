# SPEE — experiências de frontend

Frontend local para exploração da UX do **Painel do Docente**, do **Meu Percurso do Estudante** e do **Editor visual de roteiro**, em áreas separadas. Não existe backend, API, base de dados ou autenticação real. Os documentos e imagens anteriores do projecto foram preservados; a aplicação vive em `frontend/`.

Versão publicada: [SPEE Painel no GitHub Pages](https://vissufouct.github.io/spee-mission-control/).

## Executar

Requisitos: Node.js **22.18+** e npm. Testado nesta máquina com Node 26.9.0.

```sh
cd "/Users/vali/Documents/Dev/SPEE Helpdesk Analysis/frontend"
npm ci
npm run dev
```

Abrir o [ponto de partida](http://127.0.0.1:5173/) e escolher o [Painel do Docente](http://127.0.0.1:5173/docente/mission-control), o [Painel do Estudante](http://127.0.0.1:5173/estudante/percurso) ou o [Editor visual de roteiro](http://127.0.0.1:5173/studio/roteiro). O servidor Vite serve apenas o frontend e escuta em 127.0.0.1, sem exposição na rede.

```sh
npm run storybook
```

Abrir [Storybook](http://127.0.0.1:6006). Inclui a experiência principal do editor e as stories dos componentes relevantes, sem o template principal e sem escrita no cenário da aplicação.

## O que já pode experimentar

Na entrada do **Painel do Estudante**, escolher:

- **Exemplo 1 — Horizonte Verde, Lda.**: acolhimento e ideação concluídos; constituição legal com 4 de 7 tarefas concluídas e registo em rascunho. Progresso de 47% (7 de 15 actividades).
- **Exemplo 2 — Nascente Criativa, Lda.**: começa no acolhimento, sem tarefas realizadas.

O roteiro tem 15 actividades e 48 tarefas. Pode ler materiais, simular a visualização de capas de vídeo, responder aos quizzes, confirmar operações e submeter documentos PDF, Word ou Excel. O registo da empresa reutiliza o formulário com validação, rascunho e confirmação. Os dados de cada exemplo persistem separadamente no browser.

Os 3 modelos Word, 2 folhas Excel, 12 PDF, 3 capas e páginas de apoio estão descritos em [Roteiro: exemplos, materiais e fontes](docs/roadmap-scenarios.md). O primeiro ano fiscal fica como «Brevemente», sem tarefas inventadas. A ponderação uniforme do progresso serve para experimentar UX; não representa uma decisão pedagógica aprovada.

O menu conserva os 13 módulos e a ordem da referência do simulador. Os módulos ainda não implementados apresentam uma explicação do âmbito, sem simular operações inexistentes.

### Painel do Docente

1. Filtrar turma, roteiro, estado, prazo, empresa ou estudante; combinar filtros por marco.
2. Abrir a empresa na matriz, seleccionar um bloco e consultar actividades e resultados.
3. Consultar contribuição humana confirmada, acções colectivas e eventos automáticos separadamente, sem rankings.
4. Criar, editar e eliminar rascunhos de orientação; registar uma orientação com motivo, confirmação e histórico.
5. Recarregar a página e verificar a persistência. Orientações registadas ficam apenas para consulta.
6. Realizar tarefas na empresa do exemplo seleccionado e voltar ao docente: a empresa ligada reflecte as tarefas, respostas e evidências confirmadas no estudante.

As orientações são locais: não enviam mensagens, não alteram o trabalho do estudante e não constituem intervenções autorizadas em produção. Os prazos usam a data fixa do cenário (22/10/2026); não são alertas em tempo real. Existem dez empresas fictícias em duas turmas.

### Editor visual de roteiro

1. Navegar por fases, sessões e subagrupamentos do roteiro importado da folha de cálculo.
2. Criar, renomear, mover, trocar e apagar nós; criar subagrupamentos sem depender do AppShell.
3. Ligar nós por precedência. Ligações repetidas, auto-dependências e ciclos são rejeitados.
4. Criar etiquetas, atribuí-las aos nós, convertê-las em agrupamentos e usar agrupamentos como etiquetas.
5. Guardar versões integrais, mudar de versão, exportar/importar JSON e repor a importação inicial.

O browser guarda automaticamente o rascunho local. **Guardar versão** cria uma cópia identificada do estado actual. A fonte não declarava precedências formais, pelo que a versão inicial começa sem ligações inferidas.

## Arquitectura

```text
app/          composição, ponto de partida, providers, router e shell substituível
features/
  scenario-editor/          editor visual, versões, etiquetas e precedências
  teacher-mission-control/  acompanhamento, evidências e orientações locais
  student-journey/
    pages/        coordenação das experiências
    components/   apresentação, formulários e controlos
    hooks/        consultas e mutações
    services/     contrato e regras de domínio
    api/          adaptador JSON + testes
    schemas/      validação Zod
    types/        tipos derivados dos schemas
    index.ts      API pública
shared/       primitivas independentes, utilitários e tokens
data/         fixtures JSON iniciais
```

A UI não importa os fixtures nem conhece o localStorage. O ponto de composição injecta `JsonJourneyRepository` através do contrato assíncrono `JourneyRepository`. Para introduzir uma API futura, criar outro adaptador e substituí-lo em `app/providers/AppProviders.tsx`, mantendo o conteúdo das features.

O docente tem o seu próprio contrato `TeacherRepository`. A composição em `app/providers/mapStudentJourney.ts` liga a Horizonte Verde à fonte do estudante, sem imports entre internos das features. Só a regra uniforme de percentagem é partilhada em `shared/lib/progress.ts`.

Regras obrigatórias: [AGENTS.md da raiz](../AGENTS.md). Decisões e limites: [Arquitectura](docs/architecture.md).

## Persistência e dados

- `src/data/student-roadmap-example-1.fixture.json` e `student-roadmap-example-2.fixture.json` são as fontes iniciais; não são reescritas pelo browser. O fixture anterior é preservado para regressão.
- Alterações são serializadas em JSON no localStorage. Estudante, docente e hub social usam o prefixo `spee.roadmap-2026.<exemplo>.` nas respectivas chaves. A selecção do exemplo é conservada em sessionStorage.
- O docente parte de `src/data/teacher-mission-control.fixture.json` e guarda orientações/histórico na chave independente `spee.teacher-mission-control.v1`. Não escreve no cenário do estudante. A exportação/importação do estudante não inclui estas orientações; a exportação do docente fica fora desta iteração.
- O editor parte de `src/data/scenario-editor.fixture.json` e guarda rascunho, versões e estrutura na chave independente `spee.scenario-editor.v1`. O JSON exportado inclui todas as versões.
- Sobrevivem a reload/reabertura no mesmo browser e origem; não são partilhadas entre máquinas, browsers ou portas diferentes.
- Limpar os dados do site apaga os cenários locais. Os contratos de exportação/importação JSON são preservados, mas essas ferramentas não estão expostas na interface desta fase.
- Não introduzir dados reais, confidenciais ou pessoais. Este armazenamento não é cifrado nem um mecanismo de segurança.
- Importações são validadas por versão, tamanho e schema. Uma falha de escrita não produz uma confirmação falsa.
- A revisão detecta alterações obsoletas, mas não oferece transacções multi-utilizador ou sincronização entre separadores.
- Os eventos são apenas histórico de demonstração, não uma pista de auditoria inviolável.

## Verificação

```sh
npm run check
npm run build
npm run build-storybook
npx playwright install chromium
npm run test:e2e
```

`check` executa TypeScript, ESLint, a guarda de fronteiras e Vitest. Playwright inicia/reutiliza Vite e Storybook e testa os fluxos em contextos isolados, sem alterar o cenário do browser pessoal. As capturas ficam em `test-results/`.

Quando já existir Google Chrome instalado, pode usar `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` sem descarregar outro browser. Por defeito, usa o Chromium gerido pelo Playwright.

[Validação desta iteração](docs/ux-validation.md) · [Dependências e referências](docs/dependencies.md).

[Validação do docente](docs/teacher-validation.md) · [Comparação com os mockups](design-qa.md).
