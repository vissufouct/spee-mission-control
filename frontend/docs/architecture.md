# Arquitectura e decisões — iterações estudante e docente

Complemento da segunda iteração: [composição, persistência e limites do docente](teacher-architecture.md).

## Estado encontrado e âmbito escolhido

O repositório de trabalho continha análises, PRDs, scripts e imagens dos protótipos, sem aplicação React, package.json ou arquitectura de frontend existente. Não foi necessária uma reestruturação dos documentos. O código novo foi colocado em `frontend/`; o `AGENTS.md` foi criado na raiz antes da implementação funcional.

Os domínios já evidentes são o percurso do estudante, o acompanhamento/intervenção do docente e os módulos operacionais do simulador. A primeira iteração iniciou **student-journey**; a segunda acrescentou **teacher-mission-control**, sem reestruturar o percurso existente. O registo de uma empresa é um fluxo demonstrativo interno à experiência; a criação de uma feature operacional de empresas fica para quando houver reutilização real ou requisitos próprios. Não existe um dashboard unificado docente/estudante.

## Separação de responsabilidades

```text
app/providers → JourneyProvider ← hooks ← páginas
      │                              │       │
      ▼                              ▼       ▼
JsonJourneyRepository ─── implementa contrato  componentes
      │                                      de apresentação
      ▼
fixture JSON + JsonStorage injectado
```

- `app/router` monta páginas exclusivamente pela API pública da feature.
- `app/landing` contém o ponto de partida do protótipo. É composição de desenvolvimento, não uma feature de domínio, e fica deliberadamente fora do `AppShell` de qualquer perfil.
- `app/shell` possui o menu, cabeçalho, identificação do utilizador demonstrativo, breadcrumbs, footer e comportamento responsivo global.
- As páginas coordenam dados, modais e navegação funcional. Não conhecem dimensões ou CSS do shell.
- `JourneyView`, listas, formulários e badges recebem dados/callbacks. Componentes ligados a hooks, como os controlos de cenário, coordenam a experiência sem conhecer a implementação dos dados.
- Schemas Zod validam fixtures, importações e formulários; os tipos são derivados, não duplicados.
- O repository executa criação, actualização, eliminação de rascunho e confirmação. Não se confirma uma actividade por abrir uma página ou guardar um formulário.
- `shared` contém apenas primitivas acessíveis, utilitários e tokens com função transversal. Regras e estados do percurso permanecem na feature.
- CSS funcional vive na feature; CSS do template vive em `app/shell`. Classes próprias de UI têm prefixos para reduzir conflitos com o template de produção.

## Persistência temporária

**Decisão:** JSON inicial + localStorage serializado, sem servidor adicional. O browser não escreve automaticamente nos ficheiros JSON do projecto. Exportação/importação é a ponte explícita para ficheiros.

O contrato é assíncrono e injectado; apenas `AppProviders` conhece o fixture e o armazenamento real. O adaptador recebe uma interface mínima getItem/setItem; os testes injectam armazenamento em memória. Ler não altera dados. Mutações validam, verificam revisão, registam o evento e só devolvem sucesso após a escrita.

A verificação de revisão evita dois pedidos obsoletos no mesmo contexto e detecta muitos casos de edição noutro separador; não constitui bloqueio distribuído. Não foi implementada sincronização multi-utilizador. A reposição explícita recupera dados corrompidos; uma leitura com erro nunca os apaga silenciosamente.

JSON importado pode alterar estados do cenário para testar a UX. Não representa prova de execução real, classificação ou auditoria segura.

## Substituição por backend futuro

1. Implementar `ApiJourneyRepository` conforme `JourneyRepository`.
2. Mapear DTOs externos para os tipos de domínio dentro do adaptador.
3. Injectar o novo adaptador em `app/providers`.
4. Preservar as páginas, formulários e componentes; adaptar o contrato apenas se novos requisitos de domínio o exigirem.
5. Executar os testes do contrato e de experiência.

Não foram criados endpoints fictícios, MSW, servidor Node ou uma API prematura.

## Substituição do template

1. Substituir `app/shell` pelo template de produção.
2. Manter o `Outlet` do router como área de conteúdo.
3. Conservar os providers ou adaptar apenas a composição/sessão.
4. Mapear a configuração de navegação para o menu do novo template.
5. Rever tokens e a integração do CSS base/Tailwind com o CSS de produção, sem adicionar offsets nas features.

O Storybook demonstra o percurso sem header, sidebar, menus ou footer. A dependência de React Router nas páginas é funcional; não é uma dependência do template. Formulários com protecção de saída usam um data router. Os componentes de apresentação não necessitam dele.

## Guardas e limites

`scripts/check-boundaries.ts` analisa imports, reexports, imports dinâmicos e acessos directos a armazenamento/transporte. Rejeita:

- feature → app;
- shared → app/features/data;
- imports de internos de outra feature, incluindo caminhos relativos;
- UI/hooks → adaptador concreto;
- UI → fixtures JSON;
- acesso directo a localStorage/fetch na UI/hooks;
- referências CSS explícitas ao shell dentro da feature.

Testes/stories podem ler fixtures para preparar cenários isolados. Esta guarda complementa a revisão: não prova ausência de todos os ciclos, responsabilidades excessivas ou dependências visuais indirectas.

## Hipóteses de UX ainda por validar

- Progresso de demonstração: peso uniforme por actividade, 3/17 → 4/17. A percentagem está em `shared/lib/progress.ts`, usada pelos selectores das duas features; não consolida a regra pedagógica.
- Campos de registo e regras são uma simulação para testar formulários, não validação legal/tributária.
- Confirmados são apenas de consulta; repetir a experiência exige repor/importar o cenário.
- Blocos seguintes e módulos externos são contexto. Desbloqueios reais, co-operação entre sócios, permissões e integrações aguardam iterações próprias.
- A identidade do shell é demonstrativa; não existe sessão/autenticação.
- Os pontos pendentes dos PRDs continuam pendentes. A implementação não os transforma em decisões aprovadas.
