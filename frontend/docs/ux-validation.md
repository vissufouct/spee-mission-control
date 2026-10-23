# Verificação da primeira experiência — 22 de Outubro de 2026

Registo histórico da iteração do estudante. Para os resultados actuais conjuntos (35 testes unitários e 16 E2E), consultar a [validação do docente](teacher-validation.md).

Esta é uma verificação técnica e visual inicial. **Não substitui validação de UX com estudantes e docentes**, nem aprova as regras pedagógicas ou a arquitectura de backend.

## Resultado

| Verificação | Resultado observado |
| --- | --- |
| TypeScript estrito | Passou |
| ESLint | Passou, sem erros |
| Fronteiras de imports e dados | Passaram; casos de violação têm testes |
| Vitest | 20 testes passaram: repository, invariantes, fronteiras e contraste do azul de acção |
| Playwright | 8 testes passaram no Chromium; também executados com Google Chrome durante a revisão |
| Build da aplicação | Passou |
| Build do Storybook | Passou; 15 stories |
| Isolamento do template | Percurso renderizado e testado no Storybook sem AppShell e sem gravação no localStorage da aplicação |
| Responsividade | Computador a 1608 × 978, telemóvel a 390 × 844 e componente isolado a 1200 × 900 |
| Erros JavaScript | Nenhum pageerror observado nos fluxos automatizados |

## Fluxos exercitados no browser

1. Abrir a actividade, fechar por Escape e devolver o foco ao botão de origem.
2. Editar, guardar, recarregar, validar NUIT, confirmar, consultar e descarregar o resultado.
3. Cancelar eliminação, eliminar um rascunho, criar outro incompleto e persistir após reload.
4. Avisar sobre alterações por guardar e permitir cancelar ou abandonar a navegação.
5. Exportar cenário, rejeitar JSON inválido sem apagar dados e importar um cenário válido.
6. Recuperar de JSON corrompido com reposição explicitamente confirmada.
7. Simular indisponibilidade de escrita e impedir falsa confirmação.
8. Percurso completo, menu móvel, ausência de overflow horizontal e componentes sem shell.

Guardar um rascunho não altera os 18% do cenário. Confirmar passa para 24% e actualiza o resumo de 1/4 para 2/4. O critério de preenchimento não aparece confirmado quando um rascunho está incompleto.

## Revisão visual

Foram revistas capturas da página principal, modal, formulário, resultado, vistas móveis e percurso isolado. Cores e agrupamento dos 13 módulos mantêm a referência do simulador. O azul de acção foi escurecido para aproximadamente 5,03:1 com texto branco. Isto verifica esse par de cores, não certifica conformidade global WCAG.

A revisão corrigiu o retorno de foco dos modais e a sobreposição do botão global de ajuda sobre o formulário móvel. Em mobile, a ajuda passa para o fim da página.

Capturas reproduzidas pelos testes e conservadas nesta pasta:

- [Meu Percurso](screenshots/meu-percurso.png)
- [Detalhe da actividade](screenshots/actividade.png)
- [Formulário](screenshots/formulario.png)
- [Resultado confirmado](screenshots/resultado.png)
- [Percurso móvel](screenshots/mobile.png)
- [Formulário móvel](screenshots/formulario-mobile.png)
- [Percurso sem AppShell](screenshots/percurso-sem-shell.png)

## Limites conhecidos

- Só o registo da empresa tem um fluxo operacional completo. Os outros módulos explicam que pertencem a iterações futuras.
- A ponderação de progresso, campos do formulário e comprovativo são dados/regras de demonstração, não validação jurídica ou pedagógica.
- Sem backend, autenticação, permissões reais, co-edição ou sincronização entre dispositivos.
- Testes E2E realizados no motor Chromium, não em Safari/Firefox ou aparelhos físicos.
- Os builds apresentam avisos não bloqueantes sobre chunks superiores a 500 kB; o Storybook também apresenta um aviso de depreciação de Node 26. Não foram ocultados. Optimização de distribuição fica para uma fase posterior.
- O Storybook demonstra estados e apresentação isolada; os fluxos de persistência são exercitados na aplicação pelos testes E2E.
- A aprovação humana da experiência, incluindo densidade e sequência das actividades, continua pendente.
