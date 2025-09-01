/* eslint-disable sonarjs/no-nested-template-literals */
import type { CipherGCMTypes } from 'node:crypto'
import { assert, createRuleChain } from '@unshared/validation'

export const ENCRYPTION_ALGORITHMS = [
  'aes-128-gcm',
  'aes-192-gcm',
  'aes-256-gcm',
] as CipherGCMTypes[]

/** The message to show when the encryption algorithm is invalid. */
const MESSAGE = `The encryption algorithm must be one of: ${ENCRYPTION_ALGORITHMS.map(a => `"${a}"`).join(', ')}`

/** Asserts that the given value is a valid encryption algorithm. */
export const assertEncryptionAlgorithm = createRuleChain(
  assert.notUndefined.withMessage(MESSAGE),
  assert.stringNotEmpty.withMessage(MESSAGE),
  assert.stringEnum.withMessage(MESSAGE)(...ENCRYPTION_ALGORITHMS),
)

/** The permission that a user has on a storage file. */
export type EncryptionAlgorithm = ReturnType<typeof assertEncryptionAlgorithm>
