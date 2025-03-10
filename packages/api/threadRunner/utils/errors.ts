import { createError } from '@unserved/server'

export const ERRORS = {
  THREAD_RUNNER_NOT_FOUND: (id: string) => createError({
    name: 'E_THREAD_RUNNER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread runner with ID "${id}" was not found in the database`,
    data: { id },
  }),
  THREAD_RUNNER_FORBIDDEN: () => createError({
    name: 'E_THREAD_RUNNER_FORBIDDEN',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: 'Cannot perform this operation on the thread runner',
  }),
  THREAD_RUNNER_NO_RUNNERS_AVAILABLE: () => createError({
    name: 'E_THREAD_RUNNER_NO_RUNNERS_AVAILABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: 'No thread runners available',
  }),

  // Registration
  THREAD_RUNNER_ALREADY_REGISTERED: (address: string) => createError({
    name: 'E_THREAD_RUNNER_ALREADY_REGISTERED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Thread runner with base URL "${address}" is already registered in the database`,
    data: { address },
  }),
  THREAD_RUNNER_NOT_REACHABLE: (address: string, code: string) => createError({
    name: 'E_THREAD_RUNNER_NOT_REACHABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `Thread runner with base URL "${address}" is not reachable: ${code}`,
    data: { address, code },
  }),

  // Enable/Disable
  THREAD_RUNNER_ALREADY_ENABLED: (identity: string) => createError({
    name: 'E_THREAD_RUNNER_ALREADY_ENABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Thread runner with ID "${identity}" is already enabled`,
    data: { identity },
  }),
  THREAD_RUNNER_ALREADY_DISABLED: (identity: string) => createError({
    name: 'E_THREAD_RUNNER_ALREADY_DISABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Thread runner with ID "${identity}" is already disabled`,
    data: { identity },
  }),
}
