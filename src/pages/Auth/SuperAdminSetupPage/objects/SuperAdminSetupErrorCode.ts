export enum SuperAdminSetupErrorCode {
  InvalidBootstrapKey = 'invalid_bootstrap_key',
  AlreadyInitialized = 'superadmin_already_initialized',
  PasswordTooShort = 'password_too_short',
  UsernameAlreadyRegistered = 'username_already_registered',
  DisplayNameRequired = 'display_name_required',
  UsernameRequired = 'username_required',
  BootstrapKeyNotConfigured = 'superadmin_bootstrap_key_not_configured',
}
