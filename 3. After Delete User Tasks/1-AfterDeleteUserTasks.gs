function doSomeThingsAfterDeleteUser(userEmail, targetEmail, folderOwnerEmail) {
  /*
  - [x]  Delete User, check transfer other data (Drive, etc) to target account address (usually archive@example.tld)
  */

  // Set alias to target user/group address
  afterDeleteUserAliasesHandling(userEmail, targetEmail);

  // Set permissions in Drive folder of transferred folder to target user/group address
  afterDeleteUserSetDrivePermissions(userEmail, targetEmail, folderOwnerEmail);
}
