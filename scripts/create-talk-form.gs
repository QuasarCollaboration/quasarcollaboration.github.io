/**
 * Creates the QUASAR talk-proposal Google Form and a response spreadsheet.
 *
 * Run this while signed in as quasarcollaboration@gmail.com so the form and
 * the responses belong to the collaboration account.
 *
 * How to run:
 * 1. Open https://script.google.com and create a new project.
 * 2. Replace the default code with this file.
 * 3. Select createTalkSubmissionForm and click Run.
 * 4. Approve the permissions prompt (Forms, Sheets, Gmail, and script settings).
 * 5. Open Executions or View > Logs. It prints the public form link, the
 *    edit link, and the spreadsheet link.
 *
 * Running it again will not make a second form. To rebuild, run
 * forgetStoredForm() first. That only clears the saved links in this project.
 * It does not delete the form or the spreadsheet in Drive.
 *
 * Talk length is a fixed choice of 15, 30, or 40 minutes. When someone would
 * like to present is a free-text comment, not a date list.
 */

var ORGANISER_EMAIL = 'quasarcollaboration@gmail.com';

var LENGTH_CHOICES = [
  '15 minutes',
  '30 minutes',
  '40 minutes'
];

function createTalkSubmissionForm() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('formId')) {
    throw new Error(
      'A form already exists.\nEdit: ' + props.getProperty('formEditUrl') +
      '\nPublic: ' + props.getProperty('formPublishedUrl') +
      '\nResponses: ' + props.getProperty('spreadsheetUrl') +
      '\n\nRun forgetStoredForm() before creating another one.'
    );
  }

  var form = FormApp.create('QUASAR talk proposal');
  form.setDescription(
    'Propose a talk for a QUASAR collaboration meeting.\n\n' +
    'Meetings are on the second Monday of each month, 1–2 pm AEST, usually on Zoom. ' +
    'Talks are 15, 30, or 40 minutes. 30 minutes is the usual length.\n\n' +
    'Sending this form does not book the slot. An organiser will email you to confirm a date.'
  );
  form.setConfirmationMessage(
    'Thanks, we have your proposal. A QUASAR organiser will email you to confirm a date. ' +
    'The slot is not booked until you hear back.'
  );
  form.setAllowResponseEdits(true);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(true);
  form.setAcceptingResponses(true);
  form.setPublishingSummary(false);

  addShortText(form, 'Your name', '', true);
  addEmail(form);

  var institution = form.addMultipleChoiceItem();
  institution.setTitle('Institution')
    .setChoices([
      institution.createChoice('University of Queensland'),
      institution.createChoice('Queensland University of Technology'),
      institution.createChoice('University of Southern Queensland')
    ])
    .showOtherOption(true)
    .setRequired(true);

  addMultipleChoice(form, 'Career stage', '', [
    'Undergraduate',
    'Honours or Masters',
    'PhD student',
    'Postdoctoral researcher',
    'Academic or staff'
  ], false);

  addShortText(form, 'Talk title', '', true);
  addParagraph(
    form,
    'Abstract',
    'A short paragraph is enough. We use this on the schedule once the talk is confirmed.',
    true
  );

  addMultipleChoice(
    form,
    'Talk length',
    'Choose one. 30 minutes is the usual length.',
    LENGTH_CHOICES,
    true
  );

  addMultipleChoice(form, 'How will you present?', '', [
    'from UQ',
    'from QUT',
    'from UniSQ',
    'Online Only'
  ], false);

  addParagraph(
    form,
    'When would you like to present?',
    'For example a month, "the next open meeting", or a few dates that suit you. Meetings are the second Monday of each month, 1–2 pm AEST.',
    true
  );

  addShortText(form, 'Co-speakers', 'Leave blank if you are speaking on your own.', false);
  addParagraph(
    form,
    'Anything else we should know?',
    'Accessibility needs, a preference for going earlier or later in the hour, or anything else.',
    false
  );

  var sheet = SpreadsheetApp.create('QUASAR talk submissions');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  ScriptApp.newTrigger('notifyOrganisers')
    .forForm(form)
    .onFormSubmit()
    .create();

  props.setProperties({
    formId: form.getId(),
    formPublishedUrl: form.getPublishedUrl(),
    formEditUrl: form.getEditUrl(),
    spreadsheetId: sheet.getId(),
    spreadsheetUrl: sheet.getUrl()
  });

  Logger.log('Public form: ' + form.getPublishedUrl());
  Logger.log('Edit form: ' + form.getEditUrl());
  Logger.log('Responses: ' + sheet.getUrl());
}

/** Prints the links saved by createTalkSubmissionForm. */
function showFormLinks() {
  var props = PropertiesService.getScriptProperties();
  Logger.log('Public form: ' + props.getProperty('formPublishedUrl'));
  Logger.log('Edit form: ' + props.getProperty('formEditUrl'));
  Logger.log('Responses: ' + props.getProperty('spreadsheetUrl'));
}

/**
 * Clears the saved links so createTalkSubmissionForm() can run again.
 * Does not delete the form or the spreadsheet.
 */
function forgetStoredForm() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  Logger.log('Saved form links cleared. The form and spreadsheet are still in Drive.');
}

/**
 * Emails the collaboration account when someone submits the form.
 * Installed automatically by createTalkSubmissionForm. Do not run this by hand.
 */
function notifyOrganisers(e) {
  var responses = e.response.getItemResponses();
  var lines = responses.map(function (item) {
    var answer = item.getResponse();
    var text = Array.isArray(answer) ? answer.join(', ') : String(answer);
    return item.getItem().getTitle() + ':\n' + text;
  });

  var title = answerFor(responses, 'Talk title');
  var name = answerFor(responses, 'Your name');
  var subject = 'QUASAR talk proposal';
  if (name && title) {
    subject += ': ' + name + ' — ' + title;
  }

  MailApp.sendEmail({
    to: ORGANISER_EMAIL,
    subject: subject,
    body: lines.join('\n\n') + '\n\nResponse spreadsheet:\n' +
      PropertiesService.getScriptProperties().getProperty('spreadsheetUrl')
  });
}

function answerFor(responses, title) {
  for (var i = 0; i < responses.length; i++) {
    if (responses[i].getItem().getTitle() === title) {
      return responses[i].getResponse();
    }
  }
  return '';
}

function addShortText(form, title, help, required) {
  var item = form.addTextItem();
  item.setTitle(title).setRequired(required);
  if (help) item.setHelpText(help);
  return item;
}

function addParagraph(form, title, help, required) {
  var item = form.addParagraphTextItem();
  item.setTitle(title).setRequired(required);
  if (help) item.setHelpText(help);
  return item;
}

function addEmail(form) {
  var item = form.addTextItem();
  item.setTitle('Email')
    .setHelpText('We use this to confirm the date.')
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsEmail()
        .setHelpText('Enter a valid email address.')
        .build()
    );
  return item;
}

function addMultipleChoice(form, title, help, values, required) {
  var item = form.addMultipleChoiceItem();
  item.setTitle(title).setChoiceValues(values).setRequired(required);
  if (help) item.setHelpText(help);
  return item;
}
