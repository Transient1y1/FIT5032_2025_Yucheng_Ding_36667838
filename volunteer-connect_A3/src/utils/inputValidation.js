const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_PATTERN = /^[\p{L}\p{M} .'-]+$/u
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

export function isSafePlainText(value, minLength = 0, maxLength = 1000) {
  if (typeof value !== 'string') return false

  const text = value.trim()
  return (
    text.length >= minLength &&
    text.length <= maxLength &&
    !/[<>]/.test(text) &&
    !CONTROL_CHARACTER_PATTERN.test(text)
  )
}

export function isValidName(value) {
  if (!isSafePlainText(value, 2, 60)) return false
  return NAME_PATTERN.test(value.trim())
}

export function isValidEmail(value) {
  if (typeof value !== 'string') return false
  const email = value.trim()
  return email.length <= 120 && EMAIL_PATTERN.test(email)
}

export function isStrongPassword(value) {
  return (
    typeof value === 'string' &&
    value.length >= 8 &&
    value.length <= 128 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    !CONTROL_CHARACTER_PATTERN.test(value)
  )
}

export function isValidIdentifier(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value)
}
