const USER_STATUS = Object.freeze({
  SCHEDULED: 'Scheduled',
  SUSPENDED: 'Suspended',
  MIGRATING_GMAIL: 'Migrating GMail',
  GMAIL_ARCHIVED: 'GMail Archived',
  USER_DELETED: 'User Deleted',
});

const ALIASES_STATUS = Object.freeze({
  NEXT_UP: 'Next Up',
  COMPLETED: 'Completed',
  IGNORED: 'Ignored',
});

const EMAIL_TYPE = Object.freeze({
  GROUP: 'Group',
  USER: 'User',
  UNKNOWN: 'Unknown',
});

const EXPORT_GOOGLE_PASSWORDS_STATUS = Object.freeze({
  NOT_DONE: 'Not Done',
  DONE: 'Done',
  NO_PASSWORDS_STORED: 'No Passwords Stored',
});
