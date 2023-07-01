function processScheduledSuspensions() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('spreadsheetIdScheduleSuspend'); // Replace with your Google Sheet ID
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetNameScheduleSuspend'); // Replace with the name of the sheet you're using

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const now = new Date();

  const statusColumnIndex = 3; // Index of the Status column
  const newPasswordColumnIndex = 4; // Index of the New Password column

  dataValues.forEach(function (row, rowIndex) {
    const suspendDateTime = new Date(row[1]);
    const status = row[2];

    if (status === "Scheduled" && suspendDateTime <= now) {
      const email = row[0];
      const user = AdminDirectory.Users.get(email);
      const rowToUpdate = rowIndex + 1; // Adjust the row index to account for header row

      if (!user.suspended) {
        // Reset password
        const newPassword = generateNewPassword_();

        const newPasswordCell = sheet.getRange(rowToUpdate, newPasswordColumnIndex);
        newPasswordCell.setValue(newPassword);

        user.password = newPassword;
        user.changePasswordAtNextLogin = false;
        user.suspended = true;

        AdminDirectory.Users.update(user, email);

        Logger.info('User ' + email + ' has been suspended.');
      } else {
        Logger.info('User ' + email + ' was already suspended.');
      }

      const statusCell = sheet.getRange(rowToUpdate, statusColumnIndex);
      statusCell.setValue("Suspended");
    }
  });
}

function generateNewPassword_() {
  const length = 50; // Desired length of the generated password
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

  let newPassword = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newPassword += characters.charAt(randomIndex);
  }

  return newPassword;
}
