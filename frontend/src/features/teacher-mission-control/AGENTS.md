# Mission Control do Docente

Aplicar primeiro o AGENTS.md da raiz. Esta feature fornece conteúdo funcional; nunca importa app/shell, componentes do estudante ou dimensões do template.

## Fontes e limites

- Requisitos: output/mission_control_unificado/PRD_01_Mission_Control_Docente.md, PRD_00_Mission_Control_Comum.md e PRD_03_Decisoes_Pendentes.md.
- Referências visuais: série docente v3, três ecrãs em output/mockups/docente_v3/.
- Dados fictícios, prazos relativos à data fixa context.asOf. Não apresentar estes alertas como monitorização em tempo real.
- Progresso e participação exigem evidência; abrir páginas, preparar rascunhos ou registar orientações não conclui actividades.
- Colaboração pode envolver vários actores no mesmo evento. Nunca somar participações como eventos únicos; separar sistemas de pessoas e não ordenar pessoas pelo desempenho.

## Persistência e composição

TeacherRepository é a fronteira assíncrona. O provider recebe o repository; só o adaptador conhece JSON/armazenamento. Páginas, hooks e componentes não importam fixtures nem o adaptador concreto.

A Horizonte Verde é projectada a partir do repository do estudante por um adaptador de composição em app/providers. A ligação é injectada como função de leitura, não uma dependência entre features. Depois de mutações, invalidar a consulta: o retorno bruto persistido do docente não contém a projecção actual do estudante.

Os estados iniciais sem evento de origem são identificados como dados de cenário, sem inventar autoria humana. Os contratos completos de eventos/versionamento continuam pendentes.

## Orientações

Os pedidos de orientação são conversas simuladas no armazenamento local, associadas a empresa e actividade. Preservar mensagens e estados “aguarda docente”, “aguarda estudante” e “concluído”; responder ou concluir não altera actividades nem progresso. Uma integração futura substitui o repository sem reescrever os componentes.

Para orientações proactivas, permitir rascunhos da empresa e publicação imutável no cenário local, com motivo e confirmação. Orientações gerais destinam-se a todas ou várias turmas e exigem actividade ou tema. Preservar histórico de eliminação e não implementar envio externo, aprovação, alteração de estado ou substituição de trabalho do estudante sem autoridade adicional.

Verificar revisão antes da escrita. Erros de persistência nunca produzem falso sucesso. A auditoria local é demonstrativa, não inviolável.

## UX e testes

- Filtros ficam na URL e são preservados ao aprofundar/regressar. Alterações rápidas de query params devem ser síncronas e não repor o scroll.
- Tabelas têm deslocamento próprio; cabeçalhos e empresa ficam fixos na matriz. Rótulos acessíveis absolutos devem ficar contidos na região de scroll.
- Testar leitura, filtros AND, persistência, concorrência obsoleta, erro de armazenamento, confirmação, histórico e ligação estudante/docente.
- As três vistas de apresentação têm stories sem AppShell. Não enfraquecer esse teste.
- Executar check, build, build-storybook e test:e2e após alterações transversais; rever capturas depois da última alteração visual.
