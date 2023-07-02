function debugDoSomeThingsAfterDeleteUser() {
  const userEmail = 'someone@example.tld'
  const targetEmail = 'higher-ups@example.tld';
  const folderOwnerEmail = 'archive@example.tld';

  doSomeThingsAfterDeleteUser(userEmail, targetEmail, folderOwnerEmail);
}
