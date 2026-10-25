# Hub social

Aplicar as regras da raiz. Esta feature é independente do percurso, das conversas de actividade e do shell. A composição monta-a apenas nas rotas do estudante. Não importar componentes internos de outras features.

O repository valida pertença a canais, destinatário de convites, respostas dentro da mesma conversa, revisões e falhas de persistência. Grupos só admitem convidados após aceitação explícita pelo próprio. Mensagens privadas e conteúdo de grupos não aceites são excluídos do snapshot entregue à UI. Não simular aceitação automática nem mensagens remotas em tempo real.

A identidade fixa Ana Machava e os dados JSON são uma experiência local. O armazenamento do browser não garante confidencialidade contra quem acede à máquina; uma API futura deverá autenticar e autorizar no servidor. Não expor este hub no docente nem misturar progresso académico com reacções/publicações.

GIFs: a integração GIPHY foi pedida explicitamente. Usar o contrato GifRepository injectado; somente o adaptador pode efectuar pedidos. Não guardar chaves no código nem apresentar pesquisa simulada como real. Sem chave, mostrar configuração em falta. Validar os URLs dos anexos e preservar compatibilidade com mensagens de texto existentes.
