function afterDeleteUserAliasesHandling_(userEmail, targetEmail) {
  const emailType = checkTargetEmailType_(targetEmail);

  insertAlias_(userEmail, targetEmail, emailType);

  const aliasesFromSheet = getAliasesFromSheet_(userEmail);
  if (aliasesFromSheet) {
    aliasesFromSheet.forEach(alias => insertAlias_(alias, targetEmail, emailType));
  }
}

function insertAlias_(userEmail, targetEmail, emailType) {
  // Set alias for target user/group address
  const requestBodyAlias = {
    alias: userEmail,
    primaryEmail: targetEmail
  };

  let responseAlias = {};
  if (emailType === EMAIL_TYPE.USER) {
    responseAlias = AdminDirectory.Users.Aliases.insert(requestBodyAlias, targetEmail);
  } else if (emailType === EMAIL_TYPE.GROUP) {
    responseAlias = AdminDirectory.Groups.Aliases.insert(requestBodyAlias, targetEmail);
  } else {
    Logger.error(`Unknown email type of ${targetEmail}`);
  }

  Logger.info(`Alias ${responseAlias.alias} inserted for ${responseAlias.primaryEmail} successfully. ID: ${responseAlias.id}`);
}

function getAliasesFromSheet_(userEmail) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdAliases'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameAliases'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const statusColumnIndex = 3; // Index of the Status column

  const aliasesRow = dataValues.findLast((row) => {
    const email = row[0];
    const aliasesCSV = row[1];
    const status = row[2];
    return email === userEmail && aliasesCSV && status === ALIASES_STATUS.NEXT_UP;
  });
  if (aliasesRow) {
    const aliasesCSV = aliasesRow[1];

    const aliasesRowIndex = dataValues.findLastIndex((row) => {
      const email = row[0];
      const aliasesCSV = row[1];
      const status = row[2];
      return email === userEmail && aliasesCSV && status === ALIASES_STATUS.NEXT_UP;
    });

    const rowToUpdate = aliasesRowIndex + 1; // Adjust the row index to account for header row
    const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
    statusCell.setValue(ALIASES_STATUS.COMPLETED);

    return aliasesCSV.split(', ');
  } else {
    return null;
  }
}

function checkTargetEmailType_(targetEmail) {
  let emailType = "";

  try {
    const user = AdminDirectory.Users.get(targetEmail);
    emailType = EMAIL_TYPE.USER;
  } catch (error) {
    try {
      const group = AdminDirectory.Groups.get(targetEmail);
      emailType = EMAIL_TYPE.GROUP;
    } catch (error) {
      emailType = EMAIL_TYPE.UNKNOWN;
    }
  }

  return emailType;
}
