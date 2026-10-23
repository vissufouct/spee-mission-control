# SPEE — experiências de frontend

Frontend local para exploração da UX do **Mission Control do Docente** e do **Meu Percurso do Estudante**, em áreas separadas. Não existe backend, API, base de dados ou autenticação real. Os documentos e imagens anteriores do projecto foram preservados; a aplicação vive em `frontend/`.

Versão publicada: [SPEE Mission Control no GitHub Pages](https://vissufouct.github.io/spee-mission-control/).

## Executar

Requisitos: Node.js **22.18+** e npm. Testado nesta máquina com Node 26.9.0.

```sh
cd "/Users/vali/Documents/Dev/SPEE Helpdesk Analysis/frontend"
npm ci
npm run dev
```

Abrir o [ponto de partida](http://127.0.0.1:5173/) e escolher entre o [Mission Control do Docente](http://127.0.0.1:5173/docente/mission-control) e o [Mission Control do Estudante](http://127.0.0.1:5173/estudante/percurso). O servidor Vite serve apenas o frontend e escuta em 127.0.0.1, sem exposição na rede.

```sh
npm run storybook
```

Abrir [Storybook](http://127.0.0.1:6006). Inclui 29 stories de componentes relevantes, sem o template principal e sem escrita no cenário da aplicação.

## O que já pode experimentar

1. Consultar **Meu Percurso**, filtrar actividades e explorar o percurso completo.
2. Abrir **Registar empresa** → **Continuar actividade**.
3. Editar dados, guardar um rascunho e recarregar a página: as alterações persistem neste browser.
4. **Rever e confirmar** → **Confirmar registo**: obter o resultado e descarregar um comprovativo JSON explicitamente sem validade oficial.
5. Regressar ao percurso: o cenário passa de 18% para 24%, apenas depois da confirmação.
6. Eliminar um rascunho com confirmação e criar outro, incluindo dados incompletos.
7. Em **Dados de demonstração**, exportar/importar JSON ou repor o cenário inicial.

Os números são ilustrativos: três de dezassete actividades confirmadas, depois quatro. A ponderação uniforme serve para experimentar a UX; **não representa uma decisão pedagógica aprovada**.

O menu conserva os 13 módulos e a ordem da referência do simulador. Os módulos ainda não implementados apresentam uma explicação do âmbito, sem simular operações inexistentes.

### Mission Control do Docente

1. Filtrar turma, roteiro, estado, prazo, empresa ou estudante; combinar filtros por marco.
2. Abrir a empresa na matriz, seleccionar um bloco e consultar actividades e resultados.
3. Consultar contribuição humana confirmada, acções colectivas e eventos automáticos separadamente, sem rankings.
4. Criar, editar e eliminar rascunhos de orientação; registar uma orientação com motivo, confirmação e histórico.
5. Recarregar a página e verificar a persistência. Orientações registadas ficam apenas para consulta.
6. Confirmar o registo da Horizonte Verde na área do estudante e voltar ao docente: o mesmo progresso passa de 18% para 24%.

As orientações são locais: não enviam mensagens, não alteram o trabalho do estudante e não constituem intervenções autorizadas em produção. Os prazos usam a data fixa do cenário (22/10/2026); não são alertas em tempo real. Existem dez empresas fictícias em duas turmas.

## Arquitectura

```text
app/          composição, ponto de partida, providers, router e shell substituível
features/
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

- `src/data/student-journey.fixture.json` é a fonte inicial, não é reescrito pelo browser.
- Alterações são serializadas em JSON no localStorage da origem actual, chave `spee.student-journey.v1`.
- O docente parte de `src/data/teacher-mission-control.fixture.json` e guarda orientações/histórico na chave independente `spee.teacher-mission-control.v1`. Não escreve no cenário do estudante. A exportação/importação do estudante não inclui estas orientações; a exportação do docente fica fora desta iteração.
- Sobrevivem a reload/reabertura no mesmo browser e origem; não são partilhadas entre máquinas, browsers ou portas diferentes.
- Limpar os dados do site apaga o cenário. Exportar JSON permite conservá-lo; importar e repor exigem confirmação.
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
