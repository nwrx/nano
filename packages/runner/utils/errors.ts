import { createError } from '@unserved/server'

export const ERRORS = {
  NOT_AUTHORIZED: (name: string) => createError({
    name: 'E_NOT_AUTHORIZED',
    message: `You are not authorized to access the **${name}** runner.`,
    statusCode: 401,
    statusMessage: 'Unauthorized',
  }),

  // Thread
  THREAD_NOT_INSTANTIATED: (id: string) => createError({
    name: 'E_THREAD_NOT_INSTANTIATED',
    message: `Thread with ID "${id}" is not instantiated`,
    statusCode: 404,
    statusMessage: 'Not Found',
  }),
}
