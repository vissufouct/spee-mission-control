# Roteiro SPEE — exemplos e materiais

Data: 25 de Outubro de 2026. Fonte de conteúdo: [Roteiro SPEE consolidado](../../output/mission_control_unificado/Roteiro_SPEE_Consolidado.md). Esta implementação aplica as 15 actividades e 48 tarefas dos quatro blocos detalhados. O primeiro ano fiscal é apresentado como «Brevemente», sem tarefas inventadas e sem entrar no denominador do progresso.

## Entrada e persistência

| Exemplo | Empresa fictícia | Ponto inicial |
| --- | --- | --- |
| 1 | Horizonte Verde, Lda. | Acolhimento e ideação concluídos; 4 de 7 tarefas da constituição legal concluídas e formulário de registo em rascunho. 24 de 48 tarefas e 7 de 15 actividades concluídas (47%). |
| 2 | Nascente Criativa, Lda. | Nenhuma tarefa realizada. 0 de 48 tarefas, 0 de 15 actividades; inicia no acolhimento. |

O popup de entrada do estudante oferece as duas escolhas. `?exemplo=1` e `?exemplo=2` seleccionam o cenário; a selecção é conservada em `sessionStorage` durante a navegação. Cada entrada recarrega a aplicação para criar uma cache de consultas independente. A UI identifica empresa e exemplo no cabeçalho do percurso.

Os fixtures estão em `src/data/student-roadmap-example-{1,2}.fixture.json`. Só a composição em `app/providers` conhece os ficheiros e escolhe o adaptador. Cada exemplo usa o prefixo `spee.roadmap-2026.<exemplo>.` no armazenamento do estudante e do hub social. O cenário antigo mantém os seus dados nas chaves anteriores; não há migração destrutiva. As visitas seguintes retomam as alterações desse exemplo, em vez de repor os dados iniciais.

As alterações não escrevem nos JSON do projecto nem são partilhadas entre computadores. Os ficheiros seleccionados são guardados no browser, juntamente com a submissão. Uma futura API substitui o repository; os componentes não conhecem estes caminhos. O Studio existente continua independente.

## Progressão e escolhas provisórias

A ordem editorial não cria bloqueios. As actividades podem decorrer em paralelo. A tarefa mostra a condição quando está bloqueada; o bloco actual é o primeiro bloco detalhado com actividades por concluir. Navegar para outro bloco não modifica o estado.

O alcance de algumas condições está por definir na fonte. Para permitir testar o fluxo, este cenário adopta o seguinte mapeamento explícito e reversível, pendente de validação pedagógica:

| Condição da fonte | Alcance usado no exemplo |
| --- | --- |
| Quiz de acolhimento: pelo menos 70% | Liberta o compromisso; quiz e compromisso aceite são pré-requisitos de todas as tarefas posteriores ao acolhimento. |
| Compromisso de responsabilidade | Aceitação expressa. «Não aceito» não conclui a tarefa. |
| Quiz de constituição: pelo menos 70% | Liberta as cinco tarefas operacionais/evidência restantes da constituição legal. A consulta do BAU continua obrigatória para concluir a actividade, mas abrir o portal não bloqueia ou conclui o quiz. |
| Leitura do guia documental | Liberta separadores, pastas e as duas tarefas de contratos/conta bancária. |
| Prospecção e contactos | Liberta o registo de clientes e fornecedores. |
| Orientação final | Ambas as tarefas aguardam as 14 tarefas das quatro actividades anteriores do bloco B04. Excluem-se as próprias tarefas da orientação para evitar um ciclo. |

Não se exige a conclusão integral de um bloco para abrir o seguinte, além das condições acima. As restantes tarefas podem ser executadas em paralelo. As relações são dados `dependsOn`, validados quanto a referências e ciclos. Não há um motor de processos externo.

Os quizzes de acolhimento e constituição têm quatro perguntas originais e aprovação a partir de 70% (3/4). O diagnóstico tem cinco perguntas, não exige nota mínima e surge com 4/5 (80%) no exemplo 1. A verificação final tem seis respostas Sim/Não; nesta experiência, todas devem ser Sim para a concluir. Esta regra, as perguntas e as tentativas ilimitadas são propostas de simulação, não um modelo de avaliação institucional aprovado. Tentativas sem aprovação apresentam erro; conservam-se as respostas da conclusão, não um histórico de tentativas falhadas.

As operações genéricas exigem confirmação explícita do resultado simulado. O registo da empresa reutiliza o formulário existente e exige dados válidos e confirmação final. Nenhuma operação envia dados para BAU, INSS, bancos ou sistemas comerciais. O docente consulta a mesma realização de tarefas das duas empresas, sem ver mensagens privadas do grupo ou do hub.

## Ficheiros e tarefas

Os materiais locais estão em `public/apoio/`, com caminhos relativos compatíveis com a base do GitHub Pages. As ligações externas abrem no portal de origem; os conteúdos de terceiros não são copiados para o repositório.

| Formato | Conteúdo original criado |
| --- | --- |
| Word (3) | Modelos editáveis de relatório final, plano de negócios e relatório de auditoria I. Campos de preenchimento, instruções e exemplos identificados. |
| Excel (2) | Recursos: quantidades, custos e total calculado; vendas: três meses, quantidades, preços e receitas calculadas. Dados fictícios, células de entrada e fórmulas diferenciadas. |
| PDF (12) | Apresentação SPEE, regras propostas, comunicação, organização da equipa, ideia com IA, modelo com IA, auditoria, arquivo, prospecção, imagens com IA, relatório de auditoria preenchido e evidência de publicação fictícia. |
| Imagens (3) | Capas de acolhimento, empreendedorismo/modelo/plano e entrada no mercado. |
| Páginas locais (4) | Modelo do relatório final, plano de negócios, identidade visual e mapa integral do roteiro. |

As folhas Excel contêm fórmulas, não totais estáticos: o exemplo de recursos totaliza 103 000 MZN e o de vendas 246 000 MZN. Estes montantes são inventados para testar a utilização dos modelos, não preços pesquisados.

Os vídeos não foram produzidos. Cinco tarefas utilizam três capas geradas por IA; o popup identifica «Vídeo previsto · capa ilustrativa» e permite «Simular visualização» antes da confirmação. Uma capa não é apresentada como prova de que existe um vídeo.

As três imagens seguem uma direcção comum: ilustração editorial de jovens empreendedores moçambicanos, branco, azul e ciano, sem marcas, texto ou botão de reprodução incorporado. Temas: equipa a explorar um percurso num portátil; equipa a trabalhar num modelo de negócio; entrada de uma pequena empresa no mercado. Não são fotografias de participantes reais.

Submissões aceitam os formatos definidos por tarefa (PDF, DOCX ou XLSX), até 2 MB por ficheiro. A leitura valida extensão e assinatura básica do formato; não equivale a verificação antivírus nem à análise semântica do documento. Seleccionar um ficheiro não o submete. A confirmação guarda ficheiro, nome, autor e data. Como alternativa explícita, pode seleccionar o ficheiro de exemplo e confirmar. Submetido não significa avaliado ou aprovado. Falhas de armazenamento mantêm o estado anterior e apresentam erro.

O limite total depende da quota do browser; várias evidências podem esgotá-la. Esta fase não utiliza armazenamento remoto. O contrato histórico de importação JSON mantém o limite de 2 MB; um cenário exportado com anexos maiores pode exceder esse limite de importação. Essas ferramentas não são expostas na interface desta fase.

O regulamento é uma proposta pedagógica; a publicação é um exemplo inequívoco sem validade oficial. O relatório de auditoria contém entrevistas fictícias. A aprovação institucional dos materiais, os vídeos definitivos e os eventos reais dos módulos ficam para a integração.

## Pesquisa e proveniência

Pesquisa efectuada em 25/10/2026. Os guias locais são texto original, sem reproduzir publicações de terceiros.

| Fonte | Uso e verificação |
| --- | --- |
| [BAU](https://www.bau.gov.mz/) | Portal oficial encontrado na pesquisa. Substitui o endereço de testes referido no roteiro. Abertura directa intermitente; ligação externa, sem copiar requisitos nem simular pedidos oficiais. |
| [Strategyzer — Business Model Canvas](https://www.strategyzer.com/library/the-business-model-canvas) | Fonte original consultada para os nove componentes. Ligação complementar e referência no guia; o modelo gráfico original não foi reproduzido. |
| [SEBRAE — Como elaborar um plano de negócio](https://sebrae.com.br/sites/PortalSebrae/cursosonline/como-elaborar-um-plano-de-negocio,1880b8a6a28bb610VgnVCM1000004c00210aRCRD) | Recurso pedagógico encontrado no portal. Pode exigir conta. Assinalada a necessidade de adaptar exemplos brasileiros ao contexto moçambicano. |
| [INSS — Lei n.º 13/2023](https://www.inss.gov.mz/sdm_downloads/20320/) | Página oficial encontrada na pesquisa para consulta complementar em RH. Abertura directa intermitente. Não se afirma que a lei isolada esgote o enquadramento aplicável. |
| [ITIS](https://www.itis.ac.mz/) e [IPEME](https://www.facebook.com/ipememocambique) | Endereços fornecidos no roteiro; mantidos como apoio, com disponibilidade dependente dos portais e eventual sessão no Facebook. |

## Reproduzir e verificar

- `scripts/roteiro/build-fixtures.py`: gera os dois JSON e o mapa HTML; não altera estado guardado nos browsers.
- `scripts/roteiro/build-documents.py`: usa python-docx e ReportLab para gerar Word, PDF e páginas de apoio.
- `scripts/roteiro/build-spreadsheets.mjs`: usa `@oai/artifact-tool` no ambiente de autoria para criar, recalcular, verificar e exportar Excel. Não é uma dependência do frontend.
- As capas geradas são ficheiros versionáveis; não se regeneram com os scripts.
- `catalogo-materiais.json` inventaria os recursos. `output/roteiro-qa/` conserva pré-visualizações para revisão.
- Testes unitários verificam as 48 tarefas, dependências, limiares, persistência, isolamento e recursos. Playwright verifica os exemplos reais e os cenários anteriores importados separadamente; Storybook mantém componentes isolados do shell.

Nenhuma dependência de execução foi acrescentada para o roteiro. Menu lateral, header e footer permanecem intactos.

## Correcções após teste de usabilidade

Os cartões de entrada descrevem estados iniciais e esclarecem que a navegação retoma o progresso local. Os PDF preparados incluem um campo opcional `preview`, gerado do próprio documento, para browsers sem visualizador PDF funcional. O repository acrescenta apenas esse metadado ausente quando o recurso coincide com o fixture; preserva estados e revisões. Evidências enviadas não usam a preview do exemplo. O ficheiro original continua descarregável.

Executar `python3 scripts/roteiro/build-previews.py` com PyMuPDF instalado depois de gerar documentos; o script valida que os exemplos têm uma página. Não foi acrescentada uma dependência à aplicação. O resultado de registo oferece regresso directo às tarefas, sem instruções de reposição inexistentes.


## Vista conjunta do docente

`createPanelRepositories` compõe dois `JsonJourneyRepository`, um por exemplo, e injecta no `JsonTeacherRepository` uma função que lê ambos. `mapRoadmapCompany` projecta exactamente os blocos, actividades, tarefas, respostas e submissões da origem. Os componentes não importam JSON. A base `teacher-roadmap.fixture.json` define três turmas, ciclo, colunas do roteiro e oito empresas fictícias independentes; a composição junta-lhes as duas projecções do estudante. São dez empresas no total, sem importar os registos dos cenários antigos.

Comunicações comuns ficam em `spee.roadmap-2026.teacher.shared.v1`. O adaptador `RoadmapTeacherStorage` lê essa chave ou, na sua ausência, reúne as comunicações compatíveis dos antigos snapshots docentes por exemplo. Preserva conteúdo/autor/data; atribui a empresa de origem; evita colisões de IDs; limita orientações gerais migradas à empresa original. A primeira mutação persiste o conjunto; as chaves antigas nunca são sobrescritas. Registos de actividades fora do novo roteiro permanecem nos snapshots anteriores, sem reatribuição. Cenários antigos explicitamente importados conservam o caminho de compatibilidade para testes.

A selecção do estudante não afecta a lista do docente. Novas orientações gerais abrangem as turmas escolhidas; mensagens específicas usam o ID explícito da empresa. Erros de validação, leitura ou quota surgem na experiência, sem reposição silenciosa. Os dados mantêm os limites de origem e browser: local e GitHub Pages não partilham progresso.

A projecção não inventa eventos para tarefas iniciais concluídas. A conclusão com data das tarefas obrigatórias constitui evidência de estado; autoria só é apresentada quando existe evento ou submissão correspondente. Não são herdados prazos ou resultados antigos. Um comprovativo de registo exige confirmação efectiva; submissão não é avaliação. Os dois exemplos partilham a Turma A e os nomes definidos nos fixtures, sem presumir que todos executaram todas as tarefas.

### Empresas adicionais no docente

`python3 scripts/roteiro/build-teacher-companies.py` gera as oito empresas independentes a partir das definições do roteiro. Cada perfil declara equipa, número de tarefas concluídas e prazo; os estados das actividades e blocos derivam dessas tarefas. O script só altera o fixture do docente, sem tocar nos exemplos do estudante ou no armazenamento do browser. Se o roteiro mudar, rever os pontos de progressão dos perfis antes de regenerar.

Os eventos, respostas e metadados de submissão das oito empresas são fictícios. Submissões sem documento associado mostram a indisponibilidade do ficheiro. Não há cópia de autores, ficheiros submetidos ou comprovativos dos exemplos do estudante. A restrição de não inventar realizações continua a aplicar-se integralmente às duas empresas projectadas.

`RoadmapTeacherStorage` acrescenta apenas turmas/empresas ausentes em snapshots existentes. Não substitui registos ou comunicações e mantém a revisão; a próxima mutação persiste o conjunto. `JsonTeacherRepository` renova apenas as empresas devolvidas pelo leitor injectado, preservando as oito independentes. A listagem mostra nomes e percentagens sem «Exemplo 1/2»; a entrada do estudante mantém essa escolha.

## Contexto compacto e participação por tarefa

Os três cartões representam blocos. O estado acompanha o rótulo de posição, sem barras, contagens, síntese da actividade seleccionada ou participantes. A lista de tarefas apresenta **Tarefa → Participantes → Estado → Acção** e reorganiza cada linha em espaços estreitos, sem depender do shell.

`LearningTask.simulatedParticipants` é metadado descritivo opcional com nomes e contribuições. O gerador prepara exemplos específicos para as 48 tarefas. `getTaskParticipants` apresenta-os apenas quando a tarefa está concluída ou em curso; nas restantes situações, mostra-se «—», sem ícone de informação. Um único tooltip por tarefa reúne nomes completos e contribuições; os nomes na coluna são abreviados. A nota de proveniência acompanha a lista. Estes dados não calculam progresso nem autoria confirmada do docente.

O adaptador completa metadados de tarefa ausentes a partir do mesmo ID no fixture, preservando listas personalizadas ou explicitamente vazias. Mantém a compatibilidade com os antigos metadados de actividade, mas não os usa como substituto da participação por tarefa. A leitura não escreve no armazenamento. Respostas, submissões, eventos, estados e revisão permanecem inalterados. O exemplo 2 não apresenta participação realizada antes de iniciar tarefas. Não foi acrescentada dependência nem integração externa.


## Actualização do roteiro e links provisórios — 02/11/2026

O roteiro mantém 15 actividades e passa de 48 para 52 tarefas. Acrescentam-se Conhecer as empresas do mercado (Ideação), Inscrever no INSS, Consultar documentos e regras bancárias e Aceder à banca electrónica (Início de actividades). As tarefas novas são obrigatórias, por iniciar, sem novas dependências bloqueantes. Preservam-se as conclusões anteriores; uma actividade antes concluída pode passar a Em curso até concluir a nova tarefa.

A tarefa Celebrar contratos de custos fixos passa a Contratar fornecedores, mantendo o ID e a actividade Celebrar contratos de serviços. O popup disponibiliza quatro botões: arrendamento, energia, água e Internet/correio electrónico. Preparar a inscrição no INSS apresenta dois botões de referência. Actualizam-se também as ligações ao BAU e ao ERP (página de autenticação).

O catálogo editável é [Links_Provisorios_Tarefas.md](../../output/mission_control_unificado/Links_Provisorios_Tarefas.md): 12 botões em oito tarefas, todos provisórios. As ligações abrem novo separador e nunca confirmam conclusão. O estado continua dependente da confirmação/evidência. A consulta do docente apresenta as mesmas ligações e preserva os registos de cada empresa. Os URLs não constituem integração automática com sistemas externos.

Aplicar alterações manuais do catálogo: `python3 scripts/roteiro/sync-task-links.py` a partir da raiz. O script valida todas as linhas antes de escrever. A leitura do repository actualiza metadados por ID sem apagar respostas, submissões ou estados. A leitura não escreve automaticamente no armazenamento.


## Preparação para a demonstração — pré-requisitos concluídos (02/11/2026)

Por pedido do utilizador, a composição do protótipo activa `demoPrerequisites` nos dois exemplos. As 18 tarefas referenciadas por `dependsOn` são apresentadas como concluídas, com respostas e evidências de exemplo quando necessárias. As restantes tarefas conservam os seus estados, permitindo demonstrar a sua execução sem realizar primeiro os pré-requisitos. Não são criados eventos de realização real. Conclusões e submissões já existentes são preservadas.

A preparação é aplicada no repository antes de calcular os estados agregados, pelo que o docente e o estudante apresentam os mesmos resultados. As regras de dependência permanecem intactas. A leitura não escreve no armazenamento; uma mutação posterior guarda o cenário preparado. Os fixtures de partida permanecem preservados. Para regressar à experiência com bloqueios, desactivar o terceiro argumento de `createPanelRepositories` em AppProviders e usar um cenário inicial sem alterações guardadas. O exemplo 2 deixa, durante esta preparação de demo, de representar zero tarefas realizadas.


## Contratos por fornecedor e abertura de conta — revisão de demonstração

«Contratar fornecedores» passa a quatro tarefas independentes na actividade Celebrar contratos de serviços: Arrendar espaço de trabalho (`b03-a03-t01`), Contratar fornecimento de energia eléctrica (`b03-a03-t03`), Contratar fornecimento de água (`b03-a03-t04`) e Contratar fornecimento de Internet e correio electrónico (`b03-a03-t05`). Cada tarefa tem estado, acção e uma ligação própria. Os endereços existentes são preservados no catálogo editável.

«Abrir a conta bancária» mantém o ID `b03-a03-t02` por compatibilidade com registos anteriores, mas pertence agora a Preparar as operações bancárias (`preparar-banca`), depois de Consultar documentos e regras bancárias e antes de Aceder à banca electrónica. O roteiro passa a 55 tarefas em 15 actividades.

Migração: o estado da conta acompanha a tarefa para a nova actividade; uma conclusão anterior do contrato agregado é preservada nas quatro tarefas que o desdobram. Registos individuais já existentes têm precedência. Não se duplicam tarefas. O modo de demonstração continua a pré-concluir os pré-requisitos.
