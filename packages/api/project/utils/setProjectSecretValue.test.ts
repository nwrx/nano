import { ProjectSecret } from '../entities'
import { ERRORS as E } from './errors'
import { setProjectSecretValue } from './setProjectSecretValue'

describe('setProjectSecretValue', () => {
  const secret = 'MySecretKey'
  const algorithm = 'aes-256-gcm'

  it('should return a valid cipher object', async() => {
    const entity = new ProjectSecret()
    await setProjectSecretValue(entity, 'Hello, World', { secret, algorithm })
    expect(entity.iv).toMatch(/^[\d+/=A-Za-z]+$/)
    expect(entity.tag).toMatch(/^[\d+/=A-Za-z]+$/)
    expect(entity.salt).toMatch(/^[\d+/=A-Za-z]+$/)
    expect(entity.cipher).toMatch(/^[\d+/=A-Za-z]+$/)
    expect(entity.algorithm).toBe(algorithm)
  })

  it('should throw an error if the algorithm is invalid', async() => {
    const entity = new ProjectSecret()
    // @ts-expect-error: Testing invalid algorithm
    const shouldReject = setProjectSecretValue(entity, secret, { secret, algorithm: 'aes-256-cbc' })
    const error = E.PROJECT_SECRET_ENCRYPTION_ALGORITHM_NOT_SUPPORTED('aes-256-cbc')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the key is invalid not provided', async() => {
    const entity = new ProjectSecret()
    const shouldReject = setProjectSecretValue(entity, secret, { secret: '', algorithm })
    const error = E.PROJECT_SECRET_ENCRYPTION_KEY_REQUIRED()
    await expect(shouldReject).rejects.toThrow(error)
  })
})
