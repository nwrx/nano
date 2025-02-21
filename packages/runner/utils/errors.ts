import { createError } from '@unserved/server'

export const ERRORS = {
  UNAUTHORIZED: () => createError({
    name: 'E_UNAUTHORIZED',
    message: 'Not authorized',
    statusCode: 401,
    statusMessage: 'Unauthorized',
  }),

  // Runner
  RUNNER_ALREADY_CLAIMED: () => createError({
    name: 'E_RUNNER_ALREADY_CLAIMED',
    message: 'Runner is already claimed',
    statusCode: 409,
    statusMessage: 'Conflict',
  }),
  RUNNER_NOT_CLAIMED: () => createError({
    name: 'E_RUNNER_NOT_CLAIMED',
    message: 'Runner is not claimed',
    statusCode: 409,
    statusMessage: 'Conflict',
  }),

  // Thread
  THREAD_NOT_FOUND: (id: string) => createError({
    name: 'E_THREAD_NOT_FOUND',
    message: `Thread with ID "${id}" not found`,
    statusCode: 404,
    statusMessage: 'Not Found',
  }),
}
