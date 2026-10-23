# Regras para assistentes — SPEE Mission Control

## Objectivo e âmbito

Construir um frontend local para descobrir, desenhar e validar UX, feature por feature. O código da aplicação vive em `frontend/`; os documentos, scripts e protótipos existentes na raiz e em `output/` são fontes do projecto e devem ser preservados. Responder em Português de Portugal, com grafia anterior ao Acordo Ortográfico de 1990, usando o skill `portugues-de-portugal` quando disponível.

Nesta fase não criar servidor de aplicação, endpoints/API backend, base de dados, autenticação real ou integrações externas. Vite e Storybook servem apenas os recursos de desenvolvimento do frontend. Não introduzir uma API local para escrever JSON. As interfaces do docente e do estudante continuam separadas; consultar os PRDs em `output/mission_control_unificado/` e as séries docente v3 e estudante v4. Conflitos de requisitos ficam documentados, não resolvidos por inferência.

## Organização do projecto

- `frontend/src/app/`: composição de dependências, providers, router e shell substituível.
- `frontend/src/features/<feature>/`: componentes, páginas, hooks, schemas, serviços e adaptadores pertencentes à feature. Criar apenas as pastas necessárias.
- `frontend/src/shared/`: elementos usados efectivamente em várias áreas ou com uma responsabilidade arquitectural transversal concreta, como primitivas de UI acessíveis.
- `frontend/src/data/`: fixtures JSON versionadas, separadas da lógica da aplicação.
- `frontend/tests/`: testes de fluxos no browser e guardas arquitecturais. Testes unitários vivem junto do código testado.
- `frontend/docs/`: decisões arquitecturais, persistência, fronteiras e âmbito da experiência actual.

A unidade prioritária de organização é a feature/domínio funcional, não o tipo técnico de ficheiro. Identificar a feature antes de acrescentar funcionalidades. Não criar abstracções, pastas vazias ou funcionalidades apenas para completar uma estrutura idealizada.

## Regras de dependência e APIs públicas

1. `app` compõe as features e pode importar apenas os respectivos `index.ts` públicos.
2. Uma feature não importa `app`, o shell ou ficheiros internos de outra feature.
3. Quando indispensável, uma feature pode consumir a API pública de outra através de `@/features/<feature>`; documentar a necessidade e evitar ciclos. Preferir composição/injecção em `app` quando possível.
4. Cada feature expõe em `index.ts` apenas páginas, providers, contratos e fábricas necessários aos consumidores externos. Não reexportar todos os ficheiros.
5. Dentro da própria feature, usar imports relativos; fora dela, usar a API pública. `shared` não depende de `features`, `app` ou fixtures.
6. `data` contém fixtures, não lógica de negócio. No código de execução, apenas o ponto de composição em `app/providers` e os adaptadores de dados podem importar fixtures. Componentes, páginas e hooks nunca importam JSON nem a localização dos ficheiros. Testes e stories podem importar fixtures para preparar cenários isolados, sem escrever no armazenamento da aplicação.
7. Não aceder a `localStorage`, `fetch` ou outra persistência em componentes de apresentação. Importação/exportação de cenários passa pelo contrato da feature.
8. Verificar fronteiras com o comando `npm run check:boundaries`; não enfraquecer a guarda para fazer passar uma alteração.

## Independência do AppShell

1. Features não podem depender de `app/shell`, `AppShell`, `MainLayout`, Header, Sidebar, Footer ou menus globais.
2. O shell pode depender das features apenas nos pontos de composição necessários; preferir o router como ponto de montagem através de `Outlet`.
3. Componentes partilhados não dependem do shell.
4. Nenhuma feature compensa dimensões do header/sidebar/footer com margens, offsets, alturas fixas ou selectores que conheçam a estrutura do template. Deve ocupar o espaço que recebe.
5. Navegação funcional e apresentação do menu permanecem separadas. A feature pode fornecer rotas/metadados; o shell decide como os apresentar.
6. Componentes importantes devem poder ser renderizados isoladamente, incluindo em Storybook com providers mínimos e sem AppShell.
7. O shell actual é temporário e substituível. Tokens visuais são variáveis CSS; evitar selectores globais abrangentes que alterem implicitamente componentes.
8. A integração futura do template de produção deve concentrar alterações em `app/shell`, `app/router` e `app/providers`, preservando as features.

Pergunta obrigatória para cada feature importante: “Continuaria a funcionar noutro layout, sem o header, sidebar, menus e footer actuais?” Verificar com uma story isolada ou teste equivalente. Informar o utilizador antes de uma decisão de UX exigir quebrar estas fronteiras.

## UI, componentes e hooks

- Páginas coordenam uma experiência; componentes de apresentação recebem dados e callbacks. Lógica de domínio fica em serviços/funções puras; persistência em repositories/adaptadores.
- Preferir componentes pequenos com responsabilidade compreensível. Separar formulários, filtros, listas e modais quando representem responsabilidades reais; não fragmentar apenas para produzir ficheiros.
- Hooks da feature coordenam consultas, mutações e estado da experiência. Não colocam acesso directo aos fixtures na UI nem escondem efeitos fora do âmbito da feature.
- Usar React Hook Form para formulários relevantes e Zod para validação. Derivar os tipos dos schemas quando apropriado, evitando duplicação divergente.
- Usar TanStack Query para estado de dados, invalidação e estados de carregamento/erro; estado visual efémero pertence a React/router. Não adicionar outra biblioteca de estado sem necessidade demonstrada.
- Incluir estados vazios, loading, erro, feedback, disabled e confirmação nas operações relevantes. Usar rótulos acessíveis, foco visível, navegação por teclado e confirmação para eliminação.
- Privilegiar tokens e classes locais. Não utilizar dados de demonstração como se fossem resultados reais nem inferir progresso por cliques ou tempo de sessão.

## Schemas, tipos, serviços e repositories

- Contratos são assíncronos e independentes de browser, JSON, transporte ou implementação de API. Usar operações com significado para a feature, sem construir um framework genérico prematuro.
- Adaptadores JSON implementam esses contratos; validar o estado importado, a versão do documento e os dados persistidos. Falhas de leitura/escrita devem aparecer na UX, nunca causar perda silenciosa ou falsa confirmação.
- Componentes consomem hooks/serviços; estes recebem um repository por injecção de dependência. Somente a composição conhece a implementação concreta.
- Fixtures JSON são dados iniciais. As alterações locais são serializadas em armazenamento do browser; exportar/importar JSON permite transportar cenários. Explicar limites de origem/browser, disponibilidade e ausência de escrita automática nos ficheiros do projecto.
- A futura API deve substituir o adaptador na composição, mantendo componentes, formulários, páginas, contratos e hooks tanto quanto possível. Não implementar essa API antecipadamente.
- Tratar alterações relacionadas como uma operação consistente. Preservar eventos confirmados; não declarar uma actividade concluída antes de a mutação terminar com sucesso.

## Shared e nomes

Promover código para `shared` quando houver reutilização real ou uma razão arquitectural clara, documentando-a. Primitivas shadcn/ui e utilitários de classes são transversais; modelos específicos do percurso não são.

Pastas de features em kebab-case; componentes/páginas/providers em PascalCase; hooks `useX`; funções e variáveis camelCase; ficheiros de teste `*.test.ts(x)` e stories `*.stories.tsx`. IDs de domínio são estáveis e distintos dos rótulos em português. Preferir nomes descritivos, imports explícitos e ausência de `any` injustificado.

## Dependências e alterações mínimas

Antes de adicionar uma dependência: inspeccionar `package.json` e lockfile; verificar se React, browser ou bibliotecas instaladas resolvem a necessidade; identificar a lacuna; verificar compatibilidade e documentação oficial; instalar apenas o pacote necessário; actualizar lockfile e documentação da decisão. Stack preferida: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod, Vitest, Playwright e Storybook.

Não fazer refactoring de código não relacionado, reestruturar o projecto de forma massiva ou alterar documentos/protótipos sem necessidade. Preservar alterações existentes. Não enfraquecer regras, validações ou testes para obter sucesso aparente. Actualizar documentação quando uma decisão arquitectural mudar.

## Testes e Storybook

- TypeScript estrito e lint sem erros.
- Vitest: lógica de domínio, invariantes, schemas, contrato/repository e falhas de persistência; testes com armazenamento em memória injectado, sem depender do browser pessoal.
- Playwright: fluxos completos relevantes, persistência após reload, validação, confirmação/eliminação, importação e estados responsivos. Não tocar em contas ou sistemas reais.
- Stories para componentes importantes, reutilizáveis ou com múltiplos estados. Demonstrar Default/WithData/Empty/Loading/Error/Disabled quando aplicável; evitar stories triviais sem valor.
- Pelo menos a experiência principal deve ter uma story sem AppShell. O Storybook não deve escrever no armazenamento normal da aplicação.
- Repetir verificação visual depois da última alteração visual. Compilar não substitui testar a experiência no browser.

## Antes de alterar código

O agente deve:

1. identificar a feature afectada;
2. ler o AGENTS.md;
3. verificar se existe AGENTS.md mais próximo da feature;
4. identificar os ficheiros que realmente precisam de alteração;
5. verificar as APIs públicas existentes;
6. evitar modificar código exterior ao âmbito da tarefa;
7. apresentar uma pequena explicação da abordagem antes de efectuar alterações significativas.

## Depois de alterar código

Verificar e indicar o que foi efectivamente executado:

- TypeScript compila;
- lint passa;
- testes relevantes passam;
- imports respeitam as fronteiras;
- não foi introduzida dependência desnecessária;
- não existe acesso directo indevido aos dados;
- componentes continuam com responsabilidades delimitadas;
- alterações não relacionadas não foram introduzidas;
- stories relevantes e build continuam válidos;
- o fluxo principal funciona no browser e os componentes mantêm independência do shell.

## AGENTS.md locais

Criar um AGENTS.md local apenas quando uma feature suficientemente complexa necessitar de contexto próprio. Pode acrescentar regras, nunca contradizer ou enfraquecer este ficheiro. Não criar automaticamente em todas as pastas.
