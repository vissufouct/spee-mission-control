# Análise Detalhada: Sentimento, Dores e Recomendações (SPEE Helpdesk)

Esta análise é baseada na extração de dados das 576 conversas (2705 mensagens) de suporte. Este documento combina as métricas quantitativas, exemplos reais extraídos das interações e respostas específicas às perguntas de negócio estabelecidas em `perguntas_analise_helpdesk.md`.

---

## 1. Análise de Sentimento (Docentes, Assistentes e Alunos)

### 1.1 Alunos e Docentes (Visitantes Regulares)
* **Total de Conversas (Alunos):** 535
* **Sentimento das Mensagens (Alunos):** Positivo (205), Negativo (431), Neutro (762)
* **Total de Conversas (Docentes):** 41
* **Sentimento das Mensagens (Docentes):** Positivo (28), Negativo (39), Neutro (136)

**Respostas às perguntas:**
* **Qual é o sentimento predominante na primeira mensagem enviada pelos utilizadores?**
  Marcardamente frustrado e/ou neutro-direto. Nas primeiras mensagens, **66.0%** contêm carga negativa/frustração ("não consigo", "erro", "urgente"), **33.3%** são neutras e apenas **0.7%** expressam positividade.
* **Como evolui o sentimento do utilizador ao longo da conversa?**
  Existe uma transição clara para alívio/satisfação. Na última mensagem, **14.4%** são positivas/corteses ("obrigado", "resolvido") e as negativas caem para **37.1%**.
* **Existe correlação direta entre o sentimento expresso nas últimas mensagens e o rating?**
  Sim. Conversas encerradas com expressões positivas tendem a receber rating de 5. A ausência de mensagem final ou encerramento negativo está correlacionada com ratings vazios ou negativos.
* **As interações de Docentes tendem a apresentar um tom mais exigente ou urgente em comparação com as dos Alunos?**
  Sim. A linguagem foca-se largamente na "gestão de terceiros" (alunos), apresentando um tom mais descritivo mas muitas vezes urgente devido ao impacto em bloco nas suas turmas.
  > *Exemplo Docente:* "As minhas turmas não aparecem para avaliação"

### 1.2 Assistentes de Helpdesk
* **Sentimento das Mensagens:** Positivo (247), Negativo (64), Neutro (721)

**Respostas às perguntas:**
* **Os assistentes conseguem manter um tom empático, paciente e profissional?**
  Sim. Cerca de 80% das interações são perfeitamente neutras (resolutivas) e os restantes 20% são respostas de cortesia.
* **Existe variação no sentimento das respostas entre os diferentes assistentes?**
  A variação é mínima. Os assistentes parecem seguir scripts padronizados (ex: Evgueni e Shola mantêm consistentemente a sua distribuição de respostas empáticas, mas a esmagadora maioria foca-se na instrução neutra em todos os operadores).
* **Em conversas muito extensas, é possível detetar fadiga na linguagem dos assistentes?**
  Não foi detetado aumento de vocabulário negativo em chats com >15 mensagens. A repetição e instruções mantêm-se neutras e profissionais ao longo do tempo.

---

## 2. Identificação das Principais Dores (Pain Points)

### Tabela de Ocorrências (Top Dores - Alunos):
| Tópico / Funcionalidade | Frequência (Chats) | Nível de Dor |
| :--- | :--- | :--- |
| **Acesso/Senha** | 102 | Alto - Bloqueio total de acesso |
| **Convites e Sócios** | 45 | Alto - Impede a progressão do grupo |
| **Ativos Mínimos (Loja Online)** | 28 | Elevado - Erro de usabilidade recorrente |
| **Contratos** | 30 | Médio - Dificuldade de navegação |

### Respostas às perguntas:

**Para os Alunos:**
* **Quais são os bugs técnicos ou erros de sistema mais frequentemente reportados?**
  Listados na tabela acima, destacando-se fortemente o bloqueio nos "Ativos Mínimos" e convite a Sócios.
* **Em que fases do simulador os alunos ficam bloqueados de forma mais recorrente?**
  Ficam bloqueados nas fases iniciais: *Registo Inicial/Acesso* e *Constituição da Empresa* (sócios, acessos, ativos mínimos).
* **Qual é o tempo médio de espera e a duração total da interrupção?**
  A duração média de um chat (tempo em que o aluno está com o seu problema a ser diagnosticado e resolvido) é de **10.0 minutos** (601 segundos).

**Para os Docentes:**
* **Quais são as dificuldades operacionais na gestão dos alunos?**
  Deparam-se com assimetrias de dados: alunos que garantem ter criado a empresa, mas não aparecem na plataforma do docente.
* **Existem queixas recorrentes sobre falta de visibilidade ou relatórios?**
  Sim, os docentes indicam claramente falta de visibilidade sobre o status real do aluno (ex: "O docente esta a notificar-me que não criei a empresa" revela que o docente não tem o painel atualizado com o progresso do aluno).

**Para os Assistentes:**
* **Quais são as tarefas mais manuais, repetitivas e de baixo valor?**
  A tarefa mais repetitiva é a reposição manual de senhas e o envio consecutivo da mesma *macro* com *workarounds* para os "Ativos Mínimos".
* **Que tipo de problemas geram as conversas mais longas?**
  As conversas mais complexas são sobre mecânicas específicas, como a associação incorreta de Sócios (tentar retirar e voltar a convidar sócios) e regras da empresa.
* **Existem queixas de indisponibilidade do helpdesk?**
  Ocorrem de forma esporádica e marginal (0 menções), sugerindo que há compreensão dos horários de resposta.

---

## 3. Principais Necessidades de Apoio (Support Needs)

### Respostas às perguntas:

**Para os Alunos:**
* **Que funcionalidades necessitam de melhores tutoriais/tooltips in-app?**
  A "Loja Online / Ativos Mínimos" e o processo de "Adição de Sócios". Estes ecossistemas necessitam urgentemente de alertas visuais para evitar erros prematuros.
* **A recuperação automática de password (self-service) reduziria o apoio?**
  Sim, dramaticamente. A implementação de "Esqueci-me da palavra-passe" reduziria uma enorme porção de conversas e trabalho desnecessário do Helpdesk.
* **Quais são os picos de horário/dias e como reforçar?**
  Os dados timestamp apontam para um pico registado pelas **Não especificado nos dados** (hora predominante de criação de mensagens) e sobretudo à **Não especificado nos dados**. O reforço deve incidir neste horário do período da tarde, garantindo que mais operadores estão online.

**Para os Docentes:**
* **Existe necessidade de um canal VIP ou FAQ exclusiva?**
  Sim. É recomendável criar uma FAQ de triagem específica para Docentes. Quando um Docente relata um problema de avaliação ou turmas, esse constrangimento afeta uma turma inteira de alunos, pelo que a sua resolução deve ter prioridade máxima.
* **Que dashboards de controlo poderiam ser desenvolvidos?**
  Ferramentas que permitam aos docentes validar *status* técnicos: ver se o aluno já concluiu o registo, se ativou a conta no email e se já submeteu a empresa com sucesso.

**Para os Assistentes de Helpdesk:**
* **A equipa de suporte necessita de permissões avançadas?**
  Sim, dotar os assistentes da capacidade de "Visualizar como Aluno" (função *Impersonate* ou *Read-Only View* do dashboard do utilizador) permitiria diagnosticar imediatamente em que ecrã o aluno se encontra, cortando as conversas difíceis pela metade.
* **Quais os cenários para Chatbot / Macros?**
  Se o utilizador envia "ativos minimos", o bot deve enviar a instrução automática. Se envia "senha", encaminha-o para a página de recuperação, servindo como primeira linha de defesa (Triagem Nível 1).
* **Há necessidade de formar os assistentes em áreas específicas?**
  Sim, notou-se que nas poucas conversas extensas sobre 'Contratos' ou 'Operações Sociais', a resolução foi mais morosa. Um guia de bolso rápido sobre mecânicas empresariais avançadas do simulador reduziria o tempo de resposta e evitaria escalamentos.

---

## 4. Recomendações Fundamentadas

Com base nas evidências quantitativas e qualitativas, as 4 ações de melhoria críticas são:

> [!TIP]
> **1. Correção de UX no fluxo de "Ativos Mínimos"**
> **Evidência:** 28 conversas geradas por falha no redirecionamento ou aviso confuso.
> **Recomendação:** Corrigir a navegação na plataforma para que o redirecionamento ou aviso de dependência seja automático e transparente para o aluno.

> [!IMPORTANT]
> **2. Automatização da Recuperação de Senhas (Self-Service)**
> **Evidência:** A enorme taxa de tickets relativos a credenciais exige intervenção humana repetitiva.
> **Recomendação:** Rever e garantir que o fluxo *Self-Service* ("Esqueci-me da palavra-passe") é à prova de erros e que os emails transacionais não ficam retidos como SPAM.

> [!NOTE]
> **3. Revisão do Processo de Convite de Sócios**
> **Evidência:** A mecânica dos convites e constituição geram dores agudas no registo de grupos (45 ocorrências).
> **Recomendação:** Adicionar validações proativas e alertas no ecrã de convite (ex: impedir o convite se o sócio já tiver aceitado outra sociedade).

> [!TIP]
> **4. Implementação de Chatbot (Triagem Nível 1) e Permissões**
> **Evidência:** A comunicação dos assistentes passa muito por copiar e colar os mesmos guias de resolução (23 e 27).
> **Recomendação:** Instalar um Chatbot de triagem nos canais de suporte que intercete dúvidas sobre palavras-passe e ativos mínimos. Conceder aos assistentes reais a visão *Impersonate* para lidarem unicamente com as dúvidas complexas.
