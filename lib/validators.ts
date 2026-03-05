// Shared password strength validation
export function validatePasswordStrength(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "Must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must include an uppercase letter";
  if (!/[a-z]/.test(password)) return "Must include a lowercase letter";
  if (!/[0-9]/.test(password)) return "Must include a number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Must include a symbol";
  return undefined;
}
