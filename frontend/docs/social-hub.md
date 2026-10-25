# Hub social local

Feature `social-hub`, montada por `app/router` ao lado do shell do estudante. O painel não altera dimensões nem componentes do template. Providers injectam um contrato assíncrono; o adaptador JSON valida e persiste em `spee.social-hub.v1`. Nenhum componente importa fixtures nem acede ao armazenamento.

Comunidade, grupos e mensagens privadas têm canais separados. As mensagens incluem nome e turma do autor, resposta contextual e reacções. O badge conta mensagens de outros participantes ainda não marcadas como lidas; convites têm uma indicação própria. A marcação é explícita por conversa. Novas mensagens e convites só existem no cenário deste browser, sem envio externo.

O criador é membro inicial; os restantes ficam convidados. Apenas o destinatário aceita ou recusa. Há um convite dirigido à Ana no fixture para validar o fluxo. O repository admite uma identidade injectada nos testes para verificar a aceitação pelos outros membros; a UI não se faz passar por eles. O selector de mensagens privadas lista nome e turma para evitar ambiguidades.

O snapshot filtra canais/mensagens por pertença. Isso valida o contrato de UX, mas localStorage não é um mecanismo real de autorização ou confidencialidade. A futura API deve garantir identidade, permissões e sincronização entre pessoas. Não há backend nesta etapa.

Radix Dialog fornece foco, Escape e semântica acessível; CSS local cria o deslizamento lateral, respeitando movimento reduzido. Em desktop ocupa 48% do ecrã; em telemóvel usa quase toda a largura. A seta é fixa, pequena e não reserva espaço. Testar a feature isolada do shell, privacidade entre identidades, falhas de escrita, revisões e persistência.

### Navegação nas mensagens

As mensagens aparecem por ordem cronológica, com as mais recentes em baixo, junto ao compositor. Ao abrir uma conversa, posicionar na primeira mensagem recebida ainda não lida, identificada por «Mensagens por ler»; se não houver mensagens por ler, abrir no fim. Incluir a primeira mensagem por ler mesmo quando antecede a página inicial de histórico. Carregar mensagens anteriores ao subir, preservando a posição de leitura. Enviar uma mensagem desloca para o fim; reacções não devem provocar saltos. A marcação como lida continua explícita.

## Emojis e GIFs

O compositor tem botões adjacentes «Emojis» e «GIFs». O catálogo Unicode local tem nove categorias e pesquisa em português sem distinção de acentos. Insere no cursor e respeita o limite de caracteres. O selector fecha com Escape sem fechar o hub.

A integração GIPHY, solicitada para esta feature, é a excepção explícita ao âmbito inicial sem serviços externos. Não cria backend. `GifRepository` é injectado no provider; só `GiphyRepository` conhece o transporte. O browser consulta trending/search apenas ao abrir GIFs, com classificação G, cancelamento e cache temporária. Não envia o texto das conversas: envia somente os termos de pesquisa. Seleccionar não publica: apresenta pré-visualização removível e requer «Publicar mensagem». Mensagens aceitam texto, GIF ou ambos; guardam os metadados/URL, não o ficheiro, e mantêm compatibilidade com os cenários anteriores. GIFs dependem de ligação à Internet.

### Activação do GIPHY

Criar uma chave Web em https://developers.giphy.com/dashboard/ e definir `VITE_GIPHY_API_KEY` em `frontend/.env.local`, depois reiniciar Vite. Ver `.env.example`. Trata-se de uma chave de cliente, visível no bundle: nunca utilizar credenciais de servidor. Para GitHub Pages, disponibilizar a variável no ambiente do passo de build (a publicação não a configura automaticamente). Sem chave, o selector informa que a pesquisa aguarda configuração e não envia pedidos. Não existe chave de demonstração partilhada nem resultados inventados apresentados como pesquisa real. As stories usam um adaptador simulado explicitamente para testar o fluxo sem conta real.

Documentação: https://developers.giphy.com/docs/api/quick-start-guide/ e https://developers.giphy.com/docs/api/. Atribuição «Powered By GIPHY» no selector. Antes de publicação com chave, confirmar a elegibilidade/limites e os requisitos de marca da conta GIPHY.


## Pesquisa de participantes — 25/10/2026

`ParticipantPicker` é partilhado apenas dentro desta feature: selecção múltipla no formulário do grupo e escolha única em `PrivateMessagePicker`. Recebe membros e callbacks; não conhece fixtures nem persistência. `searchParticipants` normaliza acentos e capitalização, combina nome/turma e trata «turma B» como filtro da turma, sem confundir letras de apelidos.

Resultados têm deslocamento interno (altura limitada), nome e turma. Os convidados seleccionados ficam fora da lista filtrada e podem ser retirados. «Nova mensagem privada» expande a pesquisa; a selecção chama o contrato existente e reutiliza a conversa, recolhendo a pesquisa só após sucesso. Erros mantêm a pesquisa aberta. Os convites e as permissões não mudam.

A story `ManyParticipants` usa 86 participantes fictícios em memória, sem escrita no cenário pessoal. O teste de fluxo valida pesquisa sem acentos, por turma, selecções persistentes entre filtros, ausência de resultados, teclado, escolha privada e largura móvel.
