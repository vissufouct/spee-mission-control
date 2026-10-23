/**
 * Cria um Google Form para inscrição/manifestação de interesse no workshop online
 * com estudantes sobre o SPEE.
 *
 * Como usar:
 * 1. Aceda a https://script.google.com/
 * 2. Crie um novo projecto.
 * 3. Cole este código no ficheiro Code.gs.
 * 4. Execute a função criarFormularioInscricaoWorkshopSPEE.
 * 5. Autorize o acesso quando solicitado.
 * 6. Consulte os URLs no registo de execução: Ver > Registos.
 */
function criarFormularioInscricaoWorkshopSPEE() {
  var titulo = 'Formulário de Inscrição - Workshop Online com Estudantes sobre o SPEE';

  var descricao = [
    'Este formulário destina-se a recolher manifestações de interesse de estudantes que estejam disponíveis para participar num workshop online sobre o uso do simulador empresarial SPEE.',
    '',
    'O workshop tem como objectivo compreender melhor a experiência dos estudantes, validar constatações da análise do helpdesk e identificar soluções de apoio mais úteis, claras e adequadas às necessidades dos estudantes.',
    '',
    'A sessão será realizada online numa das seguintes datas propostas, sempre às 17h30, com duração aproximada de 1 hora:',
    '',
    '- 24 de Julho de 2026, às 17h30;',
    '- 30 de Julho de 2026, às 17h30.',
    '',
    'A participação não é avaliativa. As contribuições serão tratadas de forma agregada e usadas apenas para melhorar o SPEE e o apoio prestado aos estudantes.'
  ].join('\n');

  var form = FormApp.create(titulo)
    .setTitle(titulo)
    .setDescription(descricao)
    .setConfirmationMessage(
      'Obrigado pela sua manifestação de interesse. A equipa entrará em contacto com os estudantes seleccionados para confirmar a participação e enviar as informações de acesso à sessão online.'
    )
    .setAllowResponseEdits(false)
    .setAcceptingResponses(true);

  form.addSectionHeaderItem()
    .setTitle('Dados do estudante')
    .setHelpText('Preencha os dados de contacto para que a equipa possa confirmar a sua participação.');

  form.addTextItem()
    .setTitle('Nome completo')
    .setRequired(true);

  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText('Indique um endereço de email válido.')
    .build();

  form.addTextItem()
    .setTitle('Email')
    .setRequired(true)
    .setValidation(emailValidation);

  form.addTextItem()
    .setTitle('Telefone / WhatsApp')
    .setHelpText('Indique o contacto telefónico que a equipa poderá usar para confirmação, se necessário.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Instituição onde fez o curso')
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Disponibilidade')
    .setHelpText('Indique se poderá participar numa ou em ambas as datas propostas.');

  form.addMultipleChoiceItem()
    .setTitle('Indique a sua disponibilidade para participar no workshop online.')
    .setChoiceValues([
      'Tenho disponibilidade no dia 24 de Julho de 2026, às 17h30.',
      'Tenho disponibilidade no dia 30 de Julho de 2026, às 17h30.',
      'Tenho disponibilidade nas duas datas.',
      'Tenho interesse, mas preciso de confirmar.',
      'Não tenho disponibilidade em nenhuma das datas propostas.'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Caso tenha interesse, mas precise de confirmar, ou queira deixar alguma observação sobre disponibilidade, indique aqui.')
    .setHelpText('Campo opcional.')
    .setRequired(false);

  form.addSectionHeaderItem()
    .setTitle('Consentimento')
    .setHelpText('Os dados recolhidos serão usados apenas para organização do workshop.');

  form.addMultipleChoiceItem()
    .setTitle('Autoriza que os seus dados de contacto sejam usados apenas para organização deste workshop e envio do respectivo link de acesso?')
    .setChoiceValues([
      'Sim, autorizo.',
      'Não autorizo.'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Confirma que compreende que a participação é voluntária e que as contribuições serão analisadas de forma agregada, sem avaliação individual?')
    .setChoiceValues([
      'Sim, confirmo.',
      'Não confirmo.'
    ])
    .setRequired(true);

  var spreadsheet = SpreadsheetApp.create('Respostas - Inscrição Workshop SPEE - Julho 2026');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  Logger.log('Formulário criado com sucesso.');
  Logger.log('URL para editar o formulário: ' + form.getEditUrl());
  Logger.log('URL para enviar aos estudantes: ' + form.getPublishedUrl());
  Logger.log('Folha de respostas: ' + spreadsheet.getUrl());

  return {
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    responsesSpreadsheetUrl: spreadsheet.getUrl()
  };
}
