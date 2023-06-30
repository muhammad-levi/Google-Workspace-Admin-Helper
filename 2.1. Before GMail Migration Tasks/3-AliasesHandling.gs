function getAllAliases(userEmail) {
  const response = AdminDirectory.Users.Aliases.list(userEmail);
  if (response.aliases) {
    return response.aliases.map(userAlias => userAlias.alias);
  } else {
    return null;
  }
}

function handleAliases(userEmail) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdAliases'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameAliases'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const aliases = getAllAliases(userEmail); // Get all aliases for the user, will return `null` if the user has no alias
  if (aliases) {
    sheet.appendRow([userEmail, aliases.join(', '), 'Next Up']);
    Logger.info(`Aliases for user ${userEmail}:\n${aliases}`);
  } else {
    sheet.appendRow([userEmail, aliases, 'Ignored']);
    Logger.info(`No aliases for user ${userEmail}.`);
  }
}
