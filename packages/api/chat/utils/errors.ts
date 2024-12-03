import { createError } from '@unserved/server'

export const ERRORS = {
  THREAD_NOT_FOUND: (id: string) => createError({
    name: 'E_THREAD_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread "${id}" was not found in the database`,
    data: { id },
  }),
  THREAD_MISSING_CREATED_BY: createError({
    name: 'E_THREAD_MISSING_CREATED_BY',
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'Thread is missing the "createdBy" property',
  }),
}
