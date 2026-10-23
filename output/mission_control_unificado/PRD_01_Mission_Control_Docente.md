# PRD do Mission Control do Docente

**Versão:** 0.3  
**Data:** 22 de Outubro de 2026  
**Estado:** rascunho consolidado a partir das imagens do protótipo  
**Depende de:** `PRD_00_Mission_Control_Comum.md`  

## 1. Resultado esperado

O Mission Control do Docente permite acompanhar uma turma sem consultar sucessivamente os diferentes módulos do simulador. O docente começa na visão geral, identifica empresas ou marcos que requerem atenção, abre o percurso de uma empresa e aprofunda até às contribuições, resultados e eventos confirmados.

Este PRD descreve exclusivamente requisitos, permissões, fluxos e ecrãs do docente. O protótipo docente mantém-se separado do protótipo do estudante.

O painel não é um sistema de vigilância nem uma classificação de estudantes. O seu propósito é apoiar orientação pedagógica, diagnóstico de dependências e intervenções autorizadas.

## 2. Utilizadores e permissões

| Perfil | Capacidades previstas |
|---|---|
| Docente da turma | Consultar estados, prazos, participantes, resultados e pista de actividade da turma autorizada |
| Docente com permissão de orientação | Solicitar correcção ou orientar uma próxima acção dentro do âmbito atribuído |
| Avaliador | Consultar evidências e aplicar instrumentos de avaliação autorizados |
| Administrador funcional | Configurar acesso e resolver excepções operacionais, sem substituir o trabalho do estudante |

As permissões de consulta, orientação, correcção, avaliação e administração devem ser independentes.

## 3. Fluxo principal

```text
Visão geral da turma
→ filtrar ou seleccionar uma empresa
→ percurso da empresa
→ actividade e participantes
→ contribuição e pista de actividade
→ resultado ou evidência no módulo do simulador
→ intervenção autorizada, quando aplicável
```

## 4. Ecrãs de referência

A série docente v3 aplica as cores, o cabeçalho e as treze entradas do menu lateral da referência do simulador de 22 de Outubro de 2026. A navegação específica do docente permanece na área central. A integração técnica do menu continua pendente na DEC-007.

### 4.1. Visão geral da turma

Fonte principal: `output/mockups/docente_v3/mission_control_docente_v3_01_visao_geral.png`.

Elementos representados:

- contexto da turma, ano e disciplina;
- filtros por turma, roteiro, estado e prazo;
- pesquisa por empresa ou estudante;
- indicadores de empresas activas, conclusão média da simulação e alertas;
- matriz de empresas por marco;
- percentagem global por empresa;
- estados por marco e identificação resumida de participantes;
- filtros combináveis por coluna;
- deslocamento horizontal e vertical;
- ícone de consulta que abre o percurso completo da empresa.

O painel lateral e a lista fixa de alertas do protótipo anterior foram removidos para permitir que a matriz cresça. Alertas devem funcionar como sínteses accionáveis e, quando seleccionados, filtrar a matriz ou abrir a lista correspondente.

### 4.2. Percurso da empresa

Fonte principal: `output/mockups/docente_v3/mission_control_docente_v3_02_percurso_empresa.png`.

Elementos representados:

- nome da empresa e turma;
- indicadores de conclusão, actividades em curso, alertas e prazos próximos;
- sequência dos blocos do percurso;
- tabela das actividades do bloco actual;
- participantes, estado, prazo e acção **Ver**;
- pista resumida de actividade;
- indicação de que o progresso resulta de eventos e resultados confirmados.

### 4.3. Contribuição e pista de actividade

Fonte principal: `output/mockups/docente_v3/mission_control_docente_v3_03_contribuicao_pista.png`.

Elementos representados:

- participantes, acções confirmadas, resultados e alertas;
- separação entre contribuições confirmadas, trabalho colectivo e acções automáticas;
- tabela por actividade com participantes, ocorrências, resultado, estado e acção;
- distribuição descritiva de ocorrências, explicitamente sem classificação;
- últimos resultados consultáveis;
- cronologia de actividade;
- nota explícita de que não se usam cliques, tempo de sessão ou rankings.

### 4.4. Intervenções e auditoria

Fonte complementar: `output/assets/mission_control_docente_intervencoes_auditoria_v1.png`.

O padrão visual apresenta fila de intervenção, motivo obrigatório, efeito previsto, evidências consultadas, confirmação explícita e histórico. Esta capacidade continua prevista, mas o catálogo de alertas, as permissões e a integração na navegação actual carecem de validação.

## 5. Requisitos funcionais

| ID | Requisito |
|---|---|
| MC-DOC-001 | O docente deve seleccionar turma e roteiro dentro do âmbito autorizado. |
| MC-DOC-002 | A visão geral deve permitir filtrar por estado, prazo, empresa ou estudante. |
| MC-DOC-003 | O painel deve mostrar empresas activas, conclusão média da simulação e quantidade de alertas accionáveis. |
| MC-DOC-004 | A conclusão média deve ser calculada a partir do progresso confirmado de cada empresa e da mesma definição usada na vista do estudante. |
| MC-DOC-005 | A matriz deve apresentar empresas nas linhas e marcos ou blocos nas colunas. |
| MC-DOC-006 | Cada linha deve mostrar a percentagem global da empresa e uma acção para abrir o respectivo percurso. |
| MC-DOC-007 | Cada coluna deve aceitar filtros de estado combináveis com os restantes filtros. |
| MC-DOC-008 | A matriz deve suportar crescimento vertical e horizontal com cabeçalhos e contexto identificáveis durante a deslocação. |
| MC-DOC-009 | Um alerta seleccionado deve identificar as empresas afectadas e preservar os filtros aplicados. |
| MC-DOC-010 | O percurso da empresa deve mostrar blocos, estado global, actividades em curso, alertas e prazos próximos. |
| MC-DOC-011 | A tabela do bloco actual deve mostrar actividade, participante ou participantes, estado, prazo e acção de consulta. |
| MC-DOC-012 | A acção **Ver** deve abrir a actividade ou o resultado no módulo responsável, com contexto da empresa e da instância. |
| MC-DOC-013 | A pista de actividade deve ordenar eventos confirmados e permitir abrir a cronologia completa. |
| MC-DOC-014 | A vista de contribuição deve separar contribuição individual confirmada, trabalho colectivo e automatização. |
| MC-DOC-015 | Uma actividade pode indicar mais de um participante; a interface não deve atribuir todo o resultado apenas ao actor que efectuou a última operação. |
| MC-DOC-016 | A contagem de ocorrências deve ser descritiva e nunca apresentada como classificação de mérito. |
| MC-DOC-017 | Resultados recentes devem ser consultáveis sem expor informação fora da turma autorizada. |
| MC-DOC-018 | O docente deve conseguir aprofundar um estado até ao evento, resultado ou evidência que o sustenta. |
| MC-DOC-019 | Uma intervenção material deve exigir motivo, apresentar o efeito previsto e pedir confirmação. |
| MC-DOC-020 | Intervenções devem preservar o histórico e registar actor, papel, data, motivo, estado anterior e estado posterior. |
| MC-DOC-021 | Uma intervenção não pode executar silenciosamente o trabalho do estudante. |
| MC-DOC-022 | O painel deve apresentar a última actualização e o estado de sincronização. |

## 6. Regras de alertas

Os alertas devem corresponder a situações reais e configuradas. O transcript afastou, para o cenário actual, exemplos de “aprovação docente pendente” e “tarefa sem responsável”. O catálogo inicial deve privilegiar:

- empresas que não concluíram um marco dentro do prazo configurado;
- empresas que ainda não iniciaram um marco já esperado;
- actividades devolvidas que aguardam correcção;
- dependências paradas ou falhas de sincronização;
- prazos próximos ou ultrapassados;
- bloqueios colectivos apenas quando existe uma condição real que afecta várias empresas.

Os limiares e a relação entre alerta e filtro da matriz permanecem por decidir.

## 7. Regras de contribuição

1. Uma ocorrência representa uma acção de domínio confirmada, não um clique.
2. O mesmo resultado pode ter contribuição de vários estudantes e acções automáticas.
3. A interface deve distinguir autoria, validação, colaboração e automatização quando os eventos o permitirem.
4. A ausência de ocorrências não pode ser interpretada automaticamente como ausência de aprendizagem.
5. Qualquer uso da informação em avaliação exige critérios pedagógicos próprios e transparência para os estudantes.

## 8. Dados visíveis por nível

| Nível | Dados principais |
|---|---|
| Turma | empresas, conclusão média, alertas e sincronização |
| Empresa | percurso, estados, prazos, participantes e próxima acção |
| Actividade | critérios, responsáveis, resultado, estado e módulo de origem |
| Contribuição | actores, papéis, ocorrências confirmadas, trabalho colectivo e automatização |
| Evento | instante, actor, transição, resultado, evidência e correlação |

## 9. Critérios de aceitação

- O docente localiza uma empresa por pesquisa ou filtros e abre o percurso sem perder o contexto da turma.
- É possível combinar estados de dois marcos e obter apenas as empresas correspondentes.
- A matriz mantém-se utilizável com mais linhas e colunas através de deslocamento vertical e horizontal.
- A percentagem da empresa coincide com a percentagem apresentada ao estudante da mesma empresa e versão.
- Uma actividade identifica todos os participantes confirmados, sem converter ocorrências em ranking.
- O docente abre um resultado no módulo de origem e regressa ao mesmo ponto do Mission Control.
- Qualquer intervenção autorizada apresenta o efeito previsto, exige motivo e fica auditada.
- Alertas apresentados correspondem a regras existentes e permitem identificar as empresas afectadas.

## 10. Fora do âmbito visual actual

- Exportação da matriz. O backlog prevê exportação, mas o transcript e as imagens actuais não a incluem; a divergência permanece pendente.
- Redesenho do menu global do simulador.
- Avaliação automática da qualidade da contribuição.
- Comparação competitiva ou ranking entre estudantes e empresas.
- Definição final dos limiares de prazo, catálogo de intervenções e política de retenção.
