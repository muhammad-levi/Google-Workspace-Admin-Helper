function doSomeThingsBeforeGMailMigration(userEmail, targetEmail) {
  reactivateIfSuspended_(userEmail);

  handleAliases_(userEmail);

  const service = getOAuthService_(userEmail);
  enableIMAPForUser_(userEmail, service);

  handleLabelsShowOnIMAP_(service);

  emailReportsDMS_();

  addUserToDMS_(userEmail, targetEmail)
}

/**
* Need to be done manually (cannot be programmatically, as of 2023/06/27) for:
    0. Disable Login Challenge for 10 minutes, because it is interfering with DMS
*   1. Export saved passwords from the Google Password Manager (if any). @see https://passwords.google.com/u/0/options
*   2. Delete user (use Super Admin account, to simultaneously transfer data: Calendar, Drive, etc)
*/
