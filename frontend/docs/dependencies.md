# Dependências e referências

Foi inspeccionada a pasta antes da instalação: não existiam dependências JavaScript a reutilizar. O lockfile fixa as resoluções da primeira instalação.

| Grupo | Escolha e necessidade |
| --- | --- |
| UI | React + React DOM + TypeScript; componentes tipados e pequenos. |
| Desenvolvimento | Vite + plugin React; servidor estático de desenvolvimento, sem backend. |
| Estilos | Tailwind CSS + plugin Vite; tokens comuns e CSS local do shell/feature. |
| Primitivas | shadcn/ui adaptado localmente: Button e Dialog, Radix Slot/Dialog, CVA, clsx e tailwind-merge. Não foi instalada uma biblioteca de componentes completa. |
| Ícones | lucide-react, coerente com as referências e com importação por ícone. |
| Navegação | React Router 7, data router necessário à protecção de formulários por guardar. |
| Dados | TanStack Query 5 para estado assíncrono, erros e mutações; sem outra biblioteca global de estado. |
| Formulários | React Hook Form 7, Zod 4 e @hookform/resolvers 5.2.2. |
| Qualidade | ESLint, TypeScript estrito, Vitest, Playwright e Storybook React/Vite. |

Não foram adicionados bibliotecas de gráficos, backend, base de dados, ORM, biblioteca de datas, cliente HTTP, framework genérico de repositories ou biblioteca de estado adicional.

A tentativa de instalar a versão 6 do adaptador de formulários encontrou um conflito nas peer dependencies opcionais relacionadas com Effect. Foi seleccionada a série 5.2.2 compatível, sem `--force` ou `--legacy-peer-deps`. npm audit não encontrou vulnerabilidades na instalação verificada; isto não é uma garantia permanente.

Os componentes em `shared/components/ui` seguem o padrão de composição shadcn/ui (MIT) sobre Radix e ficam editáveis no projecto; `components.json` regista aliases e configuração.

## Documentação oficial consultada

- [Vite](https://vite.dev/guide/)
- [shadcn/ui com Vite](https://ui.shadcn.com/docs/installation/vite)
- [React Router](https://reactrouter.com/start/declarative/installation)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Storybook React/Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)

## Referências locais de produto

- `../../output/mission_control_unificado/PRD_00_Mission_Control_Comum.md`
- `../../output/mission_control_unificado/PRD_02_Mission_Control_Estudante.md`
- `../../output/mission_control_unificado/PRD_03_Decisoes_Pendentes.md`
- `../../output/mockups/estudante_v4/`
- `../../output/mockups/referencias/simulador_menu_2026-10-22.png`

A imagem unificada anteriormente rejeitada não foi usada. O azul das barras e os tons cinzentos/ciano conservam a referência; o azul dos botões foi ligeiramente escurecido para manter contraste superior a 4,5:1 com texto branco.
