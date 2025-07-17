import { createError } from 'h3'

export const ERRORS = {
  ICON_COLLECTION_NOT_FOUND: (name: string) => createError({
    name: 'E_ICON_COLLECTION_NOT_FOUND',
    message: `Icon collection "${name}" not found`,
    statusText: 'Not Found',
    statusCode: 404,
  }),

  // Install.
  ICON_COLLECTION_DOWNLOAD_METADATA_FAILED: (response: Response) => createError({
    name: 'E_ICON_COLLECTION_DOWNLOAD_METADATA_FAILED',
    message: `Failed to download icon collection metadata: ${response.statusText}`,
    statusText: response.statusText,
    statusCode: response.status,
  }),
  ICON_COLLECTION_DOWNLOAD_DATA_FAILED: (response: Response) => createError({
    name: 'E_ICON_COLLECTION_DOWNLOAD_DATA_FAILED',
    message: `Failed to download icon collection data: ${response.statusText}`,
    statusText: response.statusText,
    statusCode: response.status,
  }),

  // Conflicts.
  ICON_COLLECTION_ALREADY_INSTALLED: (name: string) => createError({
    name: 'E_ICON_COLLECTION_ALREADY_INSTALLED',
    message: `Icon collection "${name}" is already installed`,
    statusText: 'Conflict',
    statusCode: 409,
  }),
  ICON_COLLECTION_ALREADY_ENABLED: (name: string) => createError({
    name: 'E_ICON_COLLECTION_ALREADY_ENABLED',
    message: `Icon collection "${name}" is already enabled`,
    statusText: 'Conflict',
    statusCode: 409,
  }),
  ICON_COLLECTION_ALREADY_DISABLED: (name: string) => createError({
    name: 'E_ICON_COLLECTION_ALREADY_DISABLED',
    message: `Icon collection "${name}" is already disabled`,
    statusText: 'Conflict',
    statusCode: 409,
  }),
}
