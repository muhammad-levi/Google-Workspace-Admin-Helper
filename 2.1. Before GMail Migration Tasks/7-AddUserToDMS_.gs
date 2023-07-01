function addUserToDMS_(userEmail, targetEmail) {
  const userPassword = getUserPasswordFromSheet_(userEmail);

  const url = PropertiesService.getScriptProperties().getProperty('urlAddUserToDMS');

  const options = {
    headers: {
      "cookie": PropertiesService.getScriptProperties().getProperty('cookieDMS'),
    },
    payload: `f.req=%5B%5B%5B%22Ps0mJd%22%2C%22%5B%5C%2200leueii%5C%22%2C%5B%5B%5B%5C%22${encodeURIComponent(targetEmail)}%5C%22%2C%5C%22${encodeURIComponent(userEmail)}%5C%22%2C%5B%5B%5C%22${encodeURIComponent(userEmail)}%5C%22%2C%5C%22${encodeURIComponent(userPassword)}%5C%22%5D%5D%5D%5D%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AFDX2tPfTVJPzDyHS-YFisU49FAW%3A1687955803541&`,
    method: "POST"
  };

  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();

  if (statusCode === 200) {
    Logger.info(`Added user ${userEmail} into DMS for migrating its GMail data to ${targetEmail}.`);
  } else {
    const errorMessage = `Failed to add user into DMS. Status code: ${statusCode}, Response: ${response.getContentText()}`;
    Logger.error(errorMessage);
  }
}

function getUserPasswordFromSheet_(userEmail) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdScheduleSuspend'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameScheduleSuspend'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const row = dataValues.find((row) => {
    const email = row[0];
    return email === userEmail;
  });

  const theNewPassword = row[3];

  return theNewPassword;
}
