export function readBody(request) {
  if (request.body && typeof request.body === 'object') return request.body
  try { return request.body ? JSON.parse(request.body) : {} } catch { return {} }
}
export function methodNotAllowed(response) { return response.status(405).json({ ok: false, message: 'Method not allowed.' }) }

