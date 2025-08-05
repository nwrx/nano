/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Context, createTestContext } from '../../__fixtures__'
import { registerRunner } from './registerRunner'

describe<Context>('registerRunner', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.applicationRunner.createTestServer()

    // Stub fetch to support Unix sockets
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.applicationRunner.fetch(path, options)
    })
  })

  afterEach<Context>(async(context) => {
    await context.applicationRunner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('registration', (it) => {
    it('should register a thread runner successfully', async({ setupUser, moduleRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: true })
      await registerRunner.call(moduleRunner, { address, user })
      expect(moduleRunner.clients.size).toBe(1)
    })

    it('should store the thread runner in the database', async({ setupUser, moduleRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: true })
      await registerRunner.call(moduleRunner, { address, user })
      const { Runner } = moduleRunner.getRepositories()
      const runners = await Runner.find()
      expect(runners).toHaveLength(1)
      expect(runners[0]).toMatchObject({ address, token: expect.any(String), identity: expect.any(String) })
    })
  })

  describe<Context>('authorization', (it) => {
    it('should throw an error if the user is not a super administrator', async({ setupUser, moduleRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: false })
      const shouldReject = registerRunner.call(moduleRunner, { address, user })
      await expect(shouldReject).rejects.toThrow('Cannot perform this operation on the thread runner')
    })
  })

  describe<Context>('uniqueness', (it) => {
    it('should throw an error if the thread runner is already registered', async({ setupUser, moduleRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: true })
      await registerRunner.call(moduleRunner, { address, user })
      const shouldReject = registerRunner.call(moduleRunner, { address, user })
      await expect(shouldReject).rejects.toThrow('Thread runner with base URL "http://localhost" is already registered in the database')
    })
  })
})
