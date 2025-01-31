import type { UserSession } from '../entities'
import { ModuleUser } from '..'
import { createSessionToken } from './createSessionToken'
import { decryptToken } from './decryptToken'

describe('decryptToken', () => {
  it('should decrypt the token using the secret key', () => {
    const moduleUser = new ModuleUser({ userSecretKey: 'secret' })
    const userSession = { id: '00000000-0000-0000-0000-000000000000' } as unknown as UserSession
    const token = createSessionToken.call(moduleUser, userSession)
    const id = decryptToken.call(moduleUser, token)
    expect(id).toBe('00000000-0000-0000-0000-000000000000')
  })

  it('should throw an error if the token is invalid', () => {
    const moduleUser = new ModuleUser({ userSecretKey: 'secret' })
    const token = 'd260483b5ffb66'
    const shouldThrow = () => decryptToken.call(moduleUser, token)
    const error = moduleUser.errors.USER_SESSION_NOT_FOUND()
    expect(shouldThrow).toThrow(error)
  })
})
