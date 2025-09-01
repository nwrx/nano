import { assert, createRuleChain } from '@unshared/validation'

export const assertEncryptionSecret = createRuleChain(
  assert.notUndefined.withMessage('You must provide a secret key to encrypt secrets.'),
  assert.stringNotEmpty.withMessage('The encryption secret key cannot be empty.'),
  assert.stringLengthInRange.withMessage('The encryption secret key must be between 32 and 128 characters long.')(32, 128),
)
