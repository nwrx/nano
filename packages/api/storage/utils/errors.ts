import { createError } from 'h3'

export const ERRORS = {
  FILE_MISSING_FILE_NAME: () => createError({
    name: 'E_FILE_MISSING_FILE_NAME',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'Could not determine the file name',
  }),

  FILE_MISSING_FILE_TYPE: () => createError({
    name: 'E_FILE_MISSING_FILE_TYPE',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'Could not determine the file type',
  }),

  STORAGE_FILE_MISSING_FILE_ID: () => createError({
    name: 'E_FILE_MISSING_FILE_ID',
    statusCode: 400,
    statusText: 'Bad Request',
    message: 'Could not determine the file ID',
  }),

  STORAGE_FILE_NOT_FOUND: (id: string) => createError({
    name: 'E_FILE_FILE_NOT_FOUND',
    statusCode: 404,
    statusText: 'Not Found',
    message: `Could not find the requested asset with ID "${id}"`,
  }),

  FILE_REMOTE_DOWNLOAD_FAILED: (url: string) => createError({
    name: 'E_FILE_REMOTE_DOWNLOAD_FAILED',
    statusCode: 500,
    statusText: 'Internal Server Error',
    message: `Could not download the asset from the remote storage at "${url}"`,
  }),

  FILE_FOLDER_NOT_FOUND: (id: string) => createError({
    name: 'E_FILE_FOLDER_NOT_FOUND',
    statusCode: 404,
    statusText: 'Not Found',
    message: `Could not find the requested folder with ID "${id}"`,
  }),

  FILE_FILE_OR_FOLDER_NOT_FOUND: (id: string) => createError({
    name: 'E_FILE_FILE_OR_FOLDER_NOT_FOUND',
    statusCode: 404,
    statusText: 'Not Found',
    message: `Could not find the requested file or folder with ID "${id}"`,
  }),
}
