// Suggest time-driven trigger of "every 5 minutes"
function checkDeletionEmails() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdScheduleSuspend'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameScheduleSuspend'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const statusColumnIndex = 3; // Index of the Status column

  const safeToDeleteEmails = getSafeToDeleteEmails_(sheet);

  if (safeToDeleteEmails && safeToDeleteEmails.length > 0) {
    const query = 'in:inbox from:(workspace-noreply@google.com) subject:(Your deletion of * from Google Workspace was successful) ' +
      '{"' + safeToDeleteEmails.join('" "') + '"}';
    const threads = GmailApp.search(query);

    threads.forEach(thread => {
      const messages = thread.getMessages();

      messages.forEach(message => {
        const body = message.getPlainBody();

        // Extract user email from the body
        const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
        const extractedEmails = body.match(emailRegex);

        if (extractedEmails && extractedEmails.length > 1) {
          const userEmail = extractedEmails[1];
          updateUserStatusByEmail_(userEmail, sheet, statusColumnIndex, USER_STATUS.USER_DELETED);
          Logger.info('Status updated to "' + USER_STATUS.USER_DELETED + '" for: ' + userEmail);
        }
      });
    });
  }
}

function getSafeToDeleteEmails_(sheet) {
  return sheet.getDataRange().getValues()
    .filter(row => {
      const status = row[2];
      const statusExportGooglePasswords = row[4];
      return status === USER_STATUS.GMAIL_ARCHIVED &&
        (statusExportGooglePasswords === EXPORT_GOOGLE_PASSWORDS_STATUS.DONE ||
          statusExportGooglePasswords === EXPORT_GOOGLE_PASSWORDS_STATUS.NO_PASSWORDS_STORED);
    })
    .flatMap(row => {
      const email = row[0];
      return email;
    });
}

function updateUserStatusByEmail_(userEmail, sheet, statusColumnIndex, userStatus) {
  const dataValues = sheet.getDataRange().getValues();

  const indexOfFirstEntryFindByEmail = dataValues.findIndex((row) => {
    const email = row[0];
    return email === userEmail;
  });

  const rowToUpdate = indexOfFirstEntryFindByEmail + 1; // Adjust the row index to account for header row
  const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
  statusCell.setValue(userStatus);
}
