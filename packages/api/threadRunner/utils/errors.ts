import { createError } from '@unserved/server'

export const ERRORS = {
  THREAD_RUNNER_NOT_FOUND: (id: string) => createError({
    name: 'E_THREAD_RUNNER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread runner with ID "${id}" was not found in the database`,
    data: { id },
  }),
  THREAD_RUNNER_ALREADY_REGISTERED: (baseUrl: string) => createError({
    name: 'E_THREAD_RUNNER_ALREADY_REGISTERED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Thread runner with base URL "${baseUrl}" is already registered in the database`,
    data: { baseUrl },
  }),
}
