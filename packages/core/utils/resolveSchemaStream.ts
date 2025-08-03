import { ERRORS as E } from './errors'

export function resolveSchemaStream(
  path: string,
  value: unknown,
): ReadableStream {
  if (value instanceof ReadableStream === false)
    throw E.INPUT_NOT_STREAM(path)
  return value
}
