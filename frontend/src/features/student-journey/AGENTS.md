# Meu Percurso: colaboração

Aplicar as regras da raiz. O bloco consultado pertence à URL; nunca alterar context.currentBlockId ao navegar.

Mensagens do grupo ficam no JourneyRepository e nunca são projectadas para o docente. ConversationGateway transporta exclusivamente o canal docente; a composição em app/providers liga as APIs públicas das features. Não importar internals do docente.

Tarefas nas conversas: responsável membro da empresa, apenas Por fazer/Feito, conclusão exclusiva do responsável. Resolução de notificações é por destinatário e mensagem; leitura, resposta ou conclusão de tarefa de conversa não resolvem automaticamente. Nenhuma destas operações altera progresso.

Tarefas de aprendizagem pertencem a uma actividade e são distintas das tarefas de conversa. Os seus estados e acções pertencem à tarefa; a actividade apresenta o agregado. Operações de registo usam evidência do formulário; quiz de domínio exige o limiar configurado (100% quando omitido); diagnóstico exige todas as respostas e calcula pontuação; materiais exigem confirmação explícita. Não concluir tarefas ao abrir popups. Preservar respostas, revisão, eventos e erros no repository. Os materiais originais são locais; o roteiro também permite ligações HTTPS a fontes externas, sem implementar integrações ou copiar publicações de terceiros.

O roteiro de 25/10/2026 tem dois exemplos isolados na composição. As tarefas usam IDs estáveis e dependências validadas; o bloco futuro vazio não conta no progresso. Capas de vídeo são identificadas como tal e exigem simulação explícita da visualização. Evidências PDF/DOCX/XLSX até 2 MB passam pelo contrato do repository; um ficheiro de exemplo só é submetido após escolha explícita. Ver `frontend/docs/roadmap-scenarios.md` para regras provisórias e fontes.

Testar round-trip estudante/docente, privacidade da projecção, reabertura, persistência, revisão obsoleta e erros. Identidade local de demonstração não equivale a autenticação; a futura API deve impor estas permissões.
