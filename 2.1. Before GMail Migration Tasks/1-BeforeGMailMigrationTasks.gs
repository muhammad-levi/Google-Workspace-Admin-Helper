function doSomeThingsBeforeGMailMigration(userEmail, targetEmail) {
  reactivateIfSuspended(userEmail);

  handleAliases(userEmail);

  const service = getOAuthService_(userEmail);
  enableIMAPForUser(userEmail, service);

  handleLabelsShowOnIMAP(service);

  emailReportsDMS_();

  addUserToDMS_(userEmail, targetEmail)
}

/**
* Need to be done manually (cannot be programmatically, as of 2023/06/27) for:
*   1. Export saved passwords from the Google Password Manager (if any). @see https://passwords.google.com/u/0/options
*   2. Delete user (use Super Admin account, to simultaneously transfer data: Calendar, Drive, etc)
*/
