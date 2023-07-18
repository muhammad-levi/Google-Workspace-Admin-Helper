function emailReportsDMS_() {
  const url = PropertiesService.getScriptProperties().getProperty('urlEmailReportsDMS');

  const options = {
    headers: {
      "cookie": PropertiesService.getScriptProperties().getProperty('cookieDMS'),
    },
    payload: PropertiesService.getScriptProperties().getProperty('bodyEmailReportsDMS'),
    method: "POST"
  };

  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();
  if (statusCode === 200) {
    Logger.info(`Emailed Data Migration reports to Super Admins and Source Role Account(s).`);
  } else {
    const errorMessage = `Failed to send email DMS reports. Status code: ${statusCode}, Response: ${response.getContentText()}`;
    Logger.log(errorMessage);
  }
}
