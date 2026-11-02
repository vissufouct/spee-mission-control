# Alterações ao roteiro SPEE e ligações para a demonstração

**Data:** 2 de Novembro de 2026
**Estado:** proposta passada a limpo, para validação antes da implementação.
**Base de comparação:** roteiro actualmente implementado em `frontend/src/data/student-roadmap-example-1.fixture.json` e anotações fornecidas pelo utilizador nesta conversa.

## 1. Síntese

A proposta contempla **quatro tarefas novas e quatro alterações a tarefas existentes**, distribuídas pelos blocos Ideação, Criação de empresas e Início de actividades. São indicados **12 botões ou ligações**, alguns com o mesmo destino.

As ligações abrem num novo separador, mantendo o painel do estudante disponível. Nas tarefas com vários destinos, o diálogo de orientação apresenta um botão por recurso ou serviço.

Os endereços abaixo foram transcritos das anotações, removendo apenas caracteres de escape e entidades de formatação. A disponibilidade das páginas, os requisitos de autenticação e o funcionamento das operações externas não foram verificados nesta revisão. Este documento não confirma a execução de operações nos portais.

## 2. Ideação

### Actividade: Encontrar uma ideia de negócio

**Nova tarefa: Conhecer as empresas do mercado**

- **Objectivo proposto:** explorar as empresas presentes no mercado simulado, identificar sectores, produtos e serviços e recolher referências para a ideia de negócio.
- **Tipo proposto:** consulta de página externa.
- **Botão:** «Consultar empresas do mercado».
- **Destino:** [Catálogo de empresas do simulador](https://speedev.simulacao.co.mz/paginasverdes/FormCatalogEmpresas.aspx?lng=1&hasEmpresa=1&idc=325).
- **Abertura:** novo separador.
- **Posição proposta:** antes de «Explorar uma ideia com apoio de IA», preservando o diagnóstico do empreendedor como primeira tarefa.
- **Comparação com o roteiro actual:** esta tarefa ainda não existe nesta actividade. Não substitui «Prospectar clientes e fornecedores», que pertence à configuração comercial.

## 3. Criação de empresas

### 3.1. Actividade: Constituição legal da empresa

**Alterar a tarefa existente: Consultar o portal do BAU**
**ID actual:** `b03-a01-t01`.

- Manter a designação da tarefa.
- Substituir a ligação genérica à página inicial do BAU pela página específica de licenciamento e registo.
- **Orientação proposta:** consultar a informação sobre licenciamento e registo de actividades económicas para preparar a constituição da empresa.
- **Botão:** «Consultar licenciamento e registo».
- **Destino:** [Licenciamento e Registo de Actividades Económicas — BAU](https://www.bau.gov.mz/licenciamento-eregisto-de-actividades-economicas-2/).
- **Abertura:** novo separador.

### 3.2. Actividade actual: Celebrar contratos de serviços

**Renomear a tarefa «Celebrar contratos de custos fixos» para «Contratar fornecedores».**
**ID actual:** `b03-a03-t01`.

No roteiro implementado, «Celebrar contratos de custos fixos» é uma **tarefa**, e não a designação da actividade. A interpretação proposta é renomear apenas esta tarefa e manter a actividade «Celebrar contratos de serviços», que também contém «Abrir a conta bancária».

**Orientação proposta:** contratar os fornecedores necessários ao funcionamento da empresa, consultando as condições de arrendamento e de fornecimento dos serviços essenciais. Organizar os contratos e comprovativos no arquivo da empresa.

O diálogo de orientação terá quatro botões:

| Botão | Destino | Abertura |
|---|---|---|
| Arrendar espaço de trabalho | [Imobiliária do simulador](https://speedev.simulacao.co.mz/servicos/1/Imobiliaria41/fortyone/html/menu.html?hasEmpresa=1) | Novo separador |
| Contrato de energia eléctrica | [Catálogo de fornecedores](https://speedev.simulacao.co.mz/paginasverdes/FormCatalogEmpresas.aspx?lng=1&hasEmpresa=1&idc=325) | Novo separador |
| Contrato de fornecimento de água | [Catálogo de fornecedores](https://speedev.simulacao.co.mz/paginasverdes/FormCatalogEmpresas.aspx?lng=1&hasEmpresa=1&idc=325) | Novo separador |
| Contrato de Internet e correio electrónico | [Catálogo de fornecedores](https://speedev.simulacao.co.mz/paginasverdes/FormCatalogEmpresas.aspx?lng=1&hasEmpresa=1&idc=325) | Novo separador |

**Interpretação proposta:** os quatro serviços são acessos dentro da mesma tarefa, não quatro tarefas independentes. Os três últimos botões usam exactamente o mesmo URL nas anotações; não se presume a existência de filtros específicos por serviço.

## 4. Início de actividades

### 4.1. Actividade: Configurar os recursos humanos

#### Alterar a tarefa existente: Preparar a inscrição no INSS

**ID actual:** `b04-a03-t03`.

- Manter a tarefa de preparação, distinguindo-a da inscrição no simulador.
- **Orientação proposta:** consultar os direitos e obrigações do contribuinte e os documentos e modelos disponibilizados pelo INSS, identificando os elementos necessários à inscrição.
- Acrescentar dois botões no diálogo de orientação:

| Botão | Destino | Abertura |
|---|---|---|
| Direitos e obrigações do contribuinte | [INSS — Direitos e obrigações](https://www.inss.gov.mz/direitos-e-obrigacoes-do-contribuinte/) | Novo separador |
| Documentos e modelos | [INSS — Documentos e modelos](https://www.inss.gov.mz/documentos-modelo/) | Novo separador |

#### Nova tarefa: Inscrever no INSS

- **Objectivo proposto:** realizar a inscrição da empresa no módulo simulado do INSS, utilizando os elementos preparados na tarefa anterior.
- **Tipo proposto:** operação no simulador.
- **Botão:** «Aceder ao INSS no simulador».
- **Destino:** [INSS — Simulador](https://speedev.simulacao.co.mz/servicos/1/INSS/inss.aspx?hasEmpresa=1).
- **Abertura:** novo separador.
- **Posição proposta:** depois de «Preparar a inscrição no INSS» e antes de «Gerar e arquivar a relação nominal».
- A criação de uma dependência obrigatória entre preparação e inscrição fica por validar; a posição na lista não constitui, por si só, um bloqueio.

### 4.2. Actividade: Preparar as operações bancárias

#### Nova tarefa: Consultar documentos e regras bancárias

Designação abreviada nas anotações: «Documentos e Regras».

- **Objectivo proposto:** consultar a informação disponibilizada pelo BCI sobre abertura de conta e identificar os documentos e condições aplicáveis ao exercício.
- **Tipo proposto:** consulta de página externa.
- **Botão:** «Consultar documentos e regras — BCI».
- **Destino:** [BCI — Abrir uma conta](https://www.bci.co.mz/bci-universal/abrir-uma-conta/).
- **Abertura:** novo separador.
- **Posição proposta:** no início desta actividade.
- **Nota de coerência:** a tarefa «Abrir a conta bancária» já existe no bloco anterior, em «Celebrar contratos de serviços». Mantém-se nesta proposta, conforme a localização indicada nas anotações; confirmar se a consulta documental deverá também ser disponibilizada nessa tarefa anterior, como preparação para abrir a conta.

#### Nova tarefa: Aceder à banca electrónica

Designação nas anotações: «Aceder ao ebanking».

- **Objectivo proposto:** aceder ao módulo de banca do simulador e conhecer o ambiente utilizado nas operações bancárias da empresa.
- **Tipo proposto:** operação no simulador.
- **Botão:** «Aceder à banca electrónica».
- **Destino:** [Banca — Simulador](https://speedev.simulacao.co.mz/servicos/1/Banca/index.html?hasEmpresa=1).
- **Abertura:** novo separador.
- **Posição proposta:** depois da consulta dos documentos e regras.
- Preservar as tarefas existentes «Arquivar os comprovativos dos encargos iniciais» e «Simular o pedido de financiamento».

### 4.3. Actividade: Configurar a gestão comercial

**Alterar a tarefa existente: Actualizar o perfil comercial**
**ID actual:** `b04-a02-t01`.

- Manter a designação e acrescentar o acesso ao ERP no diálogo de orientação.
- **Orientação proposta:** aceder ao ERP e actualizar o perfil comercial da empresa, verificando os dados relevantes para as operações de compra e venda.
- **Botão:** «Aceder ao ERP».
- **Destino:** [ERP — Página de acesso](https://erp.ncsoftware.co.mz/login).
- **Abertura:** novo separador.
- O endereço fornecido é uma página de autenticação; a ligação não é apresentada como acesso directo ao formulário de edição do perfil.

## 5. Inventário das alterações

| N.º | Bloco | Actividade | Tarefa | Natureza |
|---|---|---|---|---|
| 1 | Ideação | Encontrar uma ideia de negócio | Conhecer as empresas do mercado | Nova tarefa |
| 2 | Criação de empresas | Constituição legal da empresa | Consultar o portal do BAU | Substituir ligação existente |
| 3 | Criação de empresas | Celebrar contratos de serviços | Contratar fornecedores | Renomear tarefa e acrescentar quatro botões |
| 4 | Início de actividades | Configurar os recursos humanos | Preparar a inscrição no INSS | Acrescentar dois botões |
| 5 | Início de actividades | Configurar os recursos humanos | Inscrever no INSS | Nova tarefa |
| 6 | Início de actividades | Preparar as operações bancárias | Consultar documentos e regras bancárias | Nova tarefa |
| 7 | Início de actividades | Preparar as operações bancárias | Aceder à banca electrónica | Nova tarefa |
| 8 | Início de actividades | Configurar a gestão comercial | Actualizar o perfil comercial | Acrescentar ligação ao ERP |

Se estas quatro adições forem aprovadas sem outras alterações, o roteiro passará de **48 para 52 tarefas**, mantendo as **15 actividades** actualmente definidas. Esta contagem pressupõe que os quatro acessos a fornecedores continuam integrados numa única tarefa.

## 6. Comportamento comum a implementar

1. Abrir todas as ligações num novo separador e indicar esse comportamento no texto acessível do botão.
2. Preservar integralmente os parâmetros dos endereços fornecidos.
3. Apresentar recursos múltiplos como botões separados dentro da orientação da tarefa.
4. Não concluir automaticamente tarefas por abrir um endereço externo. O protótipo não consegue confirmar, apenas pelo clique, que um contrato, uma inscrição ou uma alteração no ERP foi efectivamente realizada.
5. Manter o mecanismo de confirmação local do protótipo até ser definida a integração com o simulador.
6. Preservar os IDs das tarefas modificadas e atribuir IDs novos e estáveis às tarefas acrescentadas.
7. Reflectir o mesmo roteiro nos painéis do estudante e do docente, bem como nas orientações do coach, preservando os dados das duas empresas de exemplo.
8. Actualizar os PRDs e documentar a migração dos cenários guardados. Não repor mensagens, evidências ou conclusões existentes para introduzir estas alterações.

## 7. Decisões a validar antes da implementação

- **Âmbito da renomeação:** confirmar «Contratar fornecedores» como novo nome da tarefa; se a intenção for renomear a actividade inteira, ajustar também a sua apresentação e o enquadramento de «Abrir a conta bancária».
- **Critérios das tarefas novas:** definir quais são obrigatórias e como se confirma a sua conclusão; abrir uma página não é um critério suficiente para comprovar uma operação externa.
- **Sequência e dependências:** validar as posições propostas, em particular a relação entre consulta de documentos bancários e abertura de conta no bloco anterior.
- **Cenários já guardados:** decidir quais das novas tarefas estarão concluídas na empresa que já avançou no roteiro. Não atribuir conclusões retroactivas sem uma decisão explícita; a empresa que acabou de iniciar mantém as novas tarefas por realizar.

**Âmbito desta entrega:** análise e organização das alterações. O código, os fixtures e os PRDs vigentes ainda não foram alterados por esta proposta.
