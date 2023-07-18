function enableIMAPForUser_(userEmail, service) {
  const imapSettings = {
    enabled: true,
    autoExpunge: true,
    maxFolderSize: 0
  };

  if (service.hasAccess()) {
    const url = `https://www.googleapis.com/gmail/v1/users/${encodeURIComponent('me')}/settings/imap`;
    const headers = {
      Authorization: `Bearer ${service.getAccessToken()}`
    };
    const options = {
      method: 'PUT',
      headers: headers,
      contentType: 'application/json',
      payload: JSON.stringify(imapSettings)
    };

    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();

    if (statusCode === 200) {
      Logger.info(`IMAP access enabled successfully for user ${userEmail}.`);
    } else {
      const errorMessage = `Failed to enable IMAP access. Status code: ${statusCode}, Response: ${response.getContentText()}`;
      Logger.log(errorMessage);
    }
  } else {
    Logger.log(service.getLastError());
  }
}
