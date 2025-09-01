/* eslint-disable sonarjs/no-nested-template-literals */
import type { Asserted } from '@unshared/types'
import { assert } from '@unshared/validation'

/** A list of all possible workspace permissions. */
export const STORAGE_POOL_TYPE = [
  'azure',
  'gcs',
  'fs',
  's3',
  // 'dropbox',
  // 'onedrive',
  // 'googledrive',
  // 'box',
  // 'ftp',
  // 'sftp',
  // 'webdav',
  // 'owncloud',
  // 'nextcloud',
  // 'git',
  // 'gitlab',
  // 'github',
] as const

/** The message to show when the storage pool type is invalid. */
const MESSAGE = `The storage pool type must be one of: ${STORAGE_POOL_TYPE.map(a => `"${a}"`).join(', ')}`

/** Asserts that the given value is a valid `Workspace` permission. */
export const assertStoragePoolType = assert
  .stringEnum
  .withMessage(MESSAGE)(...STORAGE_POOL_TYPE)

/** The permission that a user has on a workspace. */
export type StoragePoolType = Asserted<typeof assertStoragePoolType>
