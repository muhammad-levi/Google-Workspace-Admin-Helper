function getOAuthService_(userEmail) {
  const credentials = JSON.parse(PropertiesService.getScriptProperties().getProperty("credentials"));
  const scopes = 'https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/drive';
  return getService_(credentials, userEmail, scopes);
}

/**
 * Configures the service.
 */
function getService_(credentials, userEmail, scopes) {
  return OAuth2.createService("GMail (Impersonation / Domain-wide Delegation)")
    // Set the endpoint URL.
    .setTokenUrl(credentials.token_uri)

    // Set the private key and issuer.
    .setPrivateKey(credentials.private_key)
    .setIssuer(credentials.client_email)

    // Set the name of the user to impersonate. This will only work for
    // Google Apps for Work/EDU accounts whose admin has setup domain-wide
    // delegation:
    // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
    .setSubject(userEmail)

    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getScriptProperties())

    // Set the scopes to request (space-separated for Google services).
    // This must match one of the scopes configured during the
    // setup of domain-wide delegation.
    .setScope(scopes);
}
