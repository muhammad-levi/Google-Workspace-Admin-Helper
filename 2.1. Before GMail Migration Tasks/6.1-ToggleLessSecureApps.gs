/*
*   Actually, the Google Workspace Data Migration Service (DMS) tool should be enhanced
*   to use the domain-wide delegation service account when adding a user to be migrated (use impersonation).
*
*   The service account with client ID "955661971872-ie97v0ns6ndb19rbr9nlpkahpmfk9ugf.apps.googleusercontent.com"
*   was added when we do "Set Up Data Migration" in the Google Admin console.
*   @see https://support.google.com/a/answer/6003176?hl=en#zippy=%2Cmigrating-from-imap-gmail-or-a-google-workspace-account
*
*   Thus, we wouldn't need to "Allow Less Secure Apps" or "Disable Login challenge for the next 10 minutes" for the source account.
*   I will submit a feature idea to improve Workspace productivity and collaboration tools.
*/
