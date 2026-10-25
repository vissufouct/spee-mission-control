# Editor visual de roteiro

## Âmbito

A feature `scenario-editor` transforma a folha de cálculo de referência num documento JSON editável no browser. Não cria API, base de dados ou escrita automática no ficheiro `.xlsx`. A importação inicial conserva a célula de origem de cada elemento e não infere ligações de precedência que a fonte não declara.

## Modelo

- `groups`: hierarquia de fases, sessões, actores e áreas auxiliares;
- `nodes`: actividades, objectivos, recursos e operações, com posição visual e proveniência;
- `dependencies`: arestas dirigidas de precedência, validadas contra ciclos;
- `labels`: etiquetas livres atribuíveis aos nós;
- `groupTagIds`: utilização de qualquer agrupamento como etiqueta, sem alterar a pertença hierárquica do nó;
- `versions`: cópias integrais e imutáveis do roteiro no momento em que o utilizador escolhe **Guardar versão**;
- `draft`: estado de trabalho persistido automaticamente no browser até ser guardado como nova versão.

## Persistência e transporte

O contrato `ScenarioRepository` é assíncrono e não conhece browser ou JSON. `JsonScenarioRepository` é o único adaptador que conhece `localStorage`, a chave de armazenamento e o formato de importação/exportação. O documento importado é validado antes da substituição. A futura API pode substituir este adaptador no ponto de composição.

## Independência do shell

O editor tem rota e layout próprios e não importa `AppShell`, header, sidebar ou navegação global. A story `Roteiro/Editor visual — SemAppShell` monta a experiência com os providers mínimos.
