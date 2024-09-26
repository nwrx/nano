import { createError } from '@unserved/server'

export const ERRORS = {

  // Users
  USER_NOT_FOUND: (username: string) => createError({
    name: 'E_USER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The user with name "${username}" was not found`,
    data: { username },
  }),
  USER_PASSWORD_MISMATCH: () => createError({
    name: 'E_USER_PASSWORD_MISMATCH',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The password and password confirm do not match',
  }),
  USER_INVALID_TOKEN: () => createError({
    name: 'E_USER_INVALID_TOKEN',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The token is invalid',
  }),
  USER_ALREADY_SIGNED_IN: () => createError({
    name: 'E_USER_ALREADY_SIGNED_IN',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The user is already signed in',
  }),

  // Auth
  USER_BAD_CREDENTIALS: () => createError({
    name: 'E_USER_BAD_CREDENTIALS',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'The username or password is incorrect',
  }),
  USER_NOT_AUTHENTICATED: () => createError({
    name: 'E_USER_NOT_AUTHENTICATED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'The user is not authenticated',
  }),
  USER_NOT_ALLOWED: () => createError({
    name: 'E_USER_NOT_ALLOWED',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: 'The user is not allowed to perform this operation',
  }),
  USER_EMAIL_OR_NAME_TAKEN: () => createError({
    name: 'E_USER_EMAIL_OR_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: 'The email or username is already taken',
  }),

  // Sessions
  USER_SESSION_NOT_FOUND: () => createError({
    name: 'E_USER_SESSION_NOT_FOUND',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'The user session was not found',
  }),
  USER_SESSION_EXPIRED: () => createError({
    name: 'E_USER_SESSION_EXPIRED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'The user session has expired',
  }),
  USER_SESSION_USER_NOT_FOUND: () => createError({
    name: 'E_USER_SESSION_USER_NOT_FOUND',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'The user session is associated with a non-existing user',
  }),
  USER_MISSING_HEADER: () => createError({
    name: 'E_USER_MISSING_HEADER',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'The user session is missing the required header',
  }),

  // Recovery
  USER_RECOVERY_INVALID: () => createError({
    name: 'E_USER_RECOVERY_INVALID',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The recovery token is invalid',
  }),
  USER_RECOVERY_EXPIRED: () => createError({
    name: 'E_USER_RECOVERY_EXPIRED',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The recovery token has expired',
  }),
}
