import { createError } from '@unserved/server'

export const ERRORS = {
  RUNNER_NOT_FOUND: (name: string) => createError({
    name: 'E_RUNNER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Runner with  "${name}" was not found in the database`,
    data: { name },
  }),
  RUNNER_NO_RUNNERS_AVAILABLE: () => createError({
    name: 'E_RUNNER_NO_RUNNERS_AVAILABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: 'No thread runners available',
  }),

  // Registration
  RUNNER_ALREADY_REGISTERED: (address: string) => createError({
    name: 'E_RUNNER_ALREADY_REGISTERED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Runner with base URL "${address}" is already registered in the database`,
    data: { address },
  }),
  RUNNER_NAME_TAKEN: (name: string) => createError({
    name: 'E_RUNNER_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Runner with  "${name}" is already registered in the database`,
    data: { name },
  }),
  RUNNER_NOT_REACHABLE: (address: string, message?: string) => createError({
    name: 'E_RUNNER_NOT_REACHABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `Runner with base URL "${address}" is not reachable: ${message}`,
    data: { address, message },
  }),

  // Enable/Disable
  RUNNER_ALREADY_ENABLED: (name: string) => createError({
    name: 'E_RUNNER_ALREADY_ENABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Runner with ID "${name}" is already enabled`,
    data: { name },
  }),
  RUNNER_ALREADY_DISABLED: (name: string) => createError({
    name: 'E_RUNNER_ALREADY_DISABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Runner with name "${name}" is already disabled`,
    data: { name },
  }),
}
