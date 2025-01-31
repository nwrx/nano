import { createError } from 'h3'

export const ERRORS = {

  FLOW_MODULE_NOT_FOUND: (idOrSlug: string) => createError({
    name: 'E_FLOW_MODULE_NOT_FOUND',
    message: `Module "${idOrSlug}" not found`,
    statusText: 'Not Found',
    statusCode: 404,
  }),

  FLOW_NOT_FOUND: (name: string) => createError({
    name: 'E_FLOW_NOT_FOUND',
    message: `Chain "${name}" not found`,
    statusText: 'Not Found',
    statusCode: 404,
  }),

  FLOW_ALREADY_EXISTS: (name: string) => createError({
    name: 'E_FLOW_ALREADY_EXISTS',
    message: `Chain "${name}" already exists`,
    statusText: 'Conflict',
    statusCode: 409,
  }),

  FLOW_IMPORT_FAILED: (response: Response) => createError({
    name: 'E_FLOW_IMPORT_FAILED',
    message: response.statusText,
    statusText: response.statusText,
    statusCode: response.status,
  }),
}
