// Suggest time-driven trigger of "every 5 minutes"
function scheduleMigratingGMailOfSuspendedAccount() {
  const targetEmail = PropertiesService.getScriptProperties().getProperty('archiveEmail');
  const { isDMSCompletedForTargetEmail, lastUserEmail } = checkWhetherPreviousDMSEntryHasCompleted_(targetEmail);

  if (isDMSCompletedForTargetEmail) {
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdScheduleSuspend'); // Replace with your Google Sheet ID
    const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameScheduleSuspend'); // Replace with the name of the sheet you're using

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    const dataRange = sheet.getDataRange();
    const dataValues = dataRange.getValues();

    const statusColumnIndex = 3; // Index of the Status column

    if (lastUserEmail) {
      const indexOfEntryGMailMigrationJustComplete = dataValues.findIndex((row) => {
        const email = row[0];
        return email === lastUserEmail;
      });

      const rowToUpdate = indexOfEntryGMailMigrationJustComplete + 1; // Adjust the row index to account for header row
      const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
      statusCell.setValue(USER_STATUS.GMAIL_ARCHIVED);

      resuspend_(lastUserEmail);
    }

    const firstEntryWithStatusIsSuspended = dataValues.find((row) => {
      const status = row[2];
      return status === USER_STATUS.SUSPENDED;
    });

    if (firstEntryWithStatusIsSuspended) {
      const indexOfFirstEntryWithStatusIsSuspended = dataValues.findIndex((row) => {
        const status = row[2];
        return status === USER_STATUS.SUSPENDED;
      });

      const rowToUpdate = indexOfFirstEntryWithStatusIsSuspended + 1; // Adjust the row index to account for header row
      const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
      statusCell.setValue(USER_STATUS.MIGRATING_GMAIL);

      const userEmail = firstEntryWithStatusIsSuspended[0];
      doSomeThingsBeforeGMailMigration(userEmail, targetEmail);
    }
  }
}

function checkWhetherPreviousDMSEntryHasCompleted_(targetEmail) {
  const responseBody = getDMSProgresses_(); // API get DMS progresses

  if (responseBody) {
    // Find the entry that contains "${targetEmail}"
    const startIndex = responseBody.indexOf(targetEmail);
    const endIndex = responseBody.lastIndexOf("]]]]");

    if (startIndex === -1 || endIndex === -1) {
      // The cookie might be expired or another unknown error, debug the API call get DMS progresses
      const errorMessage = `The cookie is possibly expired... Renew the cookie, get a new one in the DMS page. Response: ${responseBody}`;
      Logger.log(errorMessage);
      throw new Error(errorMessage);
    } else {
      const entryString = responseBody.substring(startIndex - 3, endIndex + 1).replaceAll('\\"', '"');

      // Parsing the input string into an array
      const parsedArray = JSON.parse(`[${entryString}]`);

      // Extracting the desired value using destructuring assignment
      const [[, lastUserEmail], [, , , completionPercentage]] = parsedArray;

      if (completionPercentage === 100) {
        return { isDMSCompletedForTargetEmail: true, lastUserEmail: lastUserEmail };
      } else {
        return { isDMSCompletedForTargetEmail: false, lastUserEmail: lastUserEmail };
      }
    }
  } else {
    Logger.log('Encountered an error in the responseBody of API Get DMS Progresses.');
  }
}

function getDMSProgresses_() {
  const url = PropertiesService.getScriptProperties().getProperty('urlGetDMSProgresses');

  const options = {
    headers: {
      "cookie": PropertiesService.getScriptProperties().getProperty('cookieDMS'),
    },
    payload: PropertiesService.getScriptProperties().getProperty('bodyGetDMSProgresses'),
    method: "POST",
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseBody = response.getContentText();
  const statusCode = response.getResponseCode();

  if (statusCode === 200) {
    Logger.info(`Successfully retrieved DMS progresses.`);
  } else {
    const errorMessage = `Failed to retrieve DMS progresses. Status code: ${statusCode}, Response: ${responseBody}`;
    Logger.log(errorMessage);
  }

  return responseBody;
}
