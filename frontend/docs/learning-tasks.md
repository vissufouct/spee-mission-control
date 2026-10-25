# Tarefas de aprendizagem — 25 de Outubro de 2026

`student-journey` define tarefas dentro de `Activity.tasks`, com IDs estáveis e tipo operation/quiz/video/pdf/url/evidence. Não confundir com tarefas das conversas (`groupMessages.assignee/doneAt`). `steps` é preservado apenas para compatibilidade de cenários antigos.

Diagnósticos exigem todas as respostas e calculam a pontuação, sem exigir 100%; quizzes de domínio exigem respostas correctas. O diagnóstico de «Definir a ideia» aparece primeiro, com 4/5 (80%), seguido da operação e da evidência PDF já submetida. O pré-quiz de «Registar empresa» também aparece primeiro; a declaração PDF é a última tarefa, pendente. A submissão é simulada com PDF preparado e confirmação expressa; não há upload nesta experiência. O repository guarda metadados e conclusão numa operação, sem confundir submissão com aprovação.

A leitura acrescenta os IDs entrepreneur-diagnostic, audit-report-1 e registration-declaration quando faltarem nas respectivas actividades e aplica a ordem aprovada, preservando respostas, estados e ficheiros existentes. Os botões «Ver tarefas» apresentam a contagem actual X de Y.

`getLearningTasks` resolve evidência operacional do registo; `getActivityStatus` agrega tarefas obrigatórias. Componentes de apresentação recebem dados/callbacks. `ActivityPage` coordena `useJourneyMutation`; `completeLearningTask` no repository valida quiz, bloqueios e revisão antes de escrever. Operações de registo não podem ser concluídas por esse atalho.

O browser guarda JSON local; os fixtures não são escritos em execução. Definições são acrescentadas a cenários antigos apenas quando `tasks` não existe, sem substituir respostas, mensagens ou registos existentes. Requisitos novos podem tornar uma actividade anteriormente concluída em curso, mantendo o comprovativo confirmado. Exportações/importações preservam tarefas e respostas.

A futura API substitui o adaptador e deve validar identidade, avaliação e evidência de consulta. A confirmação de material é uma declaração do utilizador; reprodução local não é prova inviolável de aprendizagem. Respostas correctas estão nos fixtures exclusivamente para demonstração, não constituindo um mecanismo de exame seguro.

Os recursos em `public/apoio` são locais: PDF de constituição, vídeo silencioso com texto e transcrição na tarefa, páginas sobre proposta de valor e responsabilidades dos sócios. Os caminhos usam `BASE_URL` para suportar GitHub Pages. Não há serviços externos nem dependências novas.

A alteração em `app/providers/mapStudentJourney` é estritamente de composição: projecta estados agregados e evidências de tarefas pelas APIs públicas existentes, sem importar componentes internos ou conversas privadas.

O detalhe do docente consome um contrato de tarefas próprio, apenas de leitura. A composição projecta `getLearningTasks` pela API pública do estudante, incluindo respostas, datas e submissões; a Maputo Soluções usa exemplos explícitos no fixture docente. A leitura de cenários antigos acrescenta apenas tarefas ausentes do fixture da mesma empresa. Não deduzir execução individual a partir de estados agregados.
