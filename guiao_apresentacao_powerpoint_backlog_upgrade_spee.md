# Guião da apresentação PowerPoint — Backlog do *upgrade* do SPEE

**Versão:** 1.2  
**Data:** 25 de Agosto de 2026  
**Documento de origem:** `backlog_desenvolvimento_upgrade_spee.md`, versão 1.6  
**Finalidade:** orientar a preparação de uma apresentação executiva; este ficheiro não é o PowerPoint final

---

## 1. Mensagem central

O backlog do *upgrade* do SPEE organiza uma trajectória de produto: começa pelos problemas críticos do sistema actual, cria as fundações de internacionalização, introduz o SPEE Studio como mecanismo de autoria e governação, completa o ciclo empresarial e prepara a expansão futura.

### Três mensagens que a apresentação deve fixar

1. **O backlog tem cinco componentes com finalidades diferentes.**
2. **A ordem é deliberada:** estabilizar, internacionalizar, desenvolver o Studio, completar o ciclo empresarial e só depois expandir.
3. **As funcionalidades e horas devem ser apresentadas apenas depois de o público compreender essa composição.**

### Regra narrativa

- Os primeiros quatro diapositivos explicam o que compõe o backlog, a lógica da prioridade e a forma de leitura.
- As horas aparecem pela primeira vez no diapositivo 5.
- O detalhe funcional é apresentado por prioridade, preservando a sequência P0 → P1 → P2 → P3 → P4.
- O MVP surge apenas depois da visão global e do detalhe das prioridades.

---

## 2. Parte I — Composição e lógica do backlog

### Diapositivo 1 — Backlog do *upgrade* do SPEE

**Objectivo:** apresentar o propósito do documento antes de introduzir funcionalidades ou horas.

**No ecrã:**

- título: “Backlog do *upgrade* do SPEE”;
- subtítulo: “Composição, prioridades e primeira iteração”;
- mensagem curta: “Uma sequência de construção para estabilizar, estruturar e expandir o SPEE”.

**Nota do orador:** o backlog não é uma lista indiferenciada de pedidos. Organiza problemas actuais, fundações comuns, desenvolvimento do SPEE Studio, evolução funcional e expansão futura.

**Visual recomendado:** cinco blocos identificados apenas como P0, P1, P2, P3 e P4, ainda sem números.

### Diapositivo 2 — O backlog é composto por cinco grupos de prioridade

**Objectivo:** explicar a composição geral sem apresentar esforço.

| Prioridade | Componente | Finalidade |
|---|---|---|
| **P0** | Correcções, rastreabilidade e validação | Fazer o SPEE actual funcionar com segurança, orientação e capacidade de recuperação |
| **P1** | Internacionalização e localização | Preparar um núcleo comum para várias línguas, países, regras e documentos |
| **P2** | SPEE Studio, motor e integração | Configurar, governar, publicar e executar processos empresariais |
| **P3** | Ciclo empresarial e funcionalidades adicionais | Completar a vida operacional da empresa simulada |
| **P4** | Expansão e inovação | Introduzir práticas transfronteiriças e novas tecnologias depois da estabilização |

**Mensagem-chave:** cada grupo responde a uma necessidade distinta do produto e prepara o grupo seguinte.

**Visual recomendado:** cinco colunas ou cinco camadas, com uma frase curta por prioridade.

### Diapositivo 3 — A ordem das prioridades reflecte dependências reais

**Objectivo:** explicar por que razão a sequência não deve ser invertida.

```text
P0 — estabilizar e tornar rastreável
→ P1 — separar núcleo e localização
→ P2 — configurar e executar através do Studio
→ P3 — completar o ciclo empresarial
→ P4 — internacionalizar e inovar em escala
```

**No ecrã:**

- segurança, integridade e bloqueios precedem conveniência;
- a fundação comum precede variantes por país;
- a configuração precede duplicação de código;
- o Studio precede a expansão do catálogo de processos;
- inovação só entra quando o núcleo é estável e observável.

**Nota do orador:** desenvolver primeiro as funcionalidades mais visíveis sem resolver fundações e dependências aumentaria fragmentação, retrabalho e pedidos de apoio.

### Diapositivo 4 — Cada item do backlog liga problema, entrega e validação

**Objectivo:** ensinar o público a ler o backlog antes de mostrar detalhes.

| Elemento | Pergunta respondida |
|---|---|
| Identificador e prioridade | Onde se posiciona a actividade? |
| Problema/objectivo | Que dificuldade ou resultado justifica o item? |
| Funcionalidades | O que deve ser desenvolvido ou alterado? |
| Dependências e integrações | Que módulos, dados ou decisões são necessários? |
| Critérios de aceitação | Como se comprova que está concluído? |
| Rastreabilidade | Quem fez o quê e que evidência foi produzida? |
| Estimativa | Qual é o esforço indicativo depois de o âmbito estar compreendido? |

**Mensagem-chave:** as horas só fazem sentido depois de compreender o âmbito, as dependências e a definição de sucesso.

**Transição do orador:** “Com a composição e a lógica estabelecidas, podemos agora analisar as funcionalidades e o esforço associado.”

---

## 3. Parte II — Funcionalidades e horas por prioridade

### Diapositivo 5 — O backlog global representa 9 440 horas-pessoa

**Objectivo:** apresentar a dimensão global depois de o público compreender a composição do backlog.

| Prioridade | Grupo | Horas-pessoa | Peso no backlog |
|---|---|---:|---:|
| **P0** | Correcções, rastreabilidade e validação | **1 600** | **16,9%** |
| **P1** | Internacionalização e localização | **1 360** | **14,4%** |
| **P2** | SPEE Studio, motor e integração | **2 880** | **30,5%** |
| **P3** | Ciclo empresarial e funcionalidades adicionais | **2 320** | **24,6%** |
| **P4** | Expansão e inovação | **1 280** | **13,6%** |
| **Total** |  | **9 440** | **100%** |

**Notas de leitura:**

- todas as estimativas são horas-pessoa, não horas de calendário;
- os valores foram calibrados para programadores pouco experientes;
- cada valor é uma estimativa central, com incerteza indicativa de aproximadamente ±40% antes do diagnóstico técnico;
- o MVP é um subconjunto deste backlog e não deve ser somado novamente ao total.

**Visual recomendado:** gráfico de barras horizontais, com P2 e P3 destacados como os maiores blocos.

**Nota do orador:** o SPEE Studio representa o maior investimento individual porque inclui autoria, motor, publicação, rastreabilidade e integração modular.

### Diapositivo 6 — O investimento cresce por patamares de maturidade

**Objectivo:** mostrar o esforço acumulado e a necessidade de supervisão técnica.

| Patamar | Resultado acumulado | Horas-pessoa |
|---|---|---:|
| P0 | SPEE estabilizado e percursos críticos rastreáveis | **1 600** |
| P0 + P1 | Fundação preparada para várias línguas e jurisdições | **2 960** |
| P0 + P1 + P2 | Fundação e SPEE Studio piloto | **5 840** |
| P0 a P3 | Produto funcional alargado | **8 160** |
| P0 a P4 | Backlog completo | **9 440** |

**No ecrã, como nota complementar:**

- supervisão técnica sénior, aproximadamente 15%: **1 416 h**;
- esforço técnico total com supervisão: **10 856 h**.

**Mensagem-chave:** o investimento pode ser faseado, mas uma equipa exclusivamente júnior exige acompanhamento nas áreas de maior risco.

**Visual recomendado:** escada de maturidade acompanhada por uma pequena barra de supervisão.

### Diapositivo 7 — P0 começa pelos bloqueios que impedem a simulação

**Objectivo:** apresentar os primeiros seis itens críticos.

| ID | Actividade | Horas |
|---|---|---:|
| CRIT-01 | Desempenho, disponibilidade e recuperação | 160 |
| CRIT-02 | Registo, inscrição e integridade de dados | 80 |
| CRIT-03 | Recuperação segura de conta | 80 |
| CRIT-04 | Sócios, convites e constituição | 160 |
| CRIT-05 | Loja em linha, inventário e activos mínimos | 80 |
| CRIT-06 | Mensagens de erro, prevenção e retoma | 80 |
| **Subtotal** |  | **640** |

**Nota do orador:** estes itens atacam as dificuldades que surgem antes de a prática empresarial conseguir avançar.

**Visual recomendado:** percurso “aceder → registar → constituir → adquirir activos → operar”, assinalando os bloqueios.

### Diapositivo 8 — P0 também dá controlo ao docente e orientação ao estudante

**Objectivo:** apresentar rastreabilidade, apoio, relatórios e validação dos módulos.

| ID | Actividade | Horas |
|---|---|---:|
| CRIT-07 | *Mission Control* docente | 160 |
| CRIT-08 | Helpdesk estruturado e base de conhecimento | 80 |
| CRIT-09 | Contabilidade, fiscalidade e relatórios | 240 |
| CRIT-10 | Usabilidade, telemóvel e acessibilidade | 160 |
| CRIT-11 | Pista de actividade e “Meu Percurso” | 160 |
| CRIT-12 | Teste e validação do módulo do INSS | 80 |
| CRIT-13 | Teste e validação do módulo de Empreendedorismo | 80 |
| **Subtotal** |  | **960** |
| **Total P0** |  | **1 600** |

**Mensagem-chave:** o docente deve saber quem fez o quê e o que falta; o estudante deve saber o que concluiu, o que falta e qual é o próximo passo.

**Visual recomendado:** dois painéis ligados à mesma pista de actividade — *Mission Control* e “Meu Percurso”.

### Diapositivo 9 — P1 prepara um único SPEE para vários contextos

**Objectivo:** explicar que internacionalização não é apenas tradução.

| Bloco | Itens incluídos | Horas |
|---|---|---:|
| Fundação técnica | Textos externos, Unicode, contexto de localização e formatos | 320 |
| Experiência linguística | Selecção de língua e preparação RTL | 160 |
| Terminologia | Glossário e terminologia | 80 |
| Governação de conteúdo | Tradução, documentos, pacote de jurisdição e pacote pedagógico | 640 |
| Qualidade | Acessibilidade, conformidade e testes de localização | 160 |
| **Total P1** |  | **1 360** |

**Detalhe das estimativas:**

- I18N-01 a I18N-04: 80 h cada;
- I18N-05: 160 h;
- I18N-06: 80 h;
- I18N-07 a I18N-11: 160 h cada.

**Mensagem-chave:** língua, país, jurisdição, sector e cenário pedagógico devem ser dimensões separadas.

### Diapositivo 10 — P2 posiciona o SPEE Studio no centro do *upgrade*

**Objectivo:** explicar o papel do Studio antes de apresentar as horas.

**No ecrã:**

```text
Autores e especialistas
→ SPEE Studio
→ validação e publicação
→ registo de pacotes versionados
→ motor de processos
→ módulos do SPEE
→ Meu Percurso, Mission Control e evidências
```

**Mensagem-chave:** o Studio configura e governa; o motor executa; os módulos conservam a responsabilidade pelos seus dados.

**Nota do orador:** o Studio não substitui contabilidade, vendas, tesouraria, documentos ou painéis. Coordena-os através de definições, comandos e eventos versionados.

### Diapositivo 11 — P2 concentra 2 880 horas-pessoa

**Objectivo:** apresentar a decomposição do SPEE Studio.

| Grupo | Capacidade | Horas |
|---|---|---:|
| STUDIO-01–03 | Catálogo, modelador e papéis | 240 |
| STUDIO-04–08 | Regras, documentos, efeitos, calendários e recuperação | 480 |
| STUDIO-09–12 | Ajuda, competências, pacotes e tradução | 320 |
| STUDIO-13–15 | Simulação, governação e publicação | 320 |
| STUDIO-16–20 | Observabilidade, segurança, administração e rastreabilidade | 480 |
| Fundação técnica | Motor, registo de pacotes e integração | 640 |
| Piloto integrado | Cinco processos de referência | 400 |
| **Total P2** |  | **2 880** |

**Visual recomendado:** barras empilhadas, destacando a fundação técnica de 640 h.

### Diapositivo 12 — P3 completa o ciclo empresarial

**Objectivo:** mostrar a expansão funcional depois da fundação e do Studio.

| Grupo | Funcionalidades | Horas |
|---|---|---:|
| FUNC-01–02 | Ideação, plano e organização da empresa | 240 |
| FUNC-03–04 | Vendas, compras e integrações | 400 |
| FUNC-05–06 | Pessoas, salários, fiscalidade e Segurança Social | 400 |
| FUNC-07–08 | Contabilidade, fecho e concursos públicos | 480 |
| FUNC-09–11 | Serviços institucionais, mercado e empresas mentoras | 400 |
| FUNC-12–14 | Avaliação, interoperabilidade e painéis | 400 |
| **Total P3** |  | **2 320** |

**Mensagem-chave:** o objectivo é permitir que a empresa simulada nasça, opere, cumpra obrigações, mantenha contas e preste contas.

### Diapositivo 13 — P4 expande apenas depois de a fundação estar estável

**Objectivo:** apresentar inovação e internacionalização avançada como evolução posterior.

| ID | Funcionalidade | Horas |
|---|---|---:|
| EXP-01 | Transacções e documentos transfronteiriços | 320 |
| EXP-02 | Carteiras móveis, microfinança e formalização | 240 |
| EXP-03 | Línguas africanas e conteúdo bilingue | 160 |
| EXP-04 | Cenários de clima, energia e logística | 160 |
| EXP-05 | IA assistiva com controlos | 240 |
| EXP-06 | XBRL ou relato digital equivalente | 160 |
| **Total P4** |  | **1 280** |

**Mensagem-chave:** tecnologias emergentes só entram quando acrescentam valor pedagógico e não substituem a prática do estudante.

### Diapositivo 14 — A prioridade reduz risco antes de ampliar escala

**Objectivo:** fechar a visão detalhada e preparar a entrada no MVP.

| Prioridade | Pergunta respondida |
|---|---|
| P0 | O SPEE actual funciona, orienta e permite recuperar? |
| P1 | O núcleo suporta várias línguas e jurisdições? |
| P2 | Os processos podem ser configurados, governados e executados? |
| P3 | A empresa percorre o ciclo empresarial completo? |
| P4 | A plataforma está preparada para expansão internacional e inovação? |

**Transição do orador:** “Não precisamos de construir tudo para provar a direcção. A primeira iteração concentra 1 200 horas no SPEE Studio e em dois modelos concretos.”

---

## 4. Parte III — MVP da primeira iteração

### Diapositivo 15 — O MVP prova o SPEE Studio em 40 dias úteis

**Objectivo:** apresentar o resultado da primeira iteração.

**No ecrã:**

- duração: **40 dias úteis**;
- esforço planeado: **1 200 horas-pessoa**;
- resultado 1: **versão funcional do SPEE Studio**;
- resultado 2: **modelo do INSS testado e validado**;
- resultado 3: **modelo de Empreendedorismo testado e validado**.

**Mensagem-chave:** o MVP corresponde a 12,7% do backlog global e cria a primeira prova integrada do conceito.

### Diapositivo 16 — O MVP entrega uma fatia vertical funcional

**Objectivo:** esclarecer o significado de “SPEE Studio funcional”.

**O MVP deve permitir:**

1. criar ou adaptar um modelo;
2. definir etapas, actividades, papéis, estados e pré-requisitos;
3. associar regras simples, documentos, ajuda e evidências;
4. validar e testar caminhos normais e de correcção;
5. submeter, rever, aprovar e publicar uma versão;
6. iniciar uma instância sem alterar manualmente a base de dados;
7. mostrar o percurso e o próximo passo ao estudante;
8. mostrar actividade e pendências ao docente;
9. conservar a pista de actividade e a versão executada.

**Nota do orador:** esta é uma versão para piloto controlado, não a implementação integral das 20 capacidades do Studio.

### Diapositivo 17 — O que fica fora do MVP permanece no backlog posterior

**Objectivo:** tornar os limites da primeira iteração inequívocos e evitar que o prazo de 40 dias absorva funcionalidades do produto completo.

| Fora do MVP | O que existe no MVP | Destino posterior |
|---|---|---|
| Modelador gráfico completo e todas as capacidades STUDIO-01–20 | Editor simplificado e fatia vertical de autoria à execução | Restante P2 |
| Todos os processos do ciclo empresarial | Apenas os modelos de INSS e Empreendedorismo | P3 |
| Pacotes completos para vários países e tradução integral | Estrutura mínima necessária ao piloto | P1 e P4 |
| Integração definitiva com contabilidade, fiscalidade, tesouraria, banco e salários | Integrações mínimas com identidade, turmas, documentos e notificações | P0, P2 e P3 |
| Funcionamento *offline* completo e sincronização de todas as transacções | Preservação básica do estado no ambiente do piloto | Backlog de resiliência |
| Migração massiva de dados históricos | Dados de teste e configuração controlada | Plano de migração posterior |
| Optimização e operação à escala nacional | Ambiente estável de piloto controlado | Preparação para produção |
| IA assistiva, XBRL e comércio transfronteiriço | Nenhuma destas capacidades | P4 |
| Certificação final de segurança, desempenho e acessibilidade de toda a plataforma | Verificações mínimas sobre o percurso do MVP | Endurecimento antes da produção |

**Regra de controlo do âmbito:** uma nova funcionalidade só pode entrar nos 40 dias se substituir outra de esforço equivalente ou se existir uma decisão formal de alterar prazo, equipa ou orçamento. A correcção de um defeito necessário para cumprir os critérios de sucesso não é considerada expansão do âmbito.

**Mensagem-chave:** o MVP prova o Studio e os dois modelos; não conclui todo o *upgrade*.

### Diapositivo 18 — O MVP distribui 1 200 horas por nove entregáveis

| ID | Entregável | Horas |
|---|---|---:|
| MVP-01 | Arranque, arquitectura mínima e ambiente | 80 |
| MVP-02 | Catálogo, papéis, versões e estados editoriais | 240 |
| MVP-03 | Editor simplificado e validação estrutural | 160 |
| MVP-04 | Teste, revisão, publicação e execução | 160 |
| MVP-05 | Pista de actividade, “Meu Percurso” e *Mission Control* | 160 |
| MVP-06 | Modelo do INSS | 80 |
| MVP-07 | Modelo de Empreendedorismo | 80 |
| MVP-08 | Integrações mínimas | 80 |
| MVP-09 | Qualidade, correcções, implantação e documentação | 160 |
| **Total** |  | **1 200** |

**Visual recomendado:** nove blocos agrupados em Fundação, Studio, Modelos e Qualidade.

### Diapositivo 19 — O modelo do INSS valida regras e integração

**Objectivo:** mostrar o que significa testar e validar o modelo do INSS.

**Percurso mínimo:**

```text
Entidade empregadora e trabalhador
→ contrato e remuneração
→ base contributiva e parâmetros
→ declaração
→ correcção
→ pagamento e comprovativo
→ estado e rastreabilidade
```

**Cenários obrigatórios:**

- percurso normal;
- dados obrigatórios em falta;
- declaração devolvida e corrigida;
- repetição sem duplicar declaração ou pagamento.

**Critério de validação:** fonte oficial identificada, regras versionadas e revisão por especialista autorizado.

### Diapositivo 20 — O modelo de Empreendedorismo valida o percurso pedagógico

**Objectivo:** mostrar a segunda prova do Studio.

**Percurso mínimo:**

```text
Problema ou oportunidade
→ cliente
→ proposta de valor
→ modelo de negócio
→ validação de mercado
→ custos e receitas
→ pitch
→ retorno e revisão
```

**Cenários obrigatórios:**

- percurso individual;
- percurso em equipa;
- proposta devolvida e novamente submetida;
- pré-requisito em falta com orientação de recuperação.

**Critério de validação:** rubrica previamente aprovada, revisão por docentes/especialistas e teste com estudantes.

### Diapositivo 21 — A equipa proposta oferece 120 horas de reserva

**Objectivo:** demonstrar a relação entre capacidade e âmbito.

| Recurso | Capacidade |
|---|---:|
| Cinco programadores juniores | 1 000 h |
| Responsável técnico experiente | 160 h |
| Profissional de testes/qualidade | 160 h |
| **Capacidade total** | **1 320 h** |
| **Âmbito do MVP** | **1 200 h** |
| **Reserva** | **120 h** |

**Nota do orador:** os especialistas de INSS e Empreendedorismo são necessários em momentos definidos; o tempo de espera por pareceres não está incluído.

### Diapositivo 22 — Os 40 dias terminam com demonstração e decisão

**Objectivo:** apresentar o plano temporal.

| Dias | Resultado |
|---|---|
| 1–5 | Âmbito, arquitectura, ambiente, fontes e rubricas confirmados |
| 6–15 | Catálogo, papéis, versões e editor simplificado |
| 16–23 | Validação, testes, revisão, publicação e execução |
| 24–29 | Rastreabilidade, “Meu Percurso”, *Mission Control* e integrações |
| 30–34 | Modelos configurados e testados internamente |
| 35–37 | Testes com especialistas, docentes e estudantes |
| 38–40 | Correcções finais, documentação, demonstração e decisão |

**Visual recomendado:** cronologia horizontal com sete marcos.

### Diapositivo 23 — A decisão é autorizar um piloto controlado

**Objectivo:** fechar a apresentação com decisões concretas.

**Decisões solicitadas:**

1. aprovar o âmbito de 1 200 horas e 40 dias úteis;
2. confirmar a equipa técnica mínima;
3. disponibilizar fontes e especialista para o INSS;
4. aprovar a rubrica e os validadores de Empreendedorismo;
5. confirmar os utilizadores dos testes;
6. aceitar as exclusões do MVP;
7. autorizar uma decisão final de aprovação, aprovação condicionada ou não aprovação no dia 40.

**Mensagem final:**

> O MVP não pretende concluir todo o *upgrade*. Pretende provar que o SPEE Studio consegue transformar dois modelos validados em percursos executáveis, rastreáveis e compreensíveis para docentes e estudantes.

---

## 5. Orientação visual da apresentação

- Usar uma cor consistente por prioridade: P0, P1, P2, P3 e P4.
- Destacar horas em números grandes; evitar tabelas com texto demasiado pequeno.
- Usar gráficos apenas quando mostrarem proporção, progressão ou capacidade.
- Representar o SPEE Studio como ponte entre autoria/governação e execução nos módulos.
- Manter “Meu Percurso” e *Mission Control* visualmente ligados à mesma pista de actividade.
- No bloco do MVP, usar uma cronologia de 40 dias e não uma lista de tarefas sem sequência.
- Assinalar sempre “horas-pessoa” para evitar interpretação como duração de calendário.
- Colocar as tabelas mais extensas nas notas ou em diapositivos de reserva se a apresentação tiver menos de 20 minutos.

## 6. Dados que não podem divergir no PowerPoint

| Dado | Valor aprovado neste guião |
|---|---:|
| Backlog global | **9 440 h** |
| Supervisão sénior | **1 416 h** |
| Total técnico com supervisão | **10 856 h** |
| P0 | **1 600 h** |
| P1 | **1 360 h** |
| P2 | **2 880 h** |
| P3 | **2 320 h** |
| P4 | **1 280 h** |
| MVP | **1 200 h** |
| Duração do MVP | **40 dias úteis** |
| Capacidade técnica do MVP | **1 320 h** |
| Reserva do MVP | **120 h** |
| Modelo do INSS no MVP | **80 h** |
| Modelo de Empreendedorismo no MVP | **80 h** |

---

## 7. Observação final

Este guião resume o backlog para fins de comunicação e decisão. Os requisitos funcionais, critérios de aceitação, dependências, riscos e exclusões completos permanecem no documento `backlog_desenvolvimento_upgrade_spee.md`.
