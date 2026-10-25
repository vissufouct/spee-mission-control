# Docente — decisões da segunda iteração

## Organização

Nova feature em `features/teacher-mission-control`, composta por páginas, vistas, hooks, selectores, schemas e um repository próprio. Rotas:

- /docente/mission-control
- /docente/mission-control/empresas/:companyId
- /docente/mission-control/empresas/:companyId/contribuicoes

O router monta páginas pela API pública. O shell recebe apenas o papel demonstrativo e o destino inicial; conserva as 13 entradas do simulador. ScrollRestoration pertence ao shell, não à feature.

Não foram adicionadas dependências. Mantêm-se React/Router, TanStack Query, RHF/Zod, primitivas Radix/shadcn, Lucide, Vitest, Playwright e Storybook.

## Mesma fonte, vistas separadas

AppProviders compõe dois repositories do estudante e injecta no JsonTeacherRepository uma função de leitura conjunta. `mapRoadmapCompany` projecta Horizonte Verde e Nascente Criativa dos seus próprios registos. A feature do docente não depende de componentes do estudante; a composição usa as APIs públicas.

A matriz utiliza os cinco blocos do roteiro actual. As 15 actividades e 48 tarefas são consultadas em cada empresa; o primeiro ano fiscal vazio fica fora do progresso. Os valores iniciais das duas empresas ligadas são 47%/0%, mas os registos locais posteriores prevalecem. Os registos dos cenários antigos ficam fora da vista corrente, preservados nos fixtures e no armazenamento histórico. O cenário corrente acrescenta oito empresas fictícias independentes, num total de dez, distribuídas por três turmas.

A projecção conserva respostas, ficheiros, datas e actores confirmados. Não fabrica eventos ou resultados para conclusões iniciais; estas podem ser sustentadas por tarefas obrigatórias concluídas e datadas. Membros da equipa não são automaticamente participantes com evidência. Não herdar prazos, versões ou dados operacionais do cenário anterior.

## Dados e orientações

JSON inicial permanece no disco. Alterações são serializadas em localStorage; não se escreve directamente nos ficheiros do projecto, nem se criou servidor para o fazer.

`TeacherRepository` expõe getSnapshot, saveOrientation, removeOrientation, recordOrientation e reset. A futura implementação de API deverá cumprir este contrato e mapear o estado comum no adaptador/ponto de composição, mantendo as vistas.

As orientações são privadas ao browser, com motivo obrigatório e estados draft/recorded. Guardar/editar/eliminar/registar cria histórico; registadas são imutáveis. Não se executa trabalho pelo estudante, não se envia mensagem, não há autenticação ou permissões reais. Isto não resolve as decisões pendentes sobre intervenções de produção.

Revisões protegem contra pedidos obsoletos no mesmo contexto; não há transacções distribuídas ou sincronização entre dispositivos. Refetch ao abrir a vista, regressar ao separador ou usar Actualizar dados lê a projecção actual. A interface não deve instalar directamente na cache o retorno bruto da mutação do docente.

Por decisão de 24 de Outubro de 2026, a UI não expõe ferramentas de demonstração, incluindo reposição em caso de erro. O contrato reset permanece para testes isolados, sem alterar o estudante. Dados existentes nunca são apagados automaticamente. Exportação do docente não foi antecipada.

## Consulta e UX

Filtros globais e por coluna combinam-se com AND e ficam na URL. Os indicadores descrevem as empresas filtradas; alertas contam actividades afectadas, não cada motivo separadamente. Os prazos são calculados relativamente a context.asOf, não ao relógio de execução; sem prazo na origem, nenhum alerta temporal é fabricado.

Eventos humanos confirmados incluem colaboração. O separador colectivo isola esses eventos; o automático não atribui contribuições humanas. Um evento pode envolver várias pessoas. A distribuição é alfabética e descritiva, sem ranking ou avaliação.

Resultados são consultáveis num modal local com contexto, referência e aviso de simulação. A integração com os módulos operacionais é explicitamente adiada, sem criar links externos fictícios.

## Isolamento

As três vistas funcionam no Storybook sem router, shell ou persistência real. Apenas as páginas coordenam query params e navegação. O AGENTS.md local acrescenta as invariantes de participação/orientações, sem enfraquecer as regras da raiz.

O armazenamento comum do docente e a migração não destrutiva das comunicações estão documentados em [Roteiro: exemplos e materiais](roadmap-scenarios.md#vista-conjunta-do-docente).

## Dez empresas e actualização aditiva

As duas origens do estudante mantêm prioridade para as suas empresas. O leitor injectado não substitui a lista completa: actualiza somente os IDs devolvidos. Os oito cenários adicionais vêm de `teacher-roadmap.fixture.json`, gerado por `scripts/roteiro/build-teacher-companies.py`; UI e hooks continuam independentes da localização dos dados.

Ao ler um snapshot anterior, `RoadmapTeacherStorage` acrescenta apenas turmas e empresas em falta, preservando revisão e comunicações. Não sobrescreve empresas existentes nem persiste durante a leitura. As submissões simuladas sem ficheiro são apresentadas como tal, sem ligação indevida a documentos dos exemplos. Ver os perfis e critérios no PRD do Docente v0.12.

## Participação ilustrativa nas conclusões

`mapRoadmapCompany` reúne os metadados `simulatedParticipants` das tarefas concluídas, apenas quando a actividade está concluída. Intersecta os nomes com os membros da empresa e retira IDs já documentados em eventos/submissões. Guarda o resultado no campo opcional `simulatedParticipantIds`; `participantIds` conserva a origem comprovada anterior.

`activityParticipants` reúne ambas as listas apenas para apresentação na matriz, na tabela e no detalhe. O detalhe e a tabela incluem uma nota discreta quando há participação ilustrativa. `contributionEvents` e as métricas com evidência continuam a ler exclusivamente os eventos confirmados. Os oito cenários independentes já possuem os seus próprios participantes simulados e não são alterados.

A projecção é recalculada ao ler os repositories do estudante, incluindo armazenamento anterior completado pelo adaptador. Não escreve no estudante nem modifica respostas, submissões, estado, revisão ou progresso. O schema valida os IDs ilustrativos contra a equipa. A story CompletedParticipation demonstra a empresa sem AppShell.


### Quizzes por participante
`quizResults` guarda respostas por `participantId` no contrato docente. A composição dos cenários individuais liga as respostas ao estudante de `context.studentName`; não usa a lista de participantes simulados para distribuir notas. O componente apresenta todos os membros, calcula a nota a partir de cada resposta e mostra «Não concluído» na ausência de realização identificada. Resultados antigos sem autoria continuam separados e explicitamente assinalados. A story `IndividualQuizResults` demonstra resultados e membros sem realização, sem AppShell.


O fixture docente contém cinco pedidos pendentes em tarefas distintas de empresas independentes e duas orientações gerais para as três turmas. `demoCommunicationsVersion` assinala a inclusão inicial destes exemplos: `RoadmapTeacherStorage` acrescenta apenas IDs ausentes numa migração, preserva registos existentes e não repõe notas removidas após a gravação da versão. Sem escrita automática durante a leitura.
