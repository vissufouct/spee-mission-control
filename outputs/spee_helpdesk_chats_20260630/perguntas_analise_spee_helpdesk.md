# Perguntas que os dados de helpdesk do SPEE podem responder

## Base analisada

Ficheiro usado: `spee_helpdesk_chats_consolidado.xlsx`

Folhas principais:

- `Resumo`: totais, período coberto e volume mensal.
- `Conversas`: uma linha por conversa, com metadados, visitante, domínio, duração, contagem de mensagens e transcrição completa.
- `Mensagens`: uma linha por mensagem, com remetente, texto original, data/hora, anexos e JSON da mensagem.
- `JSON Original`: cópia bruta do export por conversa, para auditoria qualitativa.

Escopo confirmado na folha:

- 576 conversas.
- 2.705 mensagens.
- Período: 2025-03-04 a 2026-06-26.
- 1.660 mensagens de visitantes (`sender_type = v`).
- 1.045 mensagens de assistentes (`sender_type = a`).
- 8 mensagens de avaliação (`message_type = rating`), insuficientes para medir satisfação de forma robusta.
- Assistentes identificáveis directamente por `sender_type = a` e `sender_name`.
- Docentes e Alunos não têm uma coluna própria; podem ser inferidos parcialmente por marcadores no nome/texto, como `[Docente]`, `docente`, `professor`, `aluno`, `estudante`, `turma`, `grupo`, `sócio`, `empresa`, mas a classificação deve ser validada.

## Variáveis que a base já permite usar

- Data da conversa e da mensagem.
- Domínio/plataforma de origem: `spee.simulacao.co.mz`, `sgc.simulacao.co.mz`, `planodenegocios.simulacao.co.mz`, `moodle.simulacao.co.mz`, `speedev.simulacao.co.mz`.
- Instituição ou prefixo do visitante, quando aparece em `visitante_nome`.
- Nome, e-mail e outros dados declarados pelo visitante.
- Tipo de remetente: visitante ou assistente de helpdesk.
- Nome do assistente, quando disponível.
- Texto integral da mensagem.
- Transcrição integral por conversa.
- Duração da conversa.
- Número de mensagens por conversa.
- Existência de anexos.
- Avaliação positiva/negativa quando existe `rating`, embora com baixa cobertura.

## Variáveis derivadas recomendadas

Para responder bem às perguntas pretendidas, recomenda-se acrescentar uma tabela de codificação ou novas colunas derivadas:

| Variável | Objectivo | Fonte provável |
|---|---|---|
| `grupo_actor` | Separar `Docente`, `Aluno`, `Assistente helpdesk`, `Outro/Indeterminado` | `sender_type`, `sender_name`, `visitante_nome`, texto da mensagem |
| `sentimento` | Classificar a polaridade como positivo, neutro, negativo ou misto | Texto original |
| `sentiment_score` | Medir intensidade do sentimento | Texto original |
| `emocao` | Identificar frustração, urgência, confusão, gratidão, satisfação, irritação | Texto original |
| `dor_principal` | Classificar o principal problema reportado | Primeira mensagem do visitante e transcrição |
| `necessidade_apoio` | Indicar o tipo de apoio necessário | Mensagens do visitante e resposta do assistente |
| `modulo_spee` | Relacionar a dor com área do simulador | Domínio, palavras-chave, texto |
| `estado_resolucao` | Indicar resolvido, não resolvido, encaminhado, sem evidência | Final da conversa, rating, resposta do assistente |
| `nivel_urgencia` | Separar pedidos críticos de dúvidas operacionais | Marcadores linguísticos e repetição |
| `confianca_classificacao` | Registar confiança da codificação | Regra usada ou validação humana |

## Perguntas sobre sentimento por grupo

### Perguntas gerais

- Qual é a distribuição de sentimento das mensagens de visitantes versus mensagens dos assistentes de helpdesk?
- O sentimento dos visitantes é mais negativo em que meses, domínios ou instituições?
- O sentimento melhora, piora ou mantém-se entre a primeira e a última mensagem da mesma conversa?
- Que proporção de conversas começa com frustração, confusão, urgência ou pedido simples de orientação?
- Quais são os temas que concentram maior negatividade?
- Quais são os temas em que os utilizadores expressam mais gratidão ou alívio?
- Há diferença de sentimento entre conversas curtas e conversas longas?
- Conversas com mais mensagens têm sentimento mais negativo ou apenas reflectem maior complexidade?
- A presença de anexos está associada a maior frustração ou a problemas mais difíceis de explicar?
- O sentimento varia conforme o domínio usado: SPEE, SGC, Plano de Negócios, Moodle ou ambiente de desenvolvimento?

### Docentes

- Que sentimentos predominam nas mensagens classificadas como Docente: frustração, dúvida, urgência, satisfação ou preocupação pedagógica?
- Os Docentes exprimem mais problemas administrativos, dificuldades de acompanhamento dos alunos ou dúvidas de configuração?
- O sentimento dos Docentes piora quando a questão envolve turmas, empresas criadas por estudantes, edição de dados ou gestão de actividades?
- Em que momentos do calendário os Docentes demonstram maior pressão ou urgência?
- Que temas geram maior necessidade de escalamento ou resposta especializada para Docentes?

### Alunos

- Que sentimentos predominam nas mensagens classificadas como Aluno: ansiedade, frustração, confusão, pedido de orientação, satisfação após resposta?
- Os Alunos mostram mais negatividade em problemas de acesso, cadastro, sócios/convites, plano de negócio, activos mínimos, contratos ou pagamentos?
- Os Alunos conseguem explicar o problema claramente na primeira mensagem ou precisam de várias trocas para clarificação?
- Que frases ou padrões linguísticos indicam maior dificuldade de autonomia, como “não consigo”, “não aparece”, “onde entro”, “como faço”?
- O sentimento dos Alunos melhora depois de receber instruções passo a passo?

### Assistentes de helpdesk

- O tom dos assistentes é predominantemente neutro, orientador, empático ou correctivo?
- Que assistentes aparecem mais em conversas com sentimento negativo inicial?
- Há diferenças de estilo entre assistentes: pedido de evidências, perguntas de diagnóstico, instrução directa, encaminhamento?
- As respostas dos assistentes reduzem a negatividade dos utilizadores ao longo da conversa?
- Quais são os pedidos repetidos pelos assistentes que indicam falhas de informação inicial, por exemplo pedido de e-mail, print, nome, turma ou dados da empresa?

## Perguntas sobre principais dores por grupo

### Perguntas transversais

- Quais são as dores mais frequentes em todo o helpdesk?
- Quais dores são recorrentes por mês, instituição, domínio ou módulo do simulador?
- Que dores aparecem como incidentes técnicos e quais são apenas dúvidas de utilização?
- Que dores parecem resultar de regras do simulador pouco claras?
- Que dores indicam falhas de interface, mensagens de erro insuficientes ou ausência de orientação no próprio sistema?
- Quais dores exigem intervenção manual do helpdesk?
- Quais dores poderiam ser resolvidas por auto-atendimento?
- Quais dores estão associadas a maior duração de conversa?
- Quais dores exigem mais mensagens para chegar ao diagnóstico?
- Que dores aparecem repetidas pelos mesmos visitantes ou instituições?

### Dores prováveis de Alunos

Os dados permitem investigar, mediante classificação, dores como:

- Acesso, login, senha, código e recuperação de conta.
- Cadastro ou registo incompleto.
- Nome do estudante, sócio ou empresa que não aparece no sistema.
- Dificuldade em aceitar ou enviar convites de sócios.
- Criação, alteração ou eliminação de empresa.
- Preenchimento do plano de negócio ou pitch.
- Compra de activos mínimos, lojas online e operações simuladas.
- Contratos, arrendamento, licenças, alvarás e passos operacionais.
- Pagamentos, facturas, taxas ou valores.
- Erros de sistema sem explicação clara.
- Dúvidas sobre sequência de passos: “onde entro”, “como faço”, “qual é o próximo passo”.

Perguntas específicas:

- Quais são as três dores mais frequentes dos Alunos?
- Que dores dos Alunos estão mais associadas a sentimento negativo?
- Que dores dos Alunos aparecem no início de cada ciclo lectivo ou período de actividade no simulador?
- Que problemas dos Alunos dependem de acção de colegas ou sócios?
- Que dúvidas dos Alunos revelam necessidade de tutoria antes do uso do simulador?
- Que problemas dos Alunos são provavelmente erros técnicos e quais são dificuldades de navegação?

### Dores prováveis de Docentes

Os dados permitem investigar, mediante classificação, dores como:

- Configuração de turmas, instituições, ciclos ou semestres.
- Gestão de estudantes e grupos.
- Acompanhamento de empresas criadas pelos estudantes.
- Correcção de dados submetidos pelos alunos.
- Edição, eliminação ou validação de empresas.
- Dúvidas sobre prazos, orientações de actividade e regras pedagógicas.
- Necessidade de desbloquear operações para estudantes.
- Dificuldades em compreender o que o aluno fez no sistema.

Perguntas específicas:

- Que dores dos Docentes são administrativas, pedagógicas ou técnicas?
- Que problemas de Docentes afectam vários Alunos ao mesmo tempo?
- Em que temas os Docentes precisam de mais autonomia no painel de gestão?
- Que pedidos de Docentes exigem intervenção da equipa técnica?
- Que dores dos Docentes indicam falta de relatórios, visibilidade ou controlo sobre as turmas?
- Que dores dos Docentes geram mais recorrência ao longo do semestre?

### Dores prováveis dos Assistentes de helpdesk

As dores dos assistentes podem ser inferidas pelo esforço de atendimento, não apenas pelo sentimento:

- Mensagens iniciais incompletas dos visitantes.
- Necessidade repetida de pedir e-mail, nome, turma, instituição, print ou dados da empresa.
- Diagnóstico difícil por falta de contexto.
- Pedidos recorrentes sobre o mesmo tema.
- Necessidade de resetar senha ou verificar dados manualmente.
- Conversas longas com múltiplas tentativas.
- Falta de scripts de resposta ou procedimentos padronizados para alguns casos.

Perguntas específicas:

- Quais temas consomem mais tempo dos assistentes?
- Que tipos de pedidos exigem mais perguntas de clarificação?
- Que problemas aparecem como repetitivos e poderiam ter resposta padronizada?
- Que pedidos exigem acesso administrativo ou técnico que só o helpdesk possui?
- Que temas têm maior probabilidade de escalamento?
- Que lacunas de informação nos pedidos iniciais atrasam o diagnóstico?
- Que diferenças existem entre assistentes quanto ao modo de orientar, pedir evidência e resolver?

## Perguntas sobre necessidades de apoio por grupo

### Necessidades dos Alunos

- Que tipo de guia os Alunos mais precisam: acesso, criação de empresa, sócios, plano de negócio, operações, pagamentos ou contratos?
- Que passos devem ser transformados em tutoriais curtos?
- Que mensagens de erro deveriam ser reescritas para orientar melhor o utilizador?
- Que funcionalidades precisam de validações visíveis antes de o Aluno submeter dados?
- Que dúvidas deveriam aparecer numa FAQ contextual dentro do SPEE?
- Que fluxos precisam de ajuda passo a passo no ecrã?
- Que problemas indicam necessidade de formação inicial antes do uso do simulador?

### Necessidades dos Docentes

- Que funcionalidades de gestão de turma, estudantes e empresas são mais solicitadas pelos Docentes?
- Que relatórios ou painéis ajudariam o Docente a acompanhar dificuldades recorrentes dos Alunos?
- Que permissões administrativas reduziriam dependência do helpdesk?
- Que informação o Docente precisa para diagnosticar problemas antes de contactar o suporte?
- Que materiais de orientação devem ser fornecidos ao Docente antes do início do semestre?
- Que alertas ou validações seriam úteis para evitar problemas em massa numa turma?

### Necessidades dos Assistentes de helpdesk

- Que base de conhecimento interna deve ser criada a partir dos temas mais recorrentes?
- Que respostas-modelo podem reduzir tempo de atendimento sem perder qualidade?
- Que campos obrigatórios deveriam ser recolhidos no formulário inicial de contacto?
- Que checklist de diagnóstico deve ser usada para acesso, cadastro, sócios, empresa, plano de negócio e pagamentos?
- Que pedidos deveriam ser encaminhados automaticamente para equipa técnica?
- Que indicadores devem monitorizar carga de trabalho, tempo de resposta, complexidade e resolução?

## Perguntas sobre qualidade do serviço de helpdesk

- Qual é o tempo médio entre a primeira mensagem do visitante e a primeira resposta do assistente?
- Que percentagem de conversas recebe resposta do helpdesk?
- Que conversas não têm resposta de assistente?
- Quantas mensagens são necessárias, em média, para chegar a uma resposta útil?
- Que temas têm conversas mais longas?
- Que assistentes atendem maior volume de mensagens?
- Há períodos de pico em que o tempo de resposta aumenta?
- As conversas com avaliação positiva diferem das conversas com avaliação negativa?
- O rating disponível confirma ou contradiz o sentimento inferido no texto?
- Que padrões de resposta estão associados a resolução aparente?

## Perguntas sobre produto e melhoria do SPEE

- Que módulos do SPEE geram mais pedidos de apoio?
- Que fluxos de utilização são menos compreendidos pelos utilizadores?
- Que erros de sistema parecem mais frequentes?
- Que termos usados pelos utilizadores não coincidem com a linguagem da plataforma?
- Que problemas poderiam ser reduzidos com mensagens de erro mais claras?
- Que passos deveriam ter validações preventivas?
- Que funcionalidades exigem redesenho por gerarem dúvidas repetidas?
- Que instituições ou turmas apresentam dificuldades concentradas e podem necessitar de formação adicional?
- Que problemas são sazonais e devem ser antecipados antes de cada ciclo de simulação?

## Perguntas que os dados não respondem bem sem enriquecimento

- Não é possível separar todos os visitantes em Docente e Aluno com total confiança sem uma coluna explícita de perfil ou uma validação manual.
- Não é possível medir satisfação geral apenas com `rating`, porque existem apenas 8 avaliações.
- Não é possível garantir resolução real de todos os casos sem uma coluna de estado final ou confirmação do utilizador.
- Não é possível medir qualidade pedagógica do simulador apenas pelos chats; os chats mostram dificuldades reportadas, não todos os utilizadores sem problemas.
- Não é possível distinguir erro técnico de erro de utilização em todos os casos sem leitura qualitativa ou validação técnica.
- Não é recomendável publicar exemplos textuais sem anonimização, porque há nomes, e-mails, telefones, senhas e outros dados pessoais nos chats.

## Estratégia analítica recomendada

1. Criar uma amostra inicial estratificada por mês, domínio e remetente.
2. Definir um livro de códigos com categorias de grupo, sentimento, emoção, dor e necessidade de apoio.
3. Codificar manualmente uma amostra de conversas para calibrar as categorias.
4. Aplicar classificação assistida ao restante conjunto, mantendo uma coluna de confiança.
5. Separar análise por unidade:
   - mensagem, para sentimento e tom;
   - conversa, para dor principal, necessidade e resolução;
   - visitante/instituição, para recorrência;
   - assistente, para carga e estilo de atendimento.
6. Validar resultados com leitura qualitativa de exemplos anonimizados.
7. Produzir outputs separados para:
   - experiência de Alunos;
   - necessidades dos Docentes;
   - operação do helpdesk;
   - melhorias do produto SPEE.

## Perguntas prioritárias para a primeira análise

1. Quais são as principais dores dos visitantes no SPEE e como variam ao longo do tempo?
2. Que dores são mais prováveis em Alunos e quais são mais prováveis em Docentes?
3. Que temas geram sentimento mais negativo nos visitantes?
4. O sentimento dos visitantes melhora depois da intervenção do helpdesk?
5. Que problemas consomem mais esforço dos assistentes?
6. Que necessidades de apoio podem ser convertidas em FAQ, tutorial, validação no sistema ou resposta-modelo?
7. Que falhas de informação no pedido inicial atrasam a resolução?
8. Que módulos do simulador devem ser priorizados para melhoria de usabilidade?
9. Que indicadores operacionais devem passar a ser monitorizados pelo helpdesk?
10. Que dados adicionais devem ser recolhidos para distinguir de forma robusta Docentes, Alunos e outros perfis?
