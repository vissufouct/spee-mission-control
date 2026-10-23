# QA visual — Mission Control do Docente

final result: passed

## Alvo e evidência

Referência: série docente v3 em `../output/mockups/docente_v3/`:

- `mission_control_docente_v3_01_visao_geral.png`
- `mission_control_docente_v3_02_percurso_empresa.png`
- `mission_control_docente_v3_03_contribuicao_pista.png`

Implementação: capturas finais do Chromium em `docs/screenshots/docente-visao-geral.png`, `docente-percurso.png` e `docente-contribuicao.png`. Cada referência foi apresentada juntamente com a captura correspondente na mesma chamada de comparação, à resolução original, depois das correcções. Não se inferiu correspondência apenas a partir do código.

Viewports de comparação: 1607 × 979 CSS px, deviceScaleFactor 1; capturas 1607 × 979 pixels. As referências têm cerca de 1607 × 979 pixels, sem moldura de dispositivo. Também houve inspecção no in-app browser e teste móvel a 390 × 844.

A comparação dos detalhes incidiu nos filtros/cabeçalhos da matriz, ícones/estados das células, cartões, stepper, tabs, referências de resultados e barras de participação. Estes elementos estavam legíveis nas imagens de resolução original, pelo que não foi necessário criar crops separados. A evidência adicional de formulário/modal e mobile está em docs/screenshots.

## Critério desta entrega

Implementação funcional e responsiva da direcção visual dos três mockups dentro da aplicação já existente, não uma reprodução pixel-perfect de dados estáticos. Preservar o shell existente, a separação entre papéis e a verdade dos estados do estudante tem precedência sobre copiar valores ilustrativos.

Diferenças esperadas e explícitas:

- Sidebar herdada de 272 px, em vez de aproximadamente 285 px da imagem; mesmos 13 itens e ordem. Não se reestruturou o template do estudante.
- Identidade demonstrativa em vez de sessão real; sem botão de logout fictício.
- Horizonte Verde mostra 18%/24%, não os 63% ilustrativos. O detalhe comparado usa Nova Geração para demonstrar o primeiro ano fiscal, porque Horizonte ainda está na constituição.
- Filtros nativos com labels persistentes; filtros por coluna sempre visíveis. São mais altos que os ícones de filtro da imagem, mas permitem avaliar os filtros reais e o estado seleccionado.
- O bloco fiscal tem cinco actividades, em vez das quatro agregadas da imagem. A tabela inclui o módulo de origem e o detalhe tem ainda orientações abaixo. A cronologia pode exigir scroll; nenhuma actividade ou controlo foi eliminado para forçar uma página estática.
- Contribuição cobre o histórico da empresa, com tabela de scroll limitado e cronologia completa. As barras seguem ordem alfabética, com explicação explícita de acções colectivas, em vez de aparentar classificação por desempenho.
- Resultados são demonstrativos e identificados como tal; não existem ligações operacionais externas.
- Ícones standard Lucide substituem a iconografia standard equivalente; não há fotografia, ilustração ou marca gráfica específica a reconstruir. A percentagem é texto numérico com ícone, sem reproduzir um gráfico decorativo estático.

## Cinco superfícies de fidelidade

| Superfície | Verificação final |
| --- | --- |
| Tipografia | Mantida a família existente Segoe UI/Helvetica Neue/Arial; hierarquia de título, subtítulo, secções e dados legível. Nenhuma fonte proprietária foi inferida/descarregada. Pequenas diferenças de peso e tamanho face ao raster permanecem como P3. |
| Espaçamento/composição | Sidebar/header herdados; overview de largura completa, três KPIs e matriz; detalhe com quatro KPIs e cinco blocos; contribuição com coluna principal e síntese lateral, empilhada no móvel. Densidade ajustada após revisão. Diferenças de altura por conteúdo real classificadas acima como esperadas. |
| Cores/tokens | Cinzentos e ciano do simulador, azul de acção partilhado, verde/azul/âmbar/vermelho nos estados/cartões. Estados incluem texto e ícone, não apenas cor. Contraste de textos de estado reforçado. |
| Imagem/ícones | Inventário: marca textual, avatar genérico e ícones standard. Não há assets raster a integrar. Lucide e tipografia existente mantêm nitidez em diferentes densidades; nenhuma imagem de referência foi usada como fundo da interface. |
| Conteúdo | PT-PT pré-AO; estados e percentagens derivados dos fixtures/repository; autoria apenas com evidência; automação separada; aviso de cenário local, sem rankings e sem documentos oficiais. |

## Histórico da revisão

1. Primeira renderização: cartões sem tonalidade de fundo e matriz demasiado alta. Corrigidos fundos, ritmo e altura do contentor.
2. Participantes apresentados em actividades sem evidência. Fixture corrigido para derivar participantes dos eventos confirmados.
3. Teste móvel encontrou overflow causado pelo label absoluto na última coluna. Contexto de posicionamento corrigido; documento e viewport passaram a ter 390 px.
4. Troca rápida de filtros podia reaproveitar parâmetros anteriores. Corrigida na feature, com teste completo de limpeza/troca de turma.
5. Comparação conjunta encontrou linhas/cartões demasiado altos e barras laterais demasiado espaçadas. Ajustados min-height dos botões, cartões, stepper, tabelas, tabs e barras.
6. Capturas refeitas e comparadas depois da última alteração visual. Não permanecem P0/P1/P2 accionáveis dentro do âmbito desta iteração; as adaptações de conteúdo/template estão discriminadas, não apresentadas como identidade pixel-perfect.

## Interacções e consola

Filtros AND, pesquisa, vazio, troca de turma, alertas, drill-down, resultados, Escape/retorno de foco, regresso com contexto, três categorias de contribuição, CRUD de orientações, confirmação, persistência, imutabilidade, erros e coerência docente/estudante testados. Nenhum pageerror nos 16 testes E2E. A consulta final dos logs de erro/warning no in-app browser devolveu lista vazia.

35 testes unitários, TypeScript, lint, fronteiras, build e build do Storybook passaram. Os testes não substituem a comparação visual nem a validação humana.

## Continuação

P3: afinar microtipografia e a apresentação compacta dos filtros após observação com docentes. Não publicar, implementar permissões reais ou integrar módulos operacionais como consequência automática desta QA.
