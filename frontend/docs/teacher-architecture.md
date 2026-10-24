# Docente — decisões da segunda iteração

## Organização

Nova feature em `features/teacher-mission-control`, composta por páginas, vistas, hooks, selectores, schemas e um repository próprio. Rotas:

- /docente/mission-control
- /docente/mission-control/empresas/:companyId
- /docente/mission-control/empresas/:companyId/contribuicoes

O router monta páginas pela API pública. O shell recebe apenas o papel demonstrativo e o destino inicial; conserva as 13 entradas do simulador. ScrollRestoration pertence ao shell, não à feature.

Não foram adicionadas dependências. Mantêm-se React/Router, TanStack Query, RHF/Zod, primitivas Radix/shadcn, Lucide, Vitest, Playwright e Storybook.

## Mesma fonte, vistas separadas

AppProviders injecta JsonTeacherRepository com o fixture do docente, armazenamento local e uma função de leitura da empresa ligada. Essa função usa o contrato público do estudante e mapStudentJourney.

A projecção utiliza os estados reais do cenário local, os eventos do estudante e o seu comprovativo. Os três estados inicialmente concluídos não são todos eventos de autoria: os estados sem evento original são identificados como cenário inicial e entram em automação/origem do cenário, sem atribuição humana.

Só Horizonte Verde tem ligação operacional demonstrativa ao estudante. As outras nove empresas são fixtures independentes para testar diversidade de estados. Os 63% do mockup não substituem os 18% efectivos desse cenário. A fórmula uniforme é experimental e foi extraída para shared por reutilização efectiva.

## Dados e orientações

JSON inicial permanece no disco. Alterações são serializadas em localStorage; não se escreve directamente nos ficheiros do projecto, nem se criou servidor para o fazer.

`TeacherRepository` expõe getSnapshot, saveOrientation, removeOrientation, recordOrientation e reset. A futura implementação de API deverá cumprir este contrato e mapear o estado comum no adaptador/ponto de composição, mantendo as vistas.

As orientações são privadas ao browser, com motivo obrigatório e estados draft/recorded. Guardar/editar/eliminar/registar cria histórico; registadas são imutáveis. Não se executa trabalho pelo estudante, não se envia mensagem, não há autenticação ou permissões reais. Isto não resolve as decisões pendentes sobre intervenções de produção.

Revisões protegem contra pedidos obsoletos no mesmo contexto; não há transacções distribuídas ou sincronização entre dispositivos. Refetch ao abrir a vista, regressar ao separador ou usar Actualizar dados lê a projecção actual. A interface não deve instalar directamente na cache o retorno bruto da mutação do docente.

Por decisão de 24 de Outubro de 2026, a UI não expõe ferramentas de demonstração, incluindo reposição em caso de erro. O contrato reset permanece para testes isolados, sem alterar o estudante. Dados existentes nunca são apagados automaticamente. Exportação do docente não foi antecipada.

## Consulta e UX

Filtros globais e por coluna combinam-se com AND e ficam na URL. Os indicadores descrevem as empresas filtradas; alertas contam actividades afectadas, não cada motivo separadamente. Os prazos são calculados relativamente a 22/10/2026, não ao relógio de execução.

Eventos humanos confirmados incluem colaboração. O separador colectivo isola esses eventos; o automático não atribui contribuições humanas. Um evento pode envolver várias pessoas. A distribuição é alfabética e descritiva, sem ranking ou avaliação.

Resultados são consultáveis num modal local com contexto, referência e aviso de simulação. A integração com os módulos operacionais é explicitamente adiada, sem criar links externos fictícios.

## Isolamento

As três vistas funcionam no Storybook sem router, shell ou persistência real. Apenas as páginas coordenam query params e navegação. O AGENTS.md local acrescenta as invariantes de participação/orientações, sem enfraquecer as regras da raiz.
