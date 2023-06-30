function afterDeleteUserAliasesHandling(userEmail, targetEmail) {
  const emailType = checkTargetEmailType(targetEmail);

  insertAlias(userEmail, targetEmail, emailType);

  const aliasesFromSheet = getAliasesFromSheet(userEmail);
  aliasesFromSheet.forEach(alias => insertAlias(alias, targetEmail, emailType));
}

function insertAlias(userEmail, targetEmail, emailType) {
  // Set alias for target user/group address
  const requestBodyAlias = {
    alias: userEmail,
    primaryEmail: targetEmail
  };

  let responseAlias = {};
  if (emailType === 'User') {
    responseAlias = AdminDirectory.Users.Aliases.insert(requestBodyAlias, targetEmail);
  } else if (emailType === 'Group') {
    responseAlias = AdminDirectory.Groups.Aliases.insert(requestBodyAlias, targetEmail);
  } else {
    Logger.error(`Unknown email type of ${targetEmail}`);
  }

  Logger.info(`Alias ${responseAlias.alias} inserted for ${responseAlias.primaryEmail} successfully. ID: ${responseAlias.id}`);
}

function getAliasesFromSheet(userEmail) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdAliases'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameAliases'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const deduplicatedRange = dataRange.removeDuplicates();

  const dataValues = deduplicatedRange.getValues();

  const statusColumnIndex = 3; // Index of the Status column

  const aliases = dataValues
    .filter((row, rowIndex) => {
      const email = row[0];
      const aliasesCSV = row[1];
      const status = row[2];
      if (email === userEmail && aliasesCSV && status === 'Next Up') {
        const rowToUpdate = rowIndex + 1; // Adjust the row index to account for header row
        const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
        statusCell.setValue("Completed");
        return true;
      } else {
        return false;
      }
    })
    .flatMap((row) => {
      const aliasesCSV = row[1];
      return aliasesCSV.split(', ');
    });

  return aliases;
}

function checkTargetEmailType(targetEmail) {
  let emailType = "";

  try {
    const user = AdminDirectory.Users.get(targetEmail);
    emailType = "User";
  } catch (error) {
    try {
      const group = AdminDirectory.Groups.get(targetEmail);
      emailType = "Group";
    } catch (error) {
      emailType = "Unknown";
    }
  }

  return emailType;
}