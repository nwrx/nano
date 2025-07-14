export function serializeRequestParameter(value: unknown): string {
  if (typeof value === 'string')
    return value
  if (typeof value === 'number')
    return String(value)
  if (typeof value === 'boolean')
    return value ? 'true' : 'false'
  if (Array.isArray(value))
    return value.map(x => serializeRequestParameter(x)).join(',')
  if (typeof value === 'object' && value !== null)
    return JSON.stringify(value)
  throw new Error(`Unsupported parameter value type: ${typeof value}`)
}
