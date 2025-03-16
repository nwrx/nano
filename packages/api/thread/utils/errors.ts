import { createError } from '@unserved/server'

export const ERRORS = {
  THREAD_NOT_FOUND: (id: string) => createError({
    name: 'E_THREAD_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread "${id}" not found`,
    data: { id },
  }),
  THREAD_SESSION_NOT_FOUND_FOR_PEER: (peerId: string) => createError({
    name: 'E_THREAD_SESSION_NOT_FOUND_FOR_PEER',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread session not found for peer "${peerId}"`,
    data: { peerId },
  }),
}
