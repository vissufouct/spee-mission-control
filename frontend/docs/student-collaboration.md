# Colaboração do estudante — 24 de Outubro de 2026

As conversas abrem num pop-up tabulado (Docente / Grupo da empresa), com badges por canal; não existe painel lateral permanente. A ligação com `?canal=` abre o canal contextual. O histórico apresenta inicialmente as últimas 20 mensagens e acrescenta lotes de 20 ao subir, preservando a posição. Este scroll infinito é uma janela sobre os dados locais já carregados, não paginação de backend. Os rascunhos são independentes por canal e abrir o chat não resolve notificações.

O bloco consultado vive no parâmetro `bloco` da URL; o bloco actual continua no snapshot. Actividades têm rota própria e conteúdo independente do shell.

`JourneyRepository` guarda mensagens privadas do grupo, tarefas simples e resoluções individuais de notificações. Apenas o responsável pode concluir uma tarefa; os métodos verificam o participante do cenário. Abrir, responder, resolver ou concluir tarefa não altera progresso.

`ConversationGateway` é um contrato da feature estudante que só conhece mensagens do canal docente. `app/providers/createStudentConversations.ts` compõe as APIs públicas dos dois repositories: projecta pedidos, respostas e orientações publicadas para o estudante e encaminha mensagens do estudante para pedidos do docente. Mensagens do grupo nunca atravessam este contrato nem o adaptador `mapStudentJourney`.

IDs de mensagens permitem resolver notificações sem ocultar futuras respostas. A resolução é por destinatário, preserva o histórico e só ocorre por acção explícita. A identidade continua a ser a do cenário. O protótipo não tem autenticação: a privacidade é uma fronteira funcional entre vistas, não isolamento contra inspecção do armazenamento pelo proprietário do browser. A futura API deve validar identidade, empresa, destinatários, permissões e revisão no servidor.

Dados antigos continuam legíveis: os campos novos têm valores iniciais; os estados legados são projectados nos quatro estados visíveis. Cenários já guardados conservam os seus dados e não recebem automaticamente as novas mensagens ilustrativas. Repor o cenário é uma operação explícita.

Sem novas dependências. Stories usam memória isolada. Testes cobrem navegação, round-trip docente/estudante, tarefas, notificações, reabertura e ausência de dados privados na projecção docente.

## Revisão após continuação da validação

Cartões na zona direita mostram até três notificações pendentes (mais recentes primeiro), globais ou restritas à actividade. O histórico do chat não é filtrado por resolução. Cores e rótulos distinguem docente de estudantes, independentemente de quem está a consultar.

Navegação contextual usa preventScrollReset, sem dependências do shell. Cartões de actividade recebem relações explícitas; não inferem precedência pela ordenação do percurso. Materiais têm metadados na fixture e ligações seguras; páginas de apoio locais estão identificadas como ilustrativas. O adaptador completa apenas metadados descritivos ausentes em cenários antigos, sem substituir estados, registos ou mensagens. Ligações externas reais e a participação ficam para a integração.

As ferramentas de cenário deixaram de estar expostas nas duas interfaces, incluindo reposição em caso de erro. Contratos internos de importação/exportação/reset continuam cobertos por testes de repository. Os dados não são apagados nem migrados destrutivamente. Não foram acrescentadas dependências.
