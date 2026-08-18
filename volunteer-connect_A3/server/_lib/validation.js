export function safeText(value, min = 0, max = 2000) {
  return typeof value === 'string' && value.trim().length >= min && value.length <= max && !/[<>\u0000-\u001f]/.test(value)
}

export function validEmail(value) {
  return typeof value === 'string' && value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

