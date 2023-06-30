/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  const userEmail = 'someone@example.tld';
  getOAuthService_(userEmail).reset();
}
