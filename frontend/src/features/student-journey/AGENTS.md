# Meu Percurso: colaboração

Aplicar as regras da raiz. O bloco consultado pertence à URL; nunca alterar context.currentBlockId ao navegar.

Mensagens do grupo ficam no JourneyRepository e nunca são projectadas para o docente. ConversationGateway transporta exclusivamente o canal docente; a composição em app/providers liga as APIs públicas das features. Não importar internals do docente.

Tarefas: responsável membro da empresa, apenas Por fazer/Feito, conclusão exclusiva do responsável. Resolução de notificações é por destinatário e mensagem; leitura, resposta ou conclusão de tarefa não resolvem automaticamente. Nenhuma destas operações altera progresso.

Testar round-trip estudante/docente, privacidade da projecção, reabertura, persistência, revisão obsoleta e erros. Identidade local de demonstração não equivale a autenticação; a futura API deve impor estas permissões.
