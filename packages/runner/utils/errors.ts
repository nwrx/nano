import { createError } from '@unserved/server'

export const ERRORS = {
  NOT_AUTHORIZED: () => createError({
    name: 'E_NOT_AUTHORIZED',
    message: 'Not authorized',
    statusCode: 401,
    statusMessage: 'Unauthorized',
  }),

  RUNNER_ALREADY_CLAIMED: () => createError({
    name: 'E_RUNNER_ALREADY_CLAIMED',
    message: 'Runner is already claimed',
    statusCode: 409,
    statusMessage: 'Conflict',
  }),
  RUNNER_NOT_CLAIMED: () => createError({
    name: 'E_RUNNER_NOT_CLAIMED',
    message: 'Runner is not claimed',
    statusCode: 407,
    statusMessage: 'Proxy Authentication Required',
  }),
}
