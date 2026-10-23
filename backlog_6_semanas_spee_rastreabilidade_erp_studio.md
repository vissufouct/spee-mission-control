# Backlog de desenvolvimento do SPEE — iteração de 6 semanas

**Versão:** 1.3  
**Data:** 14 de Setembro de 2026  
**Equipa:** 2 programadores juniores e 2 programadores séniores auxiliados por IA  
**Duração:** 6 semanas  
**Estado:** proposta para validação funcional e técnica

---

## 1. Objectivo da iteração

Entregar, ao fim de seis semanas, uma prova vertical integrada que demonstre que o SPEE consegue:

1. representar os marcos do seu roteiro como etapas, actividades, subactividades, estados e evidências;
2. registar de forma rastreável quem fez o quê, quando, em que papel e com que resultado;
3. mostrar ao estudante o que está feito, o que falta e qual é o próximo passo;
4. mostrar ao docente, através de um *Mission Control* mínimo, quem realizou cada actividade e que subactividades estão pendentes ou bloqueadas;
5. trocar dados e estados com um ERP externo através de contratos versionados, seguros e idempotentes;
6. permitir que uma versão mínima do SPEE Studio configure, valide, versione e publique os dois percursos-piloto usados na demonstração.

Esta iteração não pretende implementar o SPEE Studio completo, integrar todos os ERP nem tornar rastreáveis todos os processos do SPEE. Pretende provar a arquitectura e o modelo funcional num âmbito controlado.

---

## 2. Âmbito e pressupostos

### 2.1. Âmbito incluído

- análise do roteiro actual e desejado do SPEE;
- inventário e mapeamento dos marcos do ciclo empresarial;
- definição do modelo canónico de marcos, actividades, subactividades, estados, actores e evidências;
- pista de actividade e cálculo do progresso;
- versões mínimas de “Meu Percurso” e *Mission Control*;
- camada de integração com ERP externos ao SPEE;
- um conector de referência executado em ambiente de testes;
- versão mínima do SPEE Studio, desenvolvida com auxílio de IA;
- testes automatizados, validação funcional, documentação e demonstração final.

### 2.2. Percursos-piloto assumidos

Para tornar o prazo exequível, assume-se a implementação detalhada de dois percursos:

1. **constituição da empresa e gestão de sócios**;
2. **venda, facturação, cobrança e reconciliação**.

Estes percursos podem ser substituídos durante a primeira semana, desde que a decisão não aumente o número de módulos e integrações envolvidos.

### 2.3. Profundidade do mapeamento

- o ciclo completo do SPEE será mapeado em nível macro;
- os dois percursos-piloto serão mapeados até ao nível de actividade, subactividade, actor, estado, evidência e próximo passo;
- outros processos serão registados no catálogo, mas não terão necessariamente execução funcional nesta iteração.

### 2.4. Integração ERP assumida

- será construída uma interface genérica de adaptação e um conector de referência;
- o conector funcionará em *sandbox* ou contra um ERP simulado;
- se um ERP-alvo, documentação técnica e credenciais de testes forem disponibilizados até ao fim da primeira semana, o conector de referência poderá usar esse ERP;
- na ausência desses elementos, a entrega será validada com um simulador que respeite o mesmo contrato.

### 2.5. Utilização de IA no desenvolvimento

A IA será usada para acelerar:

- geração inicial de estruturas de código;
- criação de testes e dados fictícios;
- documentação técnica;
- análise estática e propostas de refactorização;
- transformação assistida do mapa funcional em definições do Studio.

A IA não substitui:

- decisões de arquitectura;
- validação funcional dos marcos do SPEE;
- revisão de segurança e privacidade;
- revisão humana do código;
- aprovação de uma versão para demonstração ou produção.

Não serão introduzidos em ferramentas de IA segredos, credenciais, dados pessoais, dados reais de estudantes ou informação de produção.

---

## 3. Capacidade da equipa

As estimativas são apresentadas em **horas-pessoa produtivas**.

| Recurso | Quantidade | Capacidade produtiva por pessoa/semana | Capacidade em 6 semanas |
|---|---:|---:|---:|
| Programador júnior | 2 | 25 h | 300 h |
| Programador sénior auxiliado por IA | 2 | 30 h | 360 h |
| **Capacidade técnica total** | **4** | **110 h/semana** | **660 h** |

Distribuição proposta:

- **600 h** para itens comprometidos do backlog;
- **60 h** de reserva para imprevistos, integração, correcções e aprendizagem.

A assistência de IA já está reflectida na capacidade atribuída aos programadores séniores. Não deve ser acrescentado um segundo factor de aceleração às estimativas.

### 3.1. Papéis de execução

| Papel | Responsabilidade principal |
|---|---|
| Sénior 1 | arquitectura de rastreabilidade, modelo de eventos, cálculo de progresso e revisão do Studio |
| Sénior 2 | arquitectura de integração ERP, segurança, idempotência e revisão do Studio |
| Júnior 1 | serviço de actividade, testes, “Meu Percurso” e instrumentação dos percursos-piloto |
| Júnior 2 | conector ERP, testes de integração, *Mission Control* e componentes do Studio |
| Toda a equipa | planeamento, revisão de código, documentação, demonstrações e correcção de defeitos |

Todo o código produzido por um programador júnior ou gerado com assistência de IA deve ser revisto por, pelo menos, um programador sénior.

### 3.2. Estimativa de custos

Para efeitos de orçamento, a iteração de seis semanas implica o pagamento de **dois meses completos**. Esta regra aplica-se tanto à remuneração dos programadores juniores como às subscrições Pro dos programadores séniores.

Pressupostos fornecidos:

- remuneração de cada programador júnior: **9 000 MT por mês**;
- subscrição Pro para cada programador sénior: **100 USD por mês**;
- taxa de câmbio de referência: **1 USD = 65 MT**;
- cada um dos dois programadores séniores terá uma subscrição Pro durante toda a iteração.

#### Custo mensal conhecido

| Componente | Cálculo | Custo mensal |
|---|---:|---:|
| 2 programadores juniores | 2 × 9 000 MT | 18 000 MT |
| 2 subscrições Pro para os séniores | 2 × 100 USD × 65 MT | 13 000 MT |
| **Total mensal conhecido** |  | **31 000 MT** |

#### Custo para as seis semanas

| Componente | Cálculo | Custo em 6 semanas |
|---|---:|---:|
| 2 programadores juniores durante 2 meses | 2 × 9 000 MT × 2 meses | 36 000 MT |
| 2 subscrições Pro para os séniores durante 2 meses | 2 × 100 USD × 2 meses | 400 USD |
| Conversão das subscrições Pro | 400 USD × 65 MT | 26 000 MT |
| **Custo total conhecido da iteração** | 36 000 MT + 26 000 MT | **62 000 MT** |

O custo conhecido de **62 000 MT** cobre apenas a remuneração indicada para os programadores juniores e as subscrições Pro dos programadores séniores.

#### Custos não incluídos

- remuneração, honorários ou salário dos dois programadores séniores;
- encargos sociais, impostos ou benefícios associados à equipa;
- alojamento, base de dados, armazenamento, monitorização e outros serviços de infra-estrutura;
- licenças ou custos do ERP externo;
- consumo de APIs de IA que não esteja coberto pelas subscrições Pro;
- equipamentos, conectividade, formação, deslocações e apoio funcional externo.

O custo total do projecto só poderá ser calculado depois de serem fornecidos os custos dos programadores séniores e dos restantes recursos. Por esse motivo, o valor de 62 000 MT não deve ser interpretado como orçamento integral da iteração.

---

## 4. Distribuição global do esforço

| Frente | Resultado principal | Horas-pessoa |
|---|---|---:|
| A — Análise e mapeamento do roteiro | Marcos macro do SPEE e mapa detalhado dos dois percursos-piloto | 96 |
| T — Rastreabilidade e progresso | Pista de actividade, cálculo de progresso, “Meu Percurso” e *Mission Control* mínimos | 180 |
| E — Integração com ERP externos | Contrato canónico, camada de adaptação e conector de referência em testes | 120 |
| S — SPEE Studio auxiliado por IA | Autoria, validação, versionamento e publicação mínimos | 160 |
| Q — Qualidade, segurança e entrega | Testes, validação, documentação e demonstração | 44 |
| **Total comprometido** |  | **600** |
| **Reserva de capacidade** | Imprevistos, retrabalho e correcções | **60** |
| **Capacidade total** |  | **660** |

---

## 5. Frente A — Análise e mapeamento dos marcos do roteiro

Esta frente precede a implementação da rastreabilidade. O sistema não deve inferir marcos apenas a partir de ecrãs visitados ou de cliques; cada marco precisa de uma condição de conclusão e de uma evidência confirmada.

| ID | Actividade | Resultado/critério de aceitação | Responsável principal | Semana | Horas |
|---|---|---|---|---:|---:|
| A-01 | Inventariar documentos e fontes do roteiro | Lista versionada de processos, módulos, documentos, regras, estados, actores e serviços; lacunas e contradições identificadas | Sénior 1 | 1 | 16 |
| A-02 | Mapear o ciclo empresarial macro do SPEE | Mapa do percurso desde ideia/plano até fecho e prestação de contas, com fronteiras entre módulos | Sénior 1 + Júnior 1 | 1 | 24 |
| A-03 | Detalhar os dois percursos-piloto | Para cada percurso: etapas, marcos, actividades, subactividades, actores, dependências, estados, excepções e próximo passo | Sénior 1 + Sénior 2 | 1–2 | 24 |
| A-04 | Produzir a matriz marco–evento–evidência | Cada marco possui evento confirmador, origem, resultado esperado, evidência, regra de conclusão e política de reabertura | Sénior 1 + Júnior 1 | 2 | 16 |
| A-05 | Validar o mapa funcional | Workshop com responsáveis funcionais; decisões, dúvidas, exclusões e versão aprovada registadas | Sénior 1 + Sénior 2 | 2 | 16 |
|  | **Total da frente A** |  |  |  | **96** |

### 5.1. Estrutura mínima de cada marco

Cada marco deve indicar:

- identificador estável;
- nome e objectivo;
- processo e etapa;
- actividades e subactividades relacionadas;
- actor ou papel responsável;
- pré-requisitos;
- estado inicial, estados intermédios e estado concluído;
- evento que confirma a mudança de estado;
- resultado e evidência esperados;
- documento ou transacção relacionados, quando aplicável;
- regra para devolução, correcção, reabertura ou cancelamento;
- próximo passo normal e próximo passo em caso de bloqueio;
- campos visíveis ao estudante, docente, helpdesk e equipa técnica;
- versão da definição e data de vigência.

### 5.2. Entregáveis da análise

- inventário das fontes e decisões;
- mapa macro do roteiro do SPEE;
- mapas detalhados dos dois percursos-piloto;
- dicionário de marcos e estados;
- matriz de rastreabilidade marco–actividade–evento–evidência;
- lista de lacunas que exigem decisão funcional;
- acta de validação do mapa.

---

## 6. Frente T — Rastreabilidade e progresso

| ID | Funcionalidade | Resultado/critério de aceitação | Responsável principal | Semana | Horas |
|---|---|---|---|---:|---:|
| T-01 | Contrato comum de eventos | Esquema versionado com actor, papel, instituição, turma, empresa, processo, etapa, actividade, subactividade, instante, estado anterior/posterior, resultado, evidência e correlação | Sénior 1 | 1–2 | 28 |
| T-02 | Recolha e conservação da pista de actividade | Eventos dos percursos-piloto são recebidos, validados, ordenados e consultáveis; duplicados não criam efeitos adicionais | Sénior 1 + Júnior 1 | 2–4 | 40 |
| T-03 | Motor de estado, progresso e próximo passo | O progresso resulta de eventos confirmados; devolução, bloqueio e reabertura mantêm histórico e recalculam a acção seguinte | Sénior 1 + Júnior 1 | 3–5 | 36 |
| T-04 | “Meu Percurso” mínimo | O estudante vê actividades concluídas, pendentes e bloqueadas, evidências permitidas e próximo passo | Júnior 1 | 4–5 | 28 |
| T-05 | *Mission Control* mínimo | O docente filtra por turma, empresa e estudante e vê quem fez o quê, subactividades pendentes, bloqueios e última actualização | Júnior 2 + Sénior 1 | 4–6 | 32 |
| T-06 | Permissões, auditoria e exportação | Dados nominais limitados às turmas autorizadas; acções privilegiadas auditadas; exportação básica disponível | Sénior 1 + Sénior 2 | 5–6 | 16 |
|  | **Total da frente T** |  |  |  | **180** |

### 6.1. Eventos mínimos

- `process.instance.created`;
- `activity.started`;
- `activity.completed`;
- `activity.reopened`;
- `subactivity.available`;
- `subactivity.blocked`;
- `task.submitted`;
- `task.returned`;
- `task.approved`;
- `evidence.recorded`;
- `progress.updated`;
- `next.action.changed`;
- `sync.conflict.detected`;
- `process.completed`.

### 6.2. Critérios transversais de rastreabilidade

- abrir um ecrã, iniciar sessão ou clicar num botão não prova conclusão;
- uma actividade só fica concluída depois de existir resultado ou evidência confirmados;
- correcções e reaberturas não apagam eventos anteriores;
- “Meu Percurso” e *Mission Control* usam a mesma fonte de estado;
- o sistema indica quando os dados apresentados ainda não estão sincronizados;
- cada indicador agregado permite aprofundar até aos eventos que o sustentam;
- a retenção e anonimização são configuradas de acordo com a finalidade pedagógica e operacional.

---

## 7. Frente E — Integração com ERP externos ao SPEE

| ID | Funcionalidade | Resultado/critério de aceitação | Responsável principal | Semana | Horas |
|---|---|---|---|---:|---:|
| E-01 | Casos de integração e responsabilidade dos dados | Operações prioritárias, sistemas de origem, campos, frequências, permissões e conflitos documentados | Sénior 2 | 1 | 16 |
| E-02 | Contrato canónico e interface de adaptação | API/comandos/eventos versionados e independentes de fornecedor; mapeamento de identificadores definido | Sénior 2 | 2–3 | 24 |
| E-03 | Conector de referência — envio | Uma factura ou lançamento do percurso-piloto é enviado ao ERP de testes sem acesso directo à base de dados | Sénior 2 + Júnior 2 | 3–4 | 32 |
| E-04 | Conector de referência — retorno | Estado de aceitação, rejeição ou contabilização regressa ao SPEE e actualiza a pista sem fabricar conclusão | Júnior 2 | 4–5 | 24 |
| E-05 | Idempotência, repetição, segurança e conflitos | Reenvio não duplica dados; falhas são repetidas com limite; credenciais ficam protegidas; conflitos ficam visíveis | Sénior 2 | 4–5 | 16 |
| E-06 | Teste de ponta a ponta e manual do conector | Cenários normal, rejeitado, indisponível e repetido passam; configuração e diagnóstico documentados | Júnior 2 + Sénior 2 | 6 | 8 |
|  | **Total da frente E** |  |  |  | **120** |

### 7.1. Operações prioritárias do conector

No âmbito desta iteração, o conector deve provar pelo menos:

1. criação ou actualização controlada de uma entidade/cliente de testes;
2. envio de factura ou documento contabilístico do percurso-piloto;
3. recepção do estado externo;
4. correlação entre documento SPEE e registo ERP;
5. tratamento de rejeição funcional;
6. repetição segura após falha técnica;
7. registo da operação na pista de actividade.

### 7.2. Regras de integração

- sem acesso directo à base de dados do ERP;
- sem credenciais no cliente ou no código-fonte;
- comandos pedem acções e eventos comunicam factos já ocorridos;
- cada sistema conserva responsabilidade pelos dados do seu domínio;
- todas as operações possuem identificador de correlação e chave de idempotência;
- a indisponibilidade do ERP não deve produzir conclusão falsa no SPEE;
- dados simulados e dados reais permanecem separados;
- a integração deve poder ser substituída por outro adaptador sem alterar o modelo de progresso.

---

## 8. Frente S — SPEE Studio desenvolvido com auxílio de IA

| ID | Funcionalidade | Resultado/critério de aceitação | Responsável principal | Semana | Horas |
|---|---|---|---|---:|---:|
| S-01 | Base técnica e regras de desenvolvimento com IA | Estrutura do projecto, padrões, validações automáticas, testes mínimos e regras de utilização segura de IA definidos | Sénior 1 + Sénior 2 | 1 | 16 |
| S-02 | Catálogo e versões de processos | Criar, consultar, copiar e versionar definições; rascunhos e versões publicadas permanecem distintos | Sénior 1 + Júnior 1 | 2–3 | 28 |
| S-03 | Editor simplificado do roteiro | Formulário/tabulação para configurar etapas, marcos, actividades, subactividades, actores, estados, evidências e próximo passo | Sénior 1 + Júnior 2 | 3–5 | 40 |
| S-04 | Validador e simulador | Detecta identificadores repetidos, transições inválidas, actividades sem responsável/evidência e passos inalcançáveis; executa cenários de teste | Sénior 2 + Júnior 1 | 3–5 | 28 |
| S-05 | Revisão, publicação e ligação ao motor | Fluxo mínimo rascunho → revisão → aprovado → publicado; versão publicada inicia uma instância dos percursos-piloto | Sénior 1 + Sénior 2 | 4–6 | 28 |
| S-06 | Importação, exportação e API mínima | Definição pode ser exportada, validada e reimportada sem perder identificadores ou versões | Júnior 2 | 5–6 | 12 |
| S-07 | Usabilidade e documentação do Studio | Guia breve para autor/revisor e correcção dos bloqueios de utilização detectados na validação | Júnior 1 + Júnior 2 | 6 | 8 |
|  | **Total da frente S** |  |  |  | **160** |

### 8.1. Guardas para código produzido com IA

- todo o código gerado é tratado como proposta, não como solução aprovada;
- alterações geradas devem ser pequenas, rastreáveis e associadas a um item do backlog;
- o autor humano confirma licenças, dependências e origem de componentes;
- cada alteração material possui testes automatizados;
- nenhuma decisão de segurança ou autorização é aceite sem revisão sénior;
- não se usam dados de produção em exemplos, testes ou instruções enviadas à IA;
- o histórico da revisão humana fica registado;
- o ganho de velocidade não justifica omitir análise funcional, revisão ou testes.

### 8.2. Limites do Studio nesta iteração

O editor pode ser tabular ou baseado em formulários. Não é exigido um modelador gráfico BPMN completo. O objectivo é provar a autoria, validação, publicação, execução e rastreabilidade de uma definição versionada.

---

## 9. Frente Q — Qualidade, segurança e entrega

| ID | Actividade | Resultado/critério de aceitação | Responsável principal | Semana | Horas |
|---|---|---|---|---:|---:|
| Q-01 | Plano de testes e dados fictícios | Cenários, dados, resultados esperados e gravidade de defeitos aprovados antes do desenvolvimento principal | Sénior 2 + Júnior 2 | 1 | 8 |
| Q-02 | Testes automatizados e regressão | Contratos, progresso, Studio e integração ERP cobertos por testes de unidade, contrato e integração | Juniores + revisão sénior | 3–6 | 16 |
| Q-03 | Segurança, privacidade e acessibilidade | Permissões, segredos, minimização de dados, registos de auditoria e fluxos prioritários verificados | Sénior 2 | 5–6 | 8 |
| Q-04 | Validação com utilizadores e entrega | Demonstração, testes de aceitação, relatório de defeitos, decisão final e documentação de instalação/operação | Toda a equipa | 6 | 12 |
|  | **Total da frente Q** |  |  |  | **44** |

---

## 10. Plano das seis semanas

Cada semana compromete **100 h** e conserva **10 h** de reserva.

| Frente | Semana 1 | Semana 2 | Semana 3 | Semana 4 | Semana 5 | Semana 6 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Análise e mapeamento | 56 | 40 | 0 | 0 | 0 | 0 | 96 |
| Rastreabilidade | 8 | 28 | 40 | 40 | 36 | 28 | 180 |
| Integração ERP | 16 | 20 | 24 | 28 | 20 | 12 | 120 |
| SPEE Studio | 16 | 8 | 28 | 28 | 36 | 44 | 160 |
| Qualidade e entrega | 4 | 4 | 8 | 4 | 8 | 16 | 44 |
| **Total comprometido** | **100** | **100** | **100** | **100** | **100** | **100** | **600** |
| **Reserva** | **10** | **10** | **10** | **10** | **10** | **10** | **60** |

### Semana 1 — Descoberta, decisões e fundações

- inventariar fontes, processos e módulos;
- mapear o ciclo macro e iniciar os dois percursos-piloto;
- confirmar os casos de integração ERP;
- definir o esquema inicial de eventos;
- preparar a base técnica do Studio e as regras de utilização de IA;
- aprovar o plano de testes e os dados fictícios.

**Marco de saída:** percursos-piloto e ERP de referência escolhidos; arquitectura inicial e dúvidas funcionais registadas.

### Semana 2 — Modelo canónico aprovado

- concluir o mapeamento detalhado;
- aprovar a matriz marco–evento–evidência;
- fechar o contrato canónico de integração;
- implementar a recepção inicial de eventos;
- iniciar catálogo e versionamento do Studio.

**Marco de saída:** mapa funcional aprovado e contratos v1 congelados para o protótipo.

### Semana 3 — Primeira fatia vertical

- conservar eventos e correlacioná-los com processo, actividade e evidência;
- implementar o primeiro fluxo de estado e progresso;
- enviar o primeiro documento ao ERP de testes;
- editar e validar no Studio a primeira definição de percurso;
- automatizar testes de contrato.

**Marco de saída:** uma actividade configurada no Studio atravessa o motor, gera evento e chega ao ERP de testes.

### Semana 4 — Percurso integrado

- completar a recolha da pista de actividade;
- avançar o cálculo de progresso e próximo passo;
- receber estados do ERP;
- completar o editor simplificado e o simulador;
- iniciar “Meu Percurso” e *Mission Control*.

**Marco de saída:** um percurso-piloto funciona de ponta a ponta, incluindo retorno do ERP e cronologia consultável.

### Semana 5 — Visibilidade e robustez

- completar as vistas do estudante e do docente;
- tratar repetição, indisponibilidade e conflitos do ERP;
- implementar revisão e publicação no Studio;
- testar devolução, correcção, reabertura e bloqueio;
- executar revisão de segurança, privacidade e acessibilidade.

**Marco de saída:** os dois percursos-piloto são demonstráveis e apresentam progresso coerente nas duas vistas.

### Semana 6 — Validação e entrega

- concluir permissões, auditoria e exportação;
- terminar importação/exportação do Studio;
- executar regressão e testes de ponta a ponta;
- testar com responsáveis funcionais, docentes e utilizadores seleccionados;
- corrigir defeitos dentro da reserva disponível;
- produzir relatório de validação, documentação e demonstração final.

**Marco de saída:** decisão documentada de aprovação, aprovação condicionada ou não aprovação da prova vertical.

### 10.1. Carga semanal por pessoa

| Pessoa | Horas comprometidas/semana | Reserva/semana | Capacidade/semana |
|---|---:|---:|---:|
| Júnior 1 | 23 | 2 | 25 |
| Júnior 2 | 23 | 2 | 25 |
| Sénior 1 | 27 | 3 | 30 |
| Sénior 2 | 27 | 3 | 30 |
| **Total** | **100** | **10** | **110** |

---

## 11. Critérios de sucesso da iteração

A iteração será considerada bem-sucedida quando:

1. existir um mapa macro do roteiro do SPEE e dois percursos detalhados e validados;
2. cada marco dos percursos-piloto tiver condição de conclusão, actor, evento, resultado e evidência;
3. o SPEE Studio conseguir criar, validar, versionar, rever e publicar esses percursos;
4. uma versão publicada conseguir iniciar e executar uma instância de teste;
5. os eventos permitirem reconstruir quem fez o quê, quando e com que resultado;
6. o estudante conseguir identificar o que concluiu, o que falta e qual é o próximo passo;
7. o docente conseguir identificar contribuições, subactividades pendentes e bloqueios;
8. uma operação atravessar SPEE → conector → ERP de testes → SPEE com correlação de ponta a ponta;
9. a repetição da mesma operação não criar duplicados;
10. falhas, devoluções e reaberturas preservarem o histórico;
11. não existirem defeitos críticos ou altos abertos no percurso demonstrado;
12. existirem testes automatizados, documentação e relatório de validação.

---

## 12. Definição de concluído

Um item só é concluído quando:

- os requisitos e exclusões estão documentados;
- os critérios de aceitação foram demonstrados;
- o código foi revisto por outro programador;
- código produzido com IA recebeu revisão humana explícita;
- os testes automatizados relevantes passam;
- erros não expõem segredos nem dados pessoais;
- a alteração conserva correlação, versão e auditoria;
- a documentação técnica e de utilização foi actualizada;
- o responsável funcional aceitou o comportamento, quando aplicável;
- não existe defeito crítico conhecido no âmbito do item.

---

## 13. Fora do âmbito das seis semanas

- implementação de todos os processos do ciclo empresarial;
- rastreabilidade detalhada de todos os módulos do SPEE;
- modelador gráfico BPMN completo;
- Studio completo com todas as capacidades STUDIO-01–20;
- integração em produção com vários ERP;
- migração massiva de dados históricos;
- sincronização *offline* completa;
- tradução integral e pacotes de várias jurisdições;
- integrações bancárias, fiscais ou de Segurança Social reais;
- motor de relatórios avançados e análise preditiva;
- utilização de IA para avaliar automaticamente estudantes ou concluir actividades em seu nome;
- optimização e certificação para escala nacional.

Os elementos acima devem originar um backlog posterior e não podem ser absorvidos silenciosamente pela reserva de 60 horas.

---

## 14. Dependências e decisões necessárias

Devem estar disponíveis até ao fim da primeira semana:

- responsável funcional com capacidade de decisão;
- acesso ao código, ambientes e documentação do SPEE;
- representantes que conheçam o roteiro e os processos actuais;
- selecção final dos dois percursos-piloto;
- identificação do ERP-alvo ou aprovação do ERP simulado;
- documentação da API e credenciais de *sandbox*, quando aplicável;
- política para utilização de IA e repositórios autorizados;
- dados fictícios representativos;
- critérios de gravidade e autoridade para aceitar a entrega.

Se o ERP-alvo ou o mapa funcional não forem confirmados durante a primeira semana, deve manter-se o conector simulado e reduzir a profundidade da integração, sem retirar as actividades de análise e validação.

---

## 15. Riscos e respostas

| Risco | Consequência | Resposta prevista |
|---|---|---|
| Roteiro actual incompleto ou contraditório | Progresso calculado de forma errada | Mapear fontes, registar lacunas e exigir validação funcional antes de congelar contratos |
| Atraso no acesso ao ERP | Conector não validado contra fornecedor real | Usar simulador contratualmente equivalente e manter o adaptador substituível |
| Excesso de confiança em código gerado por IA | Defeitos, vulnerabilidades ou arquitectura inconsistente | Revisão sénior, testes obrigatórios, alterações pequenas e proibição de segredos nos pedidos à IA |
| Equipa júnior com pouca familiaridade com o SPEE | Retrabalho e baixa velocidade inicial | Trabalho em pares, exemplos verticais e reserva semanal protegida |
| Eventos incompletos nos módulos actuais | Pista de actividade fragmentada | Adaptadores de instrumentação e lista explícita de eventos em falta |
| Duplicação na integração | Documentos ou lançamentos repetidos | Idempotência, correlação, caixa de saída/entrada e testes de repetição |
| Dados nominais excessivos no *Mission Control* | Risco de privacidade | Minimização, autorização por turma e auditoria de consultas/intervenções |
| Tentativa de incluir o Studio completo | Incumprimento do prazo | Manter editor simplificado e critérios de sucesso da prova vertical |

---

## 16. Documentos de referência

- `backlog_desenvolvimento_upgrade_spee.md`;
- `output/especificacao_motor_processos_spee.md`;
- `output/spee_studio_visao_executiva.md`;
- `output/revisao_literatura_internacionalizacao_spee_v2.md`;
- `output/roteiro_apresentacao_final_internacionalizacao_spee.md`;
- `outputs/spee_helpdesk_chats_20260630/analise_sentimento_spee_helpdesk.md`.

---

## 17. Resumo executivo

O plano compromete **600 horas-pessoa** e protege **60 horas** para imprevistos. As primeiras duas semanas concentram-se no mapeamento do roteiro e nos contratos funcionais; as quatro semanas seguintes constroem e validam uma prova vertical.

Com os valores fornecidos, o custo conhecido para as seis semanas é de **62 000 MT**: 36 000 MT para dois meses de remuneração dos dois programadores juniores e 26 000 MT para quatro mensalidades Pro — duas mensalidades para cada programador sénior. Este valor não inclui a remuneração dos séniores nem os restantes custos técnicos e institucionais.

O resultado esperado não é um SPEE Studio completo nem uma integração ERP pronta para produção. É uma base demonstrável e extensível em que dois percursos configurados no Studio geram actividades rastreáveis, apresentam progresso coerente a estudantes e docentes e trocam um documento ou estado com um ERP externo em ambiente de testes.
