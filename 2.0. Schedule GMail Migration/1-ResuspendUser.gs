function resuspend_(userEmail) {
  const user = AdminDirectory.Users.get(userEmail);
  if (!user.suspended) {
    user.suspended = true;
    AdminDirectory.Users.update(user, userEmail);
    Logger.info('User ' + userEmail + ' has been suspended.');
  } else {
    Logger.info('User ' + userEmail + ' was already suspended.');
  }
  // TODO if allow less secure apps is implemented, turn it off here
}
