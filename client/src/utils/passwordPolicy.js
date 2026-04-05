export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 24

/** Strong: at least one uppercase, one lowercase, one digit */
export function isPasswordStrong(password) {
  if (!password || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

export function getPasswordPolicyErrors(password) {
  const errors = []
  if (!password) {
    errors.push(`Password is required`)
    return errors
  }
  if (password.length < PASSWORD_MIN) errors.push(`At least ${PASSWORD_MIN} characters`)
  if (password.length > PASSWORD_MAX) errors.push(`No more than ${PASSWORD_MAX} characters`)
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
  if (!/[0-9]/.test(password)) errors.push('One number')
  return errors
}

export const PASSWORD_HINT =
  'Use 8–24 characters with at least one uppercase letter, one lowercase letter, and one number.'
