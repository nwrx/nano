import { createError } from 'h3'

export const ERRORS = {
  ICON_NOT_FOUND: (name: string) => createError({
    name: 'E_ICON_NOT_FOUND',
    message: `Icon "${name}" not found`,
    statusText: 'Not Found',
    statusCode: 404,
    data: { name },
  }),
}
