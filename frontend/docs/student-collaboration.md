# Colaboração do estudante — 24 de Outubro de 2026

As conversas abrem num pop-up tabulado (Docente / Grupo da empresa), com badges por canal; não existe painel lateral permanente. A ligação com `?canal=` abre o canal contextual. O histórico apresenta inicialmente as últimas 20 mensagens e acrescenta lotes de 20 ao subir, preservando a posição. Este scroll infinito é uma janela sobre os dados locais já carregados, não paginação de backend. Os rascunhos são independentes por canal e abrir o chat não resolve notificações.

O bloco consultado vive no parâmetro `bloco` da URL; o bloco actual continua no snapshot. Actividades têm rota própria e conteúdo independente do shell.

`JourneyRepository` guarda mensagens privadas do grupo, tarefas simples e resoluções individuais de notificações. Apenas o responsável pode concluir uma tarefa; os métodos verificam o participante do cenário. Abrir, responder, resolver ou concluir tarefa não altera progresso.

`ConversationGateway` é um contrato da feature estudante que só conhece mensagens do canal docente. `app/providers/createStudentConversations.ts` compõe as APIs públicas dos dois repositories: projecta pedidos, respostas e orientações publicadas para o estudante e encaminha mensagens do estudante para pedidos do docente. Mensagens do grupo nunca atravessam este contrato nem o adaptador `mapStudentJourney`.

IDs de mensagens permitem resolver notificações sem ocultar futuras respostas. A resolução é por destinatário, preserva o histórico e só ocorre por acção explícita. A identidade continua a ser a do cenário. O protótipo não tem autenticação: a privacidade é uma fronteira funcional entre vistas, não isolamento contra inspecção do armazenamento pelo proprietário do browser. A futura API deve validar identidade, empresa, destinatários, permissões e revisão no servidor.

Dados antigos continuam legíveis: os campos novos têm valores iniciais; os estados legados são projectados nos quatro estados visíveis. Cenários já guardados conservam os seus dados e não recebem automaticamente as novas mensagens ilustrativas. Repor o cenário é uma operação explícita.

Sem novas dependências. Stories usam memória isolada. Testes cobrem navegação, round-trip docente/estudante, tarefas, notificações, reabertura e ausência de dados privados na projecção docente.
