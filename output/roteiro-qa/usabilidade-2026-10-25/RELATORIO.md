# Teste de utilização e coerência do roteiro SPEE

**Data:** 25 de Outubro de 2026. **Ambiente:** frontend local em `127.0.0.1:5173`. **Método:** percurso manual executado pelo assistente no browser integrado, com cliques, formulários, teclado, recarregamento e capturas de ecrã. Janela principal de 821 × 792 px; verificações responsivas adicionais em Playwright. Trata-se de uma inspecção de usabilidade, não de um estudo com participantes nem de uma certificação de acessibilidade.

## Resultado

Os fluxos centrais dos dois exemplos e a consulta pelo docente foram verificados. As falhas que impediam a leitura de PDF e as incoerências de navegação/estado encontradas foram corrigidas e revistas no browser. O menu lateral, o header e o footer não foram alterados.

O roteiro contém 15 actividades e 48 tarefas. O exemplo 1 inicia com 24 tarefas confirmadas, 7 actividades concluídas (47%) e 4/7 tarefas da constituição legal. O exemplo 2 inicia sem realizações. Cada exemplo conserva separadamente as alterações locais; os valores iniciais não são repostos ao voltar a entrar.

## Percursos executados no computador

| Passo | Acção e resultado observado | Evidência |
| --- | --- | --- |
| 1 | Abrir a entrada do estudante e distinguir os dois exemplos/empresas. | [Escolha dos exemplos](01-escolha-exemplos.png) |
| 2 | Entrar no exemplo 2: 0%, 0/15 actividades, início no acolhimento. | [Ponto de partida](02-exemplo-2-inicial.png) |
| 3 | Tentar uma tarefa posterior: a condição de bloqueio explica quiz de acolhimento e compromisso. Escape fecha o popup e restitui foco ao botão. | [Condição](03-condicao-bloqueio.png) |
| 4 | Submeter quiz vazio e depois respostas erradas: erros visíveis, foco na pergunta e ausência de conclusão. Corrigir as respostas: 4/4 (100%) e compromisso disponível. | [Reprovação](04-quiz-reprovado.png), [aprovação](05-quiz-aprovado.png) |
| 5 | Abrir PDF: visualizador integrado ficou vazio. Após correcção, o documento é legível na pré-visualização; a conclusão exige confirmação. | [Antes](06-pdf-antes.png), [depois](07-pdf-corrigido.png) |
| 6 | Abrir capa do vídeo: identificada como ilustração. A confirmação está inicialmente desactivada, exige «Simular visualização» e confirmação expressa. | [Vídeo ilustrativo](08-capa-video.png) |
| 7 | Recarregar: conclusões persistem. Trocar para exemplo 1: mantém 47% e 4/7 na constituição, sem herdar as alterações do exemplo 2. | [Exemplo 1](09-exemplo-1-inicial.png) |
| 8 | Continuar o registo em rascunho, rever e confirmar: passa a 5/7. Regressar directamente às tarefas e confirmar declaração: 6/7. | Fluxo observado no browser; resultado final no passo seguinte. |
| 9 | Seleccionar expressamente o PDF de exemplo e confirmar submissão: nome, autor e data aparecem; a constituição chega a 7/7. Recarregar conserva a submissão e deixa de mostrar próxima tarefa. | [Evidência submetida](10-evidencia-submetida.png) |
| 10 | Abrir a empresa ligada no docente: 53% (8/15 actividades), constituição concluída, 7/7 tarefas, pontuação e respostas do quiz, referência ao PDF e data da submissão. O popup não oferece execução de tarefas. | [Tarefas](11-docente-tarefas.png), [respostas](12-docente-quiz.png) |
| 11 | Abrir o primeiro ano fiscal: «Brevemente», com explicação de ausência de actividades. Estado do bloco B04 coincide com o do estudante. | [Bloco futuro](13-bloco-futuro.png) |

No passo 9 usou-se a alternativa explícita de ficheiro de exemplo; a selecção de um PDF real pelo controlo de ficheiros foi testada em Playwright. Os testes não enviaram documentos a entidades oficiais. Os dados guardados durante a inspecção permanecem no browser local; os fixtures publicados mantêm os pontos de partida definidos.

## Problemas encontrados e tratamento

| Gravidade | Evidência / impacto | Correcção e verificação |
| --- | --- | --- |
| Alta | PDF em branco no visualizador integrado impedia consultar o material obrigatório. | Pré-visualização PNG gerada do próprio PDF, com ligação ao original. Evidências carregadas pelo utilizador nunca recebem a imagem do exemplo. Migração do metadado preserva conclusões. Revisto no passo 5 e coberto por teste de repository. |
| Média | Cartões da landing podiam ser interpretados como reposição do estado inicial. | Texto esclarece que descrevem estados iniciais e que cada entrada retoma o progresso local. Isolamento e persistência verificados manualmente e em testes. |
| Média | Resultado do registo sugeria uma ferramenta de reposição que não existe na interface. | Instrução substituída por continuação das tarefas pendentes; botão directo «Voltar às tarefas da actividade», utilizado no passo 8. |
| Média | Docente apresentava «Por iniciar» no bloco futuro e podia apresentar «Bloqueado» num bloco com outras tarefas disponíveis. | Projecção do estado do mesmo roteiro do estudante; estado futuro explícito. Teste de contrato e revisão visual no passo 11. |
| Baixa | Confirmação de evidência dizia «de este exemplo». | Texto corrigido para «deste exemplo». |

## Oportunidades que não impedem o fluxo

- No quiz longo, o resultado fica no topo do popup; após submeter com o ecrã deslocado, é necessário subir para o consultar. Uma melhoria posterior pode focar o resultado e anunciá-lo de forma mais explícita.
- O detalhe antigo do docente ainda inclui um texto genérico em «Próximo passo» após conclusão da actividade. A lista de tarefas e os respectivos estados são correctos; pode ocultar-se este texto numa revisão dedicada.
- Os cartões dos blocos no docente usam deslocamento horizontal em janelas estreitas. Foi preservado o padrão existente; convém observá-lo numa sessão com docentes reais.
- O build avisa que o bundle principal ultrapassa 500 kB. Não impede a publicação, mas merece medição de desempenho antes da integração definitiva.

## Verificação técnica final

Executada após as últimas alterações de código, sem editar ficheiros durante a execução:

- `npm run check`: TypeScript, ESLint, fronteiras arquitecturais e **77 testes Vitest** passaram.
- `npm run build`: concluído; aviso de tamanho do bundle registado acima.
- `npm run build-storybook`: concluído; componentes isolados disponíveis.
- `npm run test:e2e`: **50/50 testes passaram na mesma execução** (27,6 s). Inclui isolamento dos exemplos, PDF/vídeo, upload de evidência, persistência, privacidade das conversas, docente, fluxos anteriores e ecrãs móveis.
- Integridade e revisão dos 3 DOCX, 12 PDF e 2 Excel documentadas em [VALIDACAO.md](../VALIDACAO.md).

## Limites e proveniência

Não foram testados browsers físicos adicionais, leitores de ecrã, rede lenta, concorrência entre utilizadores reais ou integração com sistemas de produção. Os testes de falhas de armazenamento e concorrência são automatizados com cenários controlados. As fontes externas podem exigir sessão ou estar temporariamente indisponíveis. Os vídeos são capas ilustrativas; as operações, entrevistas e documentos de exemplo são pedagógicos e não têm validade oficial.

As condições provisórias do roteiro e as fontes pesquisadas estão em [roadmap-scenarios.md](../../../frontend/docs/roadmap-scenarios.md). PRDs comum, estudante e docente foram actualizados com as decisões e correcções. A publicação utiliza o workflow habitual de GitHub Pages, com nova verificação de código no CI.
