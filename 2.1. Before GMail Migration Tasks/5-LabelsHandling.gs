function handleLabelsShowOnIMAP_(service) {
  const labelsID = getAllLabelsID_(service); // Get all labels for the user
  enableShowOnIMAP_(labelsID, service); // Enable "Show on IMAP" for each label
}

function getAllLabelsID_(service) {
  if (service.hasAccess()) {
    const url = `https://www.googleapis.com/gmail/v1/users/${encodeURIComponent('me')}/labels`;
    const headers = {
      Authorization: `Bearer ${service.getAccessToken()}`
    };
    const options = {
      method: 'GET',
      headers: headers
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    const labelsID = result.labels
      .filter(label =>
        (label.type === 'user') ||
        (label.id !== 'CATEGORY_FORUMS' &&
          label.id !== 'CATEGORY_UPDATES' &&
          label.id !== 'CATEGORY_PERSONAL' &&
          label.id !== 'CATEGORY_PROMOTIONS' &&
          label.id !== 'CATEGORY_SOCIAL' &&
          label.id !== 'CHAT' &&
          label.id !== 'INBOX' &&
          label.id !== 'DRAFT' &&
          label.id !== 'STARRED' &&
          label.id !== 'UNREAD' &&
          label.id !== 'SENT'
        )
      )
      .map(label => label.id);
    return labelsID;
  } else {
    Logger.error(service.getLastError());
  }
}

function enableShowOnIMAP_(labelsID, service) {
  if (service.hasAccess()) {
    labelsID.forEach(labelID => {
      const url = `https://www.googleapis.com/gmail/v1/users/me/labels/${encodeURIComponent(labelID)}`;
      const headers = {
        Authorization: `Bearer ${service.getAccessToken()}`,
        'Content-Type': 'application/json'
      };
      const options = {
        method: 'PATCH',
        headers: headers,
        payload: JSON.stringify({ showInIMAP: true })
      };

      const response = UrlFetchApp.fetch(url, options);
      const statusCode = response.getResponseCode();
      if (statusCode === 200) {
        Logger.log(`"Show on IMAP" enabled for label ${labelID}`);
      } else {
        const errorMessage = `Failed to enable "Show on IMAP" for label ${labelID}. Status code: ${statusCode}, Response: ${response.getContentText()}`;
        Logger.error(errorMessage);
      }
    });
  } else {
    Logger.error(service.getLastError());
  }
}
