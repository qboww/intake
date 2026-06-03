/**
 * Email whitelist for authentication
 * Only these email addresses can access the application
 */
export const EMAIL_WHITELIST: string[] = [
  'zheka78527@gmail.com',
  'evhenii.sarancha@gmail.com',
  'dianalysenko2204@gmail.com',
];

/**
 * Check if an email is whitelisted
 */
export function isEmailWhitelisted(email: string | undefined): boolean {
  if (!email) return false;
  return EMAIL_WHITELIST.some((whitelistedEmail: string) =>
    email.toLowerCase() === whitelistedEmail.toLowerCase()
  );
}