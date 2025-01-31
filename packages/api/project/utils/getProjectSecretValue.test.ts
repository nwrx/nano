import { ProjectSecret } from '../entities'
import { ERRORS } from './errors'
import { getProjectSecretValue } from './getProjectSecretValue'
import { setProjectSecretValue } from './setProjectSecretValue'

describe('getProjectSecretValue', () => {
  const secret = 'Hello, World!'
  const algorithm = 'aes-256-gcm'

  it('should return the decrypted value', async() => {
    const entity = new ProjectSecret()
    await setProjectSecretValue(entity, 'Hello, World', { secret, algorithm })
    const value = await getProjectSecretValue(entity, secret)
    expect(value).toBe('Hello, World')
  })

  it('should throw an error if the key is invalid not provided', async() => {
    const entity = new ProjectSecret()
    await setProjectSecretValue(entity, 'Hello, World', { secret, algorithm })
    const shouldReject = getProjectSecretValue(entity, '')
    const error = ERRORS.PROJECT_SECRET_ENCRYPTION_KEY_REQUIRED()
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the key is invalid', async() => {
    const entity = new ProjectSecret()
    await setProjectSecretValue(entity, 'Hello, World', { secret, algorithm })
    const shouldReject = getProjectSecretValue(entity, 'invalid')
    await expect(shouldReject).rejects.toThrow('Unsupported state or unable to authenticate data')
  })
})
