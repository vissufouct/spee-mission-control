# Meu Percurso: colaboração

Aplicar as regras da raiz. O bloco consultado pertence à URL; nunca alterar context.currentBlockId ao navegar.

Mensagens do grupo ficam no JourneyRepository e nunca são projectadas para o docente. ConversationGateway transporta exclusivamente o canal docente; a composição em app/providers liga as APIs públicas das features. Não importar internals do docente.

Tarefas nas conversas: responsável membro da empresa, apenas Por fazer/Feito, conclusão exclusiva do responsável. Resolução de notificações é por destinatário e mensagem; leitura, resposta ou conclusão de tarefa de conversa não resolvem automaticamente. Nenhuma destas operações altera progresso.

Tarefas de aprendizagem pertencem a uma actividade e são distintas das tarefas de conversa. Os seus estados e acções pertencem à tarefa; a actividade apresenta o agregado. Operações de registo usam evidência do formulário; quiz de domínio exige respostas correctas; diagnóstico exige todas as respostas e calcula pontuação; materiais exigem confirmação explícita. Não concluir tarefas ao abrir popups. Preservar respostas, revisão, eventos e erros no repository. Materiais de demonstração são locais, sem dependências remotas.

Testar round-trip estudante/docente, privacidade da projecção, reabertura, persistência, revisão obsoleta e erros. Identidade local de demonstração não equivale a autenticação; a futura API deve impor estas permissões.
