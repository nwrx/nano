import { createError } from 'h3'

export const ERRORS = {

  // File
  STORAGE_FILE_NOT_FOUND: (workspace: string, pool: string, id: string) => createError({
    name: 'E_STORAGE_FILE_NOT_FOUND',
    statusCode: 404,
    statusText: 'Not Found',
    message: `Could not find the file **${workspace}/${pool}/${id}**`,
  }),
  STORAGE_FILE_FORBIDDEN: (workspace: string, pool: string, id: string) => createError({
    name: 'E_STORAGE_FILE_FORBIDDEN',
    statusCode: 403,
    statusText: 'Forbidden',
    message: `You do not have permission to perform this action on the file **${workspace}/${pool}/${id}**`,
  }),

  // General
  STORAGE_POOL_INITIALIZATION_FAILED: (message: string) => createError({
    name: 'E_STORAGE_POOL_INITIALIZATION_FAILED',
    statusCode: 500,
    statusText: 'Internal Server Error',
    message: `Failed to initialize the storage pool: ${message}`,
  }),
  STORAGE_POOL_NOT_FOUND: (workspace: string, pool: string) => createError({
    name: 'E_STORAGE_POOL_NOT_FOUND',
    statusCode: 404,
    statusText: 'Not Found',
    message: `Could not find the storage pool **${workspace}/${pool}**`,
  }),
  STORAGE_POOL_FORBIDDEN: (workspace: string, pool: string) => createError({
    name: 'E_STORAGE_POOL_FORBIDDEN',
    statusCode: 403,
    statusText: 'Forbidden',
    message: `You do not have permission to perform this action on the storage pool **${workspace}/${pool}**`,
  }),
  STORAGE_POOL_ALREADY_EXISTS: (workspace: string, pool: string) => createError({
    name: 'E_STORAGE_POOL_ALREADY_EXISTS',
    statusCode: 409,
    statusText: 'Conflict',
    message: `The storage pool **${workspace}/${pool}** already exists`,
  }),

  // Adapters
  STORAGE_POOL_ADAPTER_NOT_IMPLEMENTED: (type: string) => createError({
    name: 'E_STORAGE_POOL_ADAPTER_NOT_IMPLEMENTED',
    statusCode: 500,
    statusText: 'Internal Server Error',
    message: `The storage pool adapter "${type}" is not implemented`,
  }),

  // Upload
  STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT: () => createError({
    name: 'E_STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT',
    statusCode: 500,
    statusText: 'Internal Server Error',
    message: 'The file object is invalid',
  }),
  STORAGE_UPLOAD_MISSING_FILE_NAME: () => createError({
    name: 'E_STORAGE_UPLOAD_MISSING_FILE_NAME',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'Could not determine the file name',
  }),
  STORAGE_UPLOAD_MISSING_FILE_TYPE: () => createError({
    name: 'E_STORAGE_UPLOAD_MISSING_FILE_TYPE',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'Could not determine the file type',
  }),

  // Upload from URL
  STORAGE_UPLOAD_FROM_URL_FAILED: (statusText: string) => createError({
    name: 'E_STORAGE_UPLOAD_FROM_URL_FAILED',
    statusCode: 400,
    statusText: 'Bad Request',
    message: `Failed to upload file from remote URL: ${statusText}`,
  }),
  STORAGE_UPLOAD_FROM_URL_EMPTY_BODY: () => createError({
    name: 'E_STORAGE_UPLOAD_FROM_URL_EMPTY_BODY',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'The response body is empty',
  }),
  STORAGE_UPLOAD_FROM_URL_NO_CONTENT_TYPE: () => createError({
    name: 'E_STORAGE_UPLOAD_FROM_URL_NO_CONTENT_TYPE',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'The response does not have a content type',
  }),
  STORAGE_UPLOAD_FROM_URL_NO_CONTENT_LENGTH: () => createError({
    name: 'E_STORAGE_UPLOAD_FROM_URL_NO_CONTENT_LENGTH',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'The response does not have a content length',
  }),

  // Erase
  STORAGE_ERASE_FS_NOT_FILE: (id: string) => createError({
    name: 'E_STORAGE_ERASE_FS_NOT_FILE',
    statusCode: 400,
    statusText: 'Bad Request',
    message: `Attempted to erase "${id}" but it is not a file`,
  }),
}
