import { createSession } from './createSession'

describe('createSession', () => {
  it('should encrypt the id using the secret key', () => {
    const moduleUser = { userSecretKey: 'secret', userCypherAlgorithm: 'aes-256-gcm' } as ModuleUser
    const userSession = { id: '00000000-0000-0000-0000-000000000000' } as unknown as UserSession
    const token = createSession.call(moduleUser, userSession)
    expect(token).toBe('b750f892c2f04bd574d82ec643fbf145717871630d2665bf28b1aba4a6d260483b5ffb66')
  })
})
