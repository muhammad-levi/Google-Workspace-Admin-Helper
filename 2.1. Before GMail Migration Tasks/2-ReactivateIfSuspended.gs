function reactivateIfSuspended(userEmail) {
  const user = AdminDirectory.Users.get(userEmail);
  if (user.suspended) {
    user.suspended = false;
    AdminDirectory.Users.update(user, userEmail);
    Logger.info('User ' + userEmail + ' has been reactivated.');
  } else {
    Logger.info('User ' + userEmail + ' was already reactivated.');
  }
}
