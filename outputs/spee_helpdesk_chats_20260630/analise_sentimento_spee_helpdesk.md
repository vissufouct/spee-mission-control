# Análise de sentimento e dores do helpdesk SPEE

## Executive Summary

- **A maior dor visível é operacional, não apenas emocional.** Entre 576 conversas e 2.705 mensagens, os temas mais recorrentes são registo/cadastro/dados, acesso/conta/senha, erro técnico ou bloqueio, orientação de navegação e sócios/convites/empresa. Estes temas aparecem em 20% a 23% das conversas cada um, depois de limpos os rótulos do formulário.
- **Os Alunos classificados mostram a maior carga negativa.** Nas 89 conversas classificadas como Alunos, 43,8% foram negativas e 23,6% mistas. As dores dominantes são sócios/convites/empresa (74,2%), registo/dados (48,3%), acesso/senha (37,1%), orientação (37,1%) e erro/bloqueio (36,0%).
- **Os Docentes aparecem pouco, mas com dores claras de gestão pedagógica.** Foram identificadas 21 conversas de Docentes com confiança alta; 71,4% envolvem turmas e gestão pedagógica, 47,6% registo/dados e 42,9% sócios/convites/empresa. O sentimento é menos negativo que nos Alunos, mas mais ligado a controlo, visibilidade e capacidade de intervenção.
- **O helpdesk responde rapidamente quando entra na conversa, mas muitas conversas não têm resposta no export.** 326 de 576 conversas têm resposta de assistente (56,6%). Onde há resposta, a mediana da primeira resposta é 1,34 minutos e o percentil 75 é 3,15 minutos. O problema é cobertura e triagem, não apenas velocidade.
- **As recomendações prioritárias são: recolher o perfil do utilizador no formulário, criar fluxos guiados para os cinco temas principais, reforçar autonomia dos Docentes, padronizar respostas do helpdesk e impedir partilha de senhas/códigos sensíveis em chat.**

## Fonte e escopo

Fonte analisada: `spee_helpdesk_chats_consolidado.xlsx`

Folhas usadas:

- `Conversas`: uma linha por conversa, com metadados e transcrição completa.
- `Mensagens`: uma linha por mensagem, com remetente, texto original e JSON.
- `JSON Original`: usado como reserva de auditoria, sem necessidade de alterar o conteúdo.

Período coberto: 2025-03-04 a 2026-06-26.

Volume:

| Métrica | Valor |
|---|---:|
| Conversas | 576 |
| Mensagens | 2.705 |
| Mensagens de visitantes | 1.660 |
| Mensagens de assistentes | 1.045 |
| Mensagens de visitantes com texto | 1.601 |
| Mensagens de assistentes com texto | 1.032 |
| Conversas com resposta de assistente | 326 |
| Conversas sem resposta de assistente no export | 250 |
| Cobertura de resposta | 56,6% |
| Mediana da primeira resposta, quando há resposta | 1,34 min |
| P75 da primeira resposta, quando há resposta | 3,15 min |
| Mediana de mensagens por conversa | 2 |
| Mediana de duração por conversa | 1,81 min |

## Metodologia

**Unidade de análise.** A análise usa a conversa para dores, necessidade de apoio e resolução aparente; usa a mensagem para tom e sentimento.

**Limpeza do texto.** Antes de classificar sentimento e temas, removi rótulos estruturais como `Nome`, `Telefone`, `E-mail` e `Descrição do Problema`, para evitar que palavras do formulário inflacionassem categorias como “problema” ou “e-mail”.

**Classificação dos grupos.**

- `Assistentes helpdesk`: classificação directa por `sender_type = a` e `sender_name`.
- `Docentes`: conversas com marcador explícito, como `[Docente]`, “sou docente”, “professor”, “formador”, “minha turma”, “minhas turmas” ou equivalente.
- `Alunos`: conversas com marcador explícito de aluno/estudante ou com forte contexto de actividade estudantil, como sócios, convites, empresa simulada, plano de negócio, pitch, activos mínimos ou cadastro de escola.
- `Visitantes indeterminados`: conversas sem evidência suficiente para distinguir Docente/Aluno.

Esta classificação é conservadora: identifica com confiança os casos explícitos, mas deixa 466 conversas como indeterminadas. Isto evita forçar conclusões sobre perfis que a planilha não traz como campo nativo.

**Classificação de sentimento.** Usei uma abordagem léxica em português, com marcadores negativos (“não consigo”, “não aparece”, “erro”, “não aceita”, “dificuldade”), positivos (“obrigado”, “consegui”, “resolvido”, “deu certo”) e mistos. Esta classificação é suficiente para triagem e priorização, mas deve ser validada manualmente numa amostra antes de publicação formal.

**Privacidade.** Os excertos abaixo foram anonimizados. Nomes, e-mails, telefones, códigos e potenciais senhas foram omitidos.

## Cobertura por grupo

| Grupo | Conversas | Mensagens analisadas | Confiança da classificação |
|---|---:|---:|---|
| Docentes | 21 | 112 | Alta, por marcador explícito |
| Alunos | 89 | 393 | 2 alta, 87 média |
| Assistentes helpdesk | 326 conversas com intervenção | 1.032 | Directa por `sender_type = a` |
| Visitantes indeterminados | 466 | 1.096 | Baixa, sem marcador suficiente |

**Interpretação.** O grupo “indeterminado” é grande demais para desaparecer da análise. As conclusões por Docente/Aluno são úteis, mas devem ser lidas como recortes classificados, não como a distribuição real completa de perfis.

## Sentimento por grupo

### Visão estatística

| Grupo | Negativo | Misto | Neutro | Positivo | Leitura |
|---|---:|---:|---:|---:|---|
| Docentes, por conversa | 28,6% | 19,0% | 38,1% | 14,3% | Predomina tom funcional, com frustração em gestão de turmas/dados |
| Alunos, por conversa | 43,8% | 23,6% | 22,5% | 10,1% | Maior carga negativa e maior complexidade operacional |
| Visitantes indeterminados, por conversa | 26,4% | 3,9% | 60,7% | 9,0% | Muitos pedidos curtos e pouco contextualizados |
| Assistentes, por mensagem | 15,0% | 0,0% | 82,5% | 2,5% | Tom maioritariamente neutro/diagnóstico |

### Docentes

**O sentimento dos Docentes é menos negativo que o dos Alunos, mas revela dependência operacional do helpdesk para gerir turmas, empresas e dados.** Das 21 conversas classificadas como Docentes, 28,6% são negativas e 19,0% mistas. A dor mais frequente é turmas e gestão pedagógica (71,4% das conversas de Docentes), seguida de registo/dados (47,6%) e sócios/convites/empresa (42,9%).

Excertos anonimizados:

> “Sou docente de simulação empresarial e gostava de saber como posso editar o nome de uma empresa criada.”

> “Já não consigo criar novas turmas, pois o campo correspondente parece não estar mais disponível.”

> Assistente: “Desculpe-nos pela demora, peço que aguarde um momento, que iremos verificar o problema.”

**Leitura.** O problema do Docente não é apenas “como usar”. É falta de autonomia administrativa: criar/editar turmas, corrigir empresas, acompanhar estudantes e intervir quando os alunos ficam bloqueados.

### Alunos

**Os Alunos classificados concentram a maior frustração.** Das 89 conversas classificadas como Alunos, 43,8% são negativas e 23,6% mistas. A mediana é de 5 mensagens por conversa e 10,4 minutos de duração, superior à mediana geral de 2 mensagens e 1,81 minutos. Isto indica que os casos de Alunos são mais conversacionais e exigem mais diagnóstico.

Dores mais frequentes nos Alunos:

| Dor | Conversas de Alunos | % das conversas de Alunos |
|---|---:|---:|
| Sócios, convites e empresa | 66 | 74,2% |
| Registo, cadastro e dados | 43 | 48,3% |
| Acesso, conta e senha | 33 | 37,1% |
| Orientação de navegação | 33 | 37,1% |
| Erro técnico ou bloqueio | 32 | 36,0% |
| Operações simuladas | 21 | 23,6% |
| Plano de negócio e pitch | 19 | 21,3% |

Excertos anonimizados:

> “Quando colocamos os dados dos empreendedores não aparecem, mesmo depois de termos concluído e cadastrado o empreendedor, os dados não são reconhecidos.”

> “Não consigo encontrar a opção onde preencho o pitch.”

> “Não aparece o nome no cadastro.”

> “Não consigo entrar nos activos mínimos.”

**Leitura.** As dores dos Alunos cruzam três dimensões: bloqueio técnico, incerteza de percurso e dependência de terceiros no fluxo de sócios/convites. A negatividade sobe quando o aluno já fez uma acção e o sistema não reflecte o resultado esperado.

### Assistentes de helpdesk

**O tom dos assistentes é maioritariamente neutro e orientado para diagnóstico.** Em 1.032 mensagens com texto, 82,5% são neutras, 15,0% negativas e 2,5% positivas. A negatividade do assistente é quase sempre linguagem operacional (“problema”, “não consegue”, “erro”) ou pedido de verificação, não hostilidade.

Volume por assistente:

| Assistente | Mensagens | % das mensagens de assistentes |
|---|---:|---:|
| Assistente A | 434 | 41,5% |
| Assistente B | 272 | 26,0% |
| Assistente C | 191 | 18,3% |
| Assistente D | 90 | 8,6% |
| Assistente E | 29 | 2,8% |
| Assistente F | 25 | 2,4% |

Excertos anonimizados:

> “Qual é o problema que enfrenta?”

> “Não percebi a questão.”

> “Pode mandar print?”

> “Peço que aguarde um momento, estamos a verificar.”

**Leitura.** A dor do helpdesk é informação inicial incompleta. Muitos atendimentos começam por pedir clarificação, evidência, e-mail, dados da empresa ou print. Isto consome tempo e poderia ser reduzido com um formulário de contacto mais estruturado.

## Principais dores transversais

| Dor / tema | Conversas | % do total | % negativas | Mediana de mensagens | Mediana de duração |
|---|---:|---:|---:|---:|---:|
| Registo, cadastro e dados | 132 | 22,9% | 48,5% | 6 | 9,01 min |
| Acesso, conta e senha | 122 | 21,2% | 41,0% | 5 | 8,50 min |
| Erro técnico ou bloqueio | 119 | 20,7% | 66,4% | 6 | 9,35 min |
| Orientação de navegação | 118 | 20,5% | 33,9% | 5 | 8,13 min |
| Sócios, convites e empresa | 115 | 20,0% | 37,4% | 5 | 8,40 min |
| Operações simuladas | 55 | 9,5% | 47,3% | 4 | 5,58 min |
| Turmas e gestão pedagógica | 34 | 5,9% | 41,2% | 4 | 7,16 min |
| Pagamentos e facturação | 31 | 5,4% | 48,4% | 3 | 4,68 min |
| Plano de negócio e pitch | 31 | 5,4% | 29,0% | 7 | 13,62 min |
| Evidência/diagnóstico pedido | 22 | 3,8% | 40,9% | 9,5 | 17,99 min |

**A dor mais negativa é “erro técnico ou bloqueio”.** Embora não seja a categoria com maior volume, tem 66,4% de conversas negativas. Este tema deve ser priorizado para melhoria de mensagens de erro, logs e escalamento.

**“Plano de negócio e pitch” tem baixa negatividade relativa, mas alta duração.** Só 29,0% são negativas, mas a mediana é de 7 mensagens e 13,62 minutos, indicando necessidade de orientação passo a passo.

**“Evidência/diagnóstico pedido” tem poucas conversas, mas é a mais longa.** A mediana de 9,5 mensagens e 17,99 minutos indica que quando o helpdesk precisa pedir print/dados/verificação, a conversa fica materialmente mais pesada.

## Respostas às perguntas sobre sentimento por grupo

### Perguntas gerais

| Pergunta | Resposta fundamentada |
|---|---|
| Qual é a distribuição de sentimento das mensagens de visitantes versus assistentes? | Visitantes classificados como Alunos têm 43,8% de conversas negativas; Docentes 28,6%; visitantes indeterminados 26,4%. Assistentes têm 82,5% das mensagens em tom neutro. |
| O sentimento dos visitantes é mais negativo em que meses, domínios ou instituições? | Por mês, 2025-11 tem 64,7% de negativas, mas com apenas 17 conversas; 2026-04 é mais relevante em escala, com 93 conversas e 41,9% negativas. Por domínio, `sgc.simulacao.co.mz` tem 45,8% negativas, mas só 48 conversas; `spee.simulacao.co.mz` concentra 85,9% do volume e 27,9% negativas. A planilha não permite análise robusta por instituição sem normalizar nomes/prefixos. |
| O sentimento melhora entre a primeira e a última mensagem? | Sim, nas conversas com pelo menos duas mensagens do visitante: Alunos melhoram em 82,8% dos casos comparáveis, Docentes em 73,3% e indeterminados em 89,3%. Esta métrica é indicativa, pois a última mensagem pode ser “ok”, “sim” ou “obrigado”, sem confirmação formal de resolução. |
| Que proporção começa com frustração, confusão, urgência ou orientação? | A frustração aparece sobretudo como “não consigo”, “não aparece”, “não aceita”, “erro” e “dificuldade”. A categoria “orientação de navegação” aparece em 118 conversas (20,5%), e “erro técnico ou bloqueio” em 119 (20,7%). |
| Quais temas concentram maior negatividade? | Erro técnico/bloqueio é o mais negativo: 66,4% das 119 conversas. Depois aparecem registo/dados (48,5%), pagamentos/facturação (48,4%) e operações simuladas (47,3%). |
| Onde há gratidão ou alívio? | O sinal positivo é baixo: 54 conversas positivas no total (9,4%) e 110 mensagens positivas. Geralmente aparece no fim da conversa como agradecimento ou confirmação breve. |
| Conversas curtas e longas diferem em sentimento? | Sim. Temas que exigem diagnóstico têm mais mensagens e duração maior: evidência/diagnóstico tem mediana de 9,5 mensagens e 17,99 minutos; plano de negócio/pitch tem 7 mensagens e 13,62 minutos. |
| A presença de anexos está associada a problemas difíceis? | A categoria “evidência/diagnóstico pedido” é proxy parcial: 22 conversas, 81,8% com resposta, mediana de 9,5 mensagens e 17,99 minutos. Indica maior complexidade, embora seja necessário analisar anexos directamente para confirmar. |
| O sentimento varia por domínio? | Sim, mas com amostras desiguais. `spee.simulacao.co.mz` domina o volume (495 conversas, 27,9% negativas). `sgc.simulacao.co.mz` tem 48 conversas e 45,8% negativas. `planodenegocios.simulacao.co.mz` tem 30 conversas e 26,7% negativas. |
| O rating confirma a satisfação? | Não de forma robusta. Só existem 8 ratings: 5 positivos e 3 negativos. É insuficiente para medir satisfação geral. |

### Docentes

| Pergunta | Resposta fundamentada |
|---|---|
| Que sentimentos predominam? | Predomina tom neutro/funcional (38,1%), mas há 28,6% negativas e 19,0% mistas. O desconforto surge quando o Docente perde capacidade de gerir turmas, empresas ou dados. |
| Os Docentes exprimem mais problemas administrativos, acompanhamento ou configuração? | Sim. 71,4% das conversas de Docentes envolvem turmas/gestão pedagógica; 47,6% registo/dados; 42,9% sócios/convites/empresa. |
| O sentimento piora em temas de turmas/empresas? | A evidência qualitativa aponta que sim: os excertos docentes com criação de turmas e edição de empresas são mistas/negativas. A amostra de Docentes é pequena (21), por isso a conclusão é direccional. |
| Em que momentos há maior pressão? | Não há volume docente suficiente para sazonalidade robusta. No total geral, os picos relevantes são 2026-04 (93 conversas) e 2026-05 (86). |
| Que temas precisam de resposta especializada? | Gestão de turmas, edição/eliminação de empresas, correcção de dados e problemas que afectam vários estudantes. |

### Alunos

| Pergunta | Resposta fundamentada |
|---|---|
| Que sentimentos predominam? | Predomina negativo/misto: 43,8% negativas e 23,6% mistas. Os Alunos são o grupo classificado com maior frustração. |
| Em que problemas há maior negatividade? | Sócios/convites/empresa é o maior volume (74,2% dos Alunos); erro/bloqueio, registo/dados e acesso/senha são os principais gatilhos de negatividade. |
| Os Alunos explicam bem na primeira mensagem? | Frequentemente não. A mediana de 5 mensagens por conversa e pedidos recorrentes de clarificação indicam que a primeira mensagem muitas vezes é incompleta. |
| Que frases indicam dificuldade de autonomia? | “Não consigo”, “não aparece”, “onde entro”, “como faço”, “não aceita”, “não reconhece os dados”. |
| O sentimento melhora depois de instruções? | Em 82,8% das conversas de Alunos com duas ou mais mensagens de visitante, a pontuação final é melhor que a inicial. Isto sugere que a intervenção ajuda, mas não substitui medição formal de resolução. |

### Assistentes de helpdesk

| Pergunta | Resposta fundamentada |
|---|---|
| O tom é neutro, orientador, empático ou correctivo? | Predomina neutro/diagnóstico: 82,5% das mensagens são neutras. O estilo é pedir contexto, orientar passos e verificar. |
| Que assistentes aparecem mais? | Assistente A tem 434 mensagens (41,5%), Assistente B 272 (26,0%), Assistente C 191 (18,3%) e Assistente D 90 (8,6%). |
| Há diferenças de estilo? | Há diferenças de carga e temas atendidos, mas a planilha não permite avaliar qualidade individual sem codificação qualitativa mais fina. |
| As respostas reduzem negatividade? | Indicativamente sim: Alunos e Docentes melhoram no fim da conversa em 82,8% e 73,3% dos casos comparáveis. |
| Que pedidos repetidos indicam falhas de informação inicial? | Pedidos de print, e-mail, dados da empresa, confirmação do problema, nome/turma e espera para verificação. |

## Respostas às perguntas sobre principais dores

### Dores transversais

| Pergunta | Resposta fundamentada |
|---|---|
| Quais são as dores mais frequentes? | Registo/dados (132), acesso/senha (122), erro/bloqueio (119), orientação (118) e sócios/empresa (115). |
| Que dores são recorrentes por mês, instituição, domínio ou módulo? | A recorrência mensal existe, com picos em 2026-04 e 2026-05. Por domínio, SPEE concentra 85,9% do volume. Por instituição, é necessário normalizar `visitante_nome`. |
| Quais são técnicas e quais são dúvidas de uso? | Erro/bloqueio, acesso/senha e dados que não aparecem tendem a ser técnicos ou de integração. Orientação, pitch e contratos tendem a ser dúvidas de uso/processo. |
| Quais resultam de regras pouco claras? | Sócios/convites, plano de negócio/pitch, contratos, operações simuladas e pagamentos parecem depender de regras de processo não óbvias. |
| Quais indicam falha de interface/mensagem de erro? | “Não aparece”, “não aceita”, “não consigo entrar”, “dados não são reconhecidos” e erros técnicos explícitos. |
| Quais exigem intervenção manual? | Reset/validação de conta, correcção de dados, eliminação/edição de empresas, verificação de cadastro, desbloqueio de fluxos. |
| Quais poderiam ser auto-atendimento? | Acesso/senha, localização do pitch/plano, criação de contratos, passos de convite de sócio, FAQ de pagamentos e activos mínimos. |
| Quais têm maior duração? | Evidência/diagnóstico pedido (17,99 min), plano de negócio/pitch (13,62 min), erro/bloqueio (9,35 min), registo/dados (9,01 min). |
| Quais exigem mais mensagens? | Evidência/diagnóstico pedido (9,5 mensagens), plano de negócio/pitch (7), erro/bloqueio e registo/dados (6). |
| Que dores se repetem nos mesmos visitantes/instituições? | Há indícios de repetição por instituições como ISCIM, Politécnica, ISG, ISCAM e UNILURIO, mas é preciso normalizar nomes e e-mails antes de contar recorrência sem duplicações. |

### Dores dos Alunos

| Pergunta | Resposta fundamentada |
|---|---|
| Quais são as três dores mais frequentes dos Alunos? | Sócios/convites/empresa (74,2%), registo/dados (48,3%), acesso/senha e orientação (37,1% cada). |
| Quais estão mais associadas a sentimento negativo? | Erro/bloqueio, registo/dados, acesso/senha e operações simuladas. |
| Quais aparecem no início de ciclos lectivos? | Os picos gerais em Março/Abril de 2025 e Março/Maio de 2026 sugerem pressão de ciclo. É preciso cruzar com calendário académico para confirmar. |
| Que problemas dependem de colegas/sócios? | Convites, aceitação de sócios, empresa criada por grupo, dados de empreendedor e alteração/eliminação de empresa. |
| Que dúvidas indicam necessidade de tutoria? | “Onde entro”, “como faço”, “como localizar”, “onde preencho o pitch”, contratos, activos mínimos e pagamentos. |
| Que problemas são técnicos versus navegação? | Dados que não aparecem e erros explícitos são mais técnicos; localização de opções, pitch e contratos são mais navegação/processo. |

### Dores dos Docentes

| Pergunta | Resposta fundamentada |
|---|---|
| Que dores são administrativas, pedagógicas ou técnicas? | Administrativas: turmas, estudantes, dados, empresas. Pedagógicas: acompanhamento e orientação de grupos. Técnicas: campos indisponíveis, erros e limitações de edição. |
| Que problemas afectam vários Alunos? | Criação/gestão de turmas, edição de empresas, dados de estudantes e bloqueios em fluxos comuns. |
| Onde precisam de mais autonomia? | Criar/editar turmas, corrigir empresas, visualizar estado dos estudantes, desbloquear ou orientar fluxos sem depender do helpdesk. |
| Que pedidos exigem equipa técnica? | Campo indisponível, erros de sistema, dados não sincronizados, permissões ou correcções em base de dados. |
| Que dores indicam falta de relatórios/visibilidade? | Pedidos sobre alunos, turmas e empresas sugerem que o Docente não tem visibilidade completa do progresso ou estado do estudante. |
| Que dores recorrem ao longo do semestre? | Turmas/gestão pedagógica, registo/dados e empresas/sócios. A amostra docente é pequena; recomenda-se acompanhamento dedicado. |

### Dores dos Assistentes de helpdesk

| Pergunta | Resposta fundamentada |
|---|---|
| Quais temas consomem mais tempo? | Evidência/diagnóstico pedido, plano de negócio/pitch, erro/bloqueio, registo/dados e acesso/senha. |
| Que pedidos exigem mais clarificação? | Mensagens sem perfil, sem turma, sem empresa, sem e-mail correcto, sem print ou sem descrição clara do passo. |
| Que problemas deveriam ter resposta padronizada? | Reset/acesso, pitch/plano, sócios/convites, empresa/dados, contratos, activos mínimos e pagamentos. |
| Que pedidos exigem acesso administrativo? | Eliminar/editar empresa, corrigir dados, verificar conta, desbloquear utilizador, validar cadastro. |
| Que temas têm maior probabilidade de escalamento? | Erro técnico/bloqueio, dados não reconhecidos, campos ausentes, pagamentos/facturação e sincronização de cadastros. |
| Que lacunas atrasam diagnóstico? | Ausência de perfil, instituição, turma, nome da empresa, ecrã onde ocorre o erro e evidência visual. |
| Há diferenças entre assistentes? | Há diferenças de volume: os três assistentes com maior carga concentram 85,8% das mensagens. Para avaliar qualidade, é necessária codificação de resolução por conversa. |

## Respostas às perguntas sobre necessidades de apoio

### Alunos

| Pergunta | Resposta fundamentada |
|---|---|
| Que guias precisam? | Guias de acesso/senha, sócios/convites, criação/edição de empresa, plano de negócio/pitch, operações simuladas e pagamentos. |
| Que passos devem virar tutoriais? | Aceitar convite de sócio, preencher pitch, localizar plano de negócio, comprar activos mínimos, criar contratos e resolver senha. |
| Que mensagens de erro devem ser reescritas? | “Não aparece”, “não aceita”, “dados não reconhecidos”, erro de sistema e bloqueios de acesso. |
| Que validações devem aparecer antes da submissão? | Validação de dados de empreendedor, sócio, e-mail, empresa, capital, contrato e pagamento. |
| Que FAQ contextual é necessária? | FAQ por módulo: acesso, empresa/sócios, plano, activos, contratos, pagamentos. |
| Que fluxos precisam de ajuda no ecrã? | Sócios/convites, pitch/plano, activos mínimos, contratos e facturação. |
| Que formação inicial é necessária? | Sequência do simulador, responsabilidades de cada sócio, regras de empresa, prazos e onde pedir ajuda. |

### Docentes

| Pergunta | Resposta fundamentada |
|---|---|
| Que funcionalidades de gestão são mais solicitadas? | Turmas, estudantes, empresas e correcção de dados. |
| Que painéis ajudariam? | Painel por turma com estado de acesso, empresa, sócios, plano, operações e pendências. |
| Que permissões reduziriam dependência? | Editar/corrigir dados, gerir turmas, ver empresas, reiniciar fluxos simples e acompanhar problemas reportados. |
| Que informação o Docente precisa antes de contactar suporte? | Turma, utilizador, empresa, módulo, erro, último passo e evidência visual. |
| Que materiais devem existir antes do semestre? | Guia de arranque, checklist de configuração, guia de erros comuns e script de orientação para alunos. |
| Que alertas seriam úteis? | Alunos sem conta activa, convites pendentes, empresas incompletas, planos não submetidos, erros recorrentes por turma. |

### Assistentes

| Pergunta | Resposta fundamentada |
|---|---|
| Que base de conhecimento criar? | Base por tema: acesso, registo/dados, sócios/convites, empresa, pitch/plano, operações, pagamento e erros. |
| Que respostas-modelo reduzem tempo? | Scripts para recolha de dados, reset de senha, aceitar convite, localizar pitch, corrigir empresa e pedir print. |
| Que campos obrigatórios no contacto? | Perfil, instituição, turma, e-mail de registo, nome da empresa, módulo, passo onde parou, erro visível, anexo. |
| Que checklist de diagnóstico usar? | Identificar perfil, validar conta, confirmar módulo, reproduzir passo, pedir evidência, verificar dados e decidir escalamento. |
| Que pedidos encaminhar automaticamente? | Erros técnicos, campos indisponíveis, dados inconsistentes, pagamentos/facturação e pedidos de alteração em base de dados. |
| Que indicadores monitorizar? | Volume, cobertura de resposta, tempo de primeira resposta, tempo de resolução, tema, grupo, sentimento inicial/final, rating e estado final. |

## Qualidade do serviço de helpdesk

| Pergunta | Resposta fundamentada |
|---|---|
| Tempo médio/mediano até primeira resposta? | Mediana de 1,34 min, P75 de 3,15 min, quando existe resposta. |
| Percentagem de conversas com resposta? | 326 de 576, ou 56,6%. |
| Que conversas não têm resposta? | 250 conversas no export não mostram resposta de assistente. Muitas são mensagens únicas; podem ser contactos offline ou conversas abandonadas, mas devem ser auditadas. |
| Quantas mensagens até resposta útil? | A planilha permite contar mensagens, mas não classifica “resposta útil”. Como proxy, conversas com temas complexos têm 5 a 9,5 mensagens de mediana. |
| Que temas têm conversas mais longas? | Evidência/diagnóstico, plano/pitch, erro/bloqueio e registo/dados. |
| Que assistentes atendem mais volume? | Os três assistentes com maior carga concentram 85,8% das mensagens dos assistentes. |
| Há períodos de pico? | Sim: 2026-04 (93 conversas), 2026-05 (86), 2025-03 (65), 2025-04 (61), 2026-03 (62). |
| Ratings positivos e negativos diferem? | Só existem 8 ratings; 5 positivos e 3 negativos. Amostra insuficiente. |
| O rating confirma o sentimento inferido? | Não é possível concluir, pela baixa cobertura. |
| Que padrões estão associados a resolução aparente? | A melhoria do sentimento final sugere efeito positivo da intervenção, mas falta `estado_resolucao` para confirmar. |

## Produto e melhoria do SPEE

| Pergunta | Resposta fundamentada |
|---|---|
| Que módulos geram mais apoio? | O domínio SPEE concentra 85,9% do volume. Temas funcionais mais fortes: registo/dados, acesso/senha, erro/bloqueio, orientação e sócios/empresa. |
| Que fluxos são menos compreendidos? | Sócios/convites, empresa, pitch/plano, activos mínimos, contratos e pagamentos. |
| Que erros parecem mais frequentes? | “Não aparece”, “não aceita”, dados não reconhecidos, bloqueio de acesso, erro de sistema e campos indisponíveis. |
| Que termos dos utilizadores divergem da plataforma? | Utilizadores falam em “não aparece”, “onde entro”, “como faço”, “activos mínimos”, “sócio”, “empresa”, “pitch”. A UI deve usar esta linguagem nos textos de ajuda. |
| Que problemas seriam reduzidos com mensagens claras? | Dados não reconhecidos, aceite de convites, senha/código, submissão de plano, pagamento e estado de empresa. |
| Que passos precisam de validação preventiva? | E-mail, sócio, empresa, cadastro, capital, pagamento, contrato e submissão do plano. |
| Que funcionalidades exigem redesenho? | Fluxo de sócios/convites, gestão de dados de empresa, recuperação de conta e orientação contextual nos módulos. |
| Que instituições/turmas precisam de formação? | Há sinais por prefixos institucionais, mas a coluna precisa normalização antes de ranking responsável. |
| Que problemas são sazonais? | Picos em Março/Abril e Abril/Maio sugerem ciclos de arranque e execução do semestre; confirmar com calendário académico. |

## Respostas às perguntas prioritárias

1. **Quais são as principais dores?** Registo/dados, acesso/senha, erro/bloqueio, orientação e sócios/empresa.
2. **Que dores são mais prováveis em Alunos e Docentes?** Alunos: sócios/empresa, dados, acesso, orientação e operações. Docentes: turmas, gestão pedagógica, dados e empresas.
3. **Que temas geram sentimento mais negativo?** Erro técnico/bloqueio (66,4% negativas), pagamentos/facturação (48,4%), registo/dados (48,5%) e operações simuladas (47,3%).
4. **O sentimento melhora após intervenção?** Sim, indicativamente: Alunos 82,8% e Docentes 73,3% de melhoria nos casos comparáveis.
5. **Que problemas consomem mais esforço?** Evidência/diagnóstico, plano/pitch, erro/bloqueio, registo/dados e acesso.
6. **Que necessidades podem virar FAQ/tutorial/validação?** Acesso/senha, sócios/convites, pitch/plano, contratos, activos mínimos, pagamentos e correcção de dados.
7. **Que falhas atrasam resolução?** Falta de perfil, turma, empresa, e-mail de registo, print e passo exacto onde ocorreu o erro.
8. **Que módulos priorizar?** SPEE core, com foco em dados/cadastro, acesso, empresa/sócios, operações e mensagens de erro.
9. **Que indicadores monitorizar?** Perfil, tema, sentimento inicial/final, tempo de primeira resposta, tempo de resolução, estado final, rating e recorrência por instituição/turma.
10. **Que dados adicionais recolher?** Perfil obrigatório, instituição, turma, módulo, empresa, estado do caso, resolução, causa, categoria e satisfação pós-atendimento.

## Recomendações fundamentadas

### 1. Reestruturar o formulário de contacto

**Fundamento:** 43,4% das conversas não têm resposta de assistente no export, e muitas mensagens iniciais são curtas ou incompletas. Além disso, 466 conversas ficaram como visitantes indeterminados por ausência de perfil explícito.

Recomendação:

- Tornar obrigatório o campo `Perfil`: Aluno, Docente, Assistente, Outro.
- Recolher instituição, turma, e-mail usado no SPEE, nome da empresa, módulo e passo onde ocorreu o problema.
- Acrescentar campo fechado de tema: acesso, cadastro, sócios, empresa, plano, operações, pagamentos, erro técnico.
- Permitir anexo/print, mas com aviso para não incluir senhas ou dados sensíveis.

Impacto esperado: melhor classificação automática, menos perguntas de clarificação, maior capacidade de medir dores por grupo.

### 2. Criar guias e ajuda contextual para os cinco temas principais

**Fundamento:** Registo/dados (132 conversas), acesso/senha (122), erro/bloqueio (119), orientação (118) e sócios/empresa (115) formam o núcleo da procura de apoio.

Recomendação:

- Criar FAQ contextual dentro do SPEE para cada tema.
- Inserir botões “Preciso de ajuda neste passo” nos fluxos de sócios, empresa, pitch, activos e pagamentos.
- Usar linguagem do utilizador: “não aparece”, “não aceita”, “onde entro”, “como faço”.
- Para cada erro, mostrar causa provável, próximo passo e quando contactar suporte.

Impacto esperado: redução de contactos repetitivos e menor frustração nos Alunos.

### 3. Dar mais autonomia ao Docente

**Fundamento:** 71,4% das conversas de Docentes classificadas envolvem turmas e gestão pedagógica. A dor docente é de controlo e visibilidade.

Recomendação:

- Criar painel de turma com estado dos alunos: conta activa, empresa criada, sócios pendentes, plano submetido, operações concluídas.
- Permitir ao Docente corrigir erros simples, desbloquear passos ou pedir escalamento com contexto já preenchido.
- Disponibilizar checklist de arranque do semestre e guia de intervenção quando vários alunos reportam a mesma dor.

Impacto esperado: menos dependência do helpdesk para tarefas pedagógicas e melhor resposta aos Alunos.

### 4. Padronizar scripts do helpdesk

**Fundamento:** 1.032 mensagens de assistentes mostram tom neutro e diagnóstico; a carga concentra-se em poucos assistentes. A repetição de pedidos de clarificação indica oportunidade de normalização.

Recomendação:

- Criar respostas-modelo para acesso/senha, sócios/convites, empresa, pitch/plano, activos, pagamentos e erros.
- Criar checklist de diagnóstico por tema.
- Registar estado final: resolvido, pendente do utilizador, escalado técnico, duplicado, sem resposta.
- Medir tempo de resolução, não apenas tempo de primeira resposta.

Impacto esperado: atendimento mais consistente, formação mais fácil de novos assistentes e melhor evidência para gestão.

### 5. Implementar política de segurança no atendimento

**Fundamento:** Há evidência de conversas em que senhas/códigos são pedidos ou enviados por chat. Isto é um risco operacional e de privacidade.

Recomendação:

- Proibir recolha de senhas no chat.
- Substituir partilha de senhas/códigos por fluxo seguro de redefinição.
- Mascarar automaticamente e-mails, telefones, códigos e senhas no export.
- Acrescentar aviso no formulário: “Não envie senhas, códigos pessoais ou dados sensíveis”.

Impacto esperado: menor risco de exposição de dados pessoais e credenciais.

### 6. Criar medição contínua de sentimento e resolução

**Fundamento:** Existem apenas 8 ratings, insuficientes para medir satisfação. A melhoria de sentimento é promissora, mas não substitui confirmação de resolução.

Recomendação:

- Enviar rating obrigatório ou semi-obrigatório após encerramento.
- Recolher causa, tema e estado final.
- Medir sentimento inicial/final como indicador auxiliar.
- Criar painel mensal com volume, tema, perfil, negatividade, tempo de resposta, resolução e satisfação.

Impacto esperado: passar de análise retrospectiva manual para gestão contínua da experiência.

## Caveats e pressupostos

- A classificação de Docentes e Alunos é inferida; a planilha não contém perfil explícito.
- A análise de sentimento é léxica e deve ser validada manualmente numa amostra antes de uso institucional.
- O export pode não distinguir conversas offline, abandonadas ou resolvidas fora do chat; por isso “sem resposta” significa “sem resposta visível no export”.
- Ratings são insuficientes para medir satisfação global.
- Os excertos foram anonimizados; recomenda-se anonimizar qualquer relatório externo.
- Algumas categorias são multi-rótulo: uma conversa pode envolver acesso, dados e erro ao mesmo tempo.

## Próximo passo recomendado

Criar uma versão enriquecida da planilha com novas colunas: `grupo_actor`, `sentimento`, `emocao`, `dor_principal`, `necessidade_apoio`, `modulo_spee`, `estado_resolucao`, `confianca_classificacao` e `dados_sensiveis_detectados`. Com essas colunas, a próxima análise poderá separar com maior confiança Docentes, Alunos e Assistentes, além de produzir métricas mensais accionáveis para gestão do SPEE.
