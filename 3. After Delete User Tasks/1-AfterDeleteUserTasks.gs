function doSomeThingsAfterDeleteUser(userEmail, targetEmail, folderOwnerEmail) {
  /*
  - [x]  Delete User, check transfer other data (Drive, etc) to target account address (usually archive@example.tld)
  */

  // Set alias to target user/group address
  afterDeleteUserAliasesHandling_(userEmail, targetEmail);

  // Set permissions in Drive folder of transferred folder to target user/group address
  afterDeleteUserSetDrivePermissions_(userEmail, targetEmail, folderOwnerEmail);

  // Set status to "User Deleted"
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdScheduleSuspend'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameScheduleSuspend'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const statusColumnIndex = 3; // Index of the Status column

  const indexOfUserEmailInTheSheet = dataValues.findIndex((row) => {
    const email = row[0];
    return email === userEmail;
  });

  const rowToUpdate = indexOfUserEmailInTheSheet + 1; // Adjust the row index to account for header row
  const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
  statusCell.setValue("User Deleted");
}
