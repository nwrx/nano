import { createError } from 'h3'

export const ERRORS = {
  ICON_COLLECTION_NOT_FOUND: (name: string) => createError({
    name: 'E_ICON_COLLECTION_NOT_FOUND',
    message: `Icon collection "${name}" not found`,
    statusText: 'Not Found',
    statusCode: 404,
  }),
  ICON_COLLECTION_ALREADY_EXISTS: (name: string) => createError({
    name: 'E_ICON_COLLECTION_ALREADY_EXISTS',
    message: `Icon collection "${name}" already exists`,
    statusText: 'Conflict',
    statusCode: 409,
  }),
  ICON_ICONIFY_FETCH_FAILED: (response: Response) => createError({
    name: 'E_ICONIFY_FETCH_FAILED',
    message: response.statusText,
    statusText: response.statusText,
    statusCode: response.status,
  }),
  ICON_ICONIFY_IMPORT_FAILED: (response: Response) => createError({
    name: 'E_ICONIFY_IMPORT_FAILED',
    message: response.statusText,
    statusText: response.statusText,
    statusCode: response.status,
  }),
  ICON_COLLECTION_ALREADY_ENABLED: (name: string) => createError({
    name: 'E_ICON_COLLECTION_ALREADY_ENABLED',
    message: `Icon collection "${name}" is already enabled`,
    statusText: 'Conflict',
    statusCode: 409,
  }),
  ICON_COLLECTION_ALREADY_DISABLED: (name: string) => createError({
    name: 'E_ICON_COLLECTION_ALREADY_DISABLED',
    message: `Icon collection "${name}" is already disabled`,
    statusText: 'Conflict',
    statusCode: 409,
  }),
}
