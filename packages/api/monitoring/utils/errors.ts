import { createError } from '@unserved/server'

export const ERRORS = {
  THREAD_NOT_FOUND: (thread: string) => createError({
    name: 'E_THREAD_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread "${thread}" was not found in the database`,
    data: { thread },
  }),
}
