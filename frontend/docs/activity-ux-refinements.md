# Refinamentos da experiência de actividade

- A entrada no Mission Control do docente ou do estudante apresenta uma introdução específica do perfil antes de navegar. O acesso ao SPEE Studio permanece independente.
- As pré-visualizações de notificações identificam a actividade da mensagem. Na página da actividade, os três cartões ficam na mesma linha em desktop e empilhados em ecrãs pequenos.
- Os cartões de contexto oferecem Ver, Continuar actividade ou Iniciar actividade conforme o estado. Actividades bloqueadas permitem apenas consulta. Apenas o registo da empresa tem execução funcional nesta fase; as restantes acções abrem o respectivo detalhe, sem confirmar progresso.
- A actividade de registo inclui participantes fictícios e contribuições descritivas, explicitamente assinalados como dados simulados. A definição de participação real continua pendente da integração; não se calculam métricas de participação. O adaptador acrescenta estes metadados quando ausentes em cenários antigos, sem substituir dados existentes.
- Materiais de apoio utiliza `details/summary` nativo, fechado por defeito e acessível por teclado, sem nova dependência. O cabeçalho mostra ícones, formatos e contagens derivados dos materiais existentes; formatos sem materiais não aparecem. O estado vazio tem indicação própria.
- As features continuam independentes do shell. A introdução e os materiais têm stories isoladas, incluindo formatos mistos e ausência de materiais.
