function afterDeleteUserSetDrivePermissions_(userEmail, targetEmail, folderOwnerEmail) {
  const service = getOAuthService_(folderOwnerEmail);

  if (service.hasAccess()) {
    const accessToken = service.getAccessToken();

    // Retrieve folder ID using service account's token
    const folderMetadataUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = '" + userEmail + "'")}&fields=files(id)`;
    const headers = {
      Authorization: 'Bearer ' + accessToken
    };

    const options = {
      method: 'GET',
      headers: headers
    };

    const response = UrlFetchApp.fetch(folderMetadataUrl, options);
    const folderMetadata = JSON.parse(response.getContentText());
    const folderId = folderMetadata.files[0].id;

    addEditorToDriveFolder_(folderId, accessToken, targetEmail)
  } else {
    Logger.error(service.getLastError());
  }
}

function addEditorToDriveFolder_(folderId, accessToken, targetEmail) {
  const emailType = checkTargetEmailType_(targetEmail);

  const permission = {
    role: 'writer',
    type: emailType.toLowerCase(),
    emailAddress: targetEmail
  };

  const apiUrl = `https://www.googleapis.com/drive/v3/files/${folderId}/permissions`;
  const headers = {
    Authorization: 'Bearer ' + accessToken,
    'Content-Type': 'application/json'
  };

  const options = {
    method: 'POST',
    headers: headers,
    payload: JSON.stringify(permission)
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  if (response.getResponseCode() === 200) {
    // Permission added successfully
    Logger.info(`Added ${targetEmail} as Editor in Drive folder ${folderId}.`);
  } else {
    // Error occurred
    Logger.error('Error adding permission: ' + response.getContentText());
  }
}
