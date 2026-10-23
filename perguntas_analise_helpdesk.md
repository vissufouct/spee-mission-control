# Perguntas de Análise de Dados: SPEE Helpdesk

Com base na estrutura dos dados disponíveis na planilha `spee_helpdesk_chats_consolidado.xlsx` (que contém metadados de chats, durações, avaliações e as transcrições completas das mensagens), apresentamos abaixo as perguntas que podem ser respondidas para atingir os seus objetivos de análise.

*Nota: A distinção entre "Docentes" e "Alunos" nos dados precisará ser inferida através do contexto das mensagens (ex: utilizadores a relatar problemas com turmas vs. criação de empresa) ou por um cruzamento com uma base de dados externa de emails.*

---

## 1. Análise de Sentimento (Docentes, Assistentes e Alunos)

**Para os Alunos e Docentes (Visitantes):**
* Qual é o sentimento predominante (frustração, confusão, neutralidade) na primeira mensagem enviada pelos utilizadores?
* Como evolui o sentimento do utilizador ao longo da conversa? Há uma mudança de frustração para alívio/satisfação após a intervenção do assistente?
* Existe correlação direta entre o sentimento expresso nas últimas mensagens do utilizador e o `rating` (avaliação) deixado no fim do chat?
* As interações de Docentes tendem a apresentar um tom mais exigente ou urgente em comparação com as dos Alunos?

**Para os Assistentes de Helpdesk (ex: Shola, Evgueni):**
* Os assistentes conseguem manter um tom empático, paciente e profissional, mesmo em chats longos ou com utilizadores frustrados?
* Existe variação no sentimento das respostas entre os diferentes assistentes?
* Em conversas não resolvidas ou muito extensas, é possível detetar fadiga ou frustração na linguagem dos assistentes?

---

## 2. Identificação das Principais Dores (Pain Points)

**Alunos:**
* Quais são os bugs técnicos ou erros de sistema mais frequentemente reportados (ex: "Não consigo aceder à loja online - ativos mínimos", "Erro ao aceitar convite de sócio")?
* Em que fases do simulador os alunos ficam bloqueados de forma mais recorrente (ex: Registo inicial, constituição de empresa, contratos)?
* Qual é o tempo médio de espera e a duração total da interrupção (`duracao_chat_seg`) que um aluno sofre até ter o seu problema resolvido?

**Docentes:**
* Quais são as dificuldades operacionais que os docentes enfrentam ao gerir ou monitorizar os seus alunos na plataforma?
* Existem queixas recorrentes sobre falta de visibilidade, acesso a relatórios ou dificuldades na configuração das turmas?

**Assistentes de Helpdesk:**
* Quais são as tarefas mais manuais, repetitivas e de baixo valor que esgotam o tempo dos assistentes (ex: reposição de passwords, eliminação manual de empresas criadas por engano)?
* Que tipo de problemas geram as conversas mais longas (`message_count_real` elevado) e difíceis de diagnosticar?
* Existem queixas dos utilizadores relacionadas com a indisponibilidade do helpdesk em determinados horários ou dias?

---

## 3. Principais Necessidades de Apoio (Support Needs)

**Alunos:**
* Que funcionalidades do simulador necessitam urgentemente de melhores tutoriais, *tooltips* ou guias passo a passo dentro da plataforma (ex: como adicionar sócios corretamente)?
* A implementação de um sistema automático de "Recuperação de Password" (Self-Service) reduziria significativamente a necessidade de apoio?
* Quais são os picos de horário e dias da semana em que os alunos mais recorrem ao helpdesk, e como podemos reforçar o apoio nesses momentos?

**Docentes:**
* Existe necessidade de criar um canal de suporte prioritário (VIP) ou documentação/FAQ exclusiva para ajudar os docentes a gerir as suas turmas de forma autónoma?
* Que ferramentas administrativas (dashboards de controlo) poderiam ser desenvolvidas para dar aos docentes autonomia na resolução de pequenos bloqueios dos seus alunos?

**Assistentes de Helpdesk:**
* A equipa de suporte necessita de permissões administrativas mais avançadas na plataforma para resolver os bloqueios dos utilizadores sem depender da equipa de desenvolvimento?
* Quais os cenários ideais para a implementação de "Respostas Rápidas" (Macros) ou de um *Chatbot* de triagem, dado o elevado volume de questões padronizadas (ex: "Não consigo aceder a ativos mínimos")?
* Há necessidade de formar os assistentes em áreas específicas do simulador onde atualmente demoram mais tempo a fornecer uma solução?
