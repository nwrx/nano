/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Context, createTestContext } from '../../__fixtures__'
import { registerThreadRunner } from './registerThreadRunner'

describe<Context>('registerThreadRunner', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.runner.createTestServer()

    // Stub fetch to support Unix sockets
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.runner.fetch(path, options)
    })
  })

  afterEach<Context>(async(context) => {
    await context.runner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('registration', (it) => {
    it('should register a thread runner successfully', async({ setupUser, moduleThreadRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: true })
      await registerThreadRunner.call(moduleThreadRunner, { address, user })
      expect(moduleThreadRunner.threadRunners.size).toBe(1)
    })

    it('should store the thread runner in the database', async({ setupUser, moduleThreadRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: true })
      await registerThreadRunner.call(moduleThreadRunner, { address, user })
      const { ThreadRunner } = moduleThreadRunner.getRepositories()
      const runners = await ThreadRunner.find()
      expect(runners).toHaveLength(1)
      expect(runners[0]).toMatchObject({ address, token: expect.any(String), identity: expect.any(String) })
    })
  })

  describe<Context>('authorization', (it) => {
    it('should throw an error if the user is not a super administrator', async({ setupUser, moduleThreadRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: false })
      const shouldReject = registerThreadRunner.call(moduleThreadRunner, { address, user })
      await expect(shouldReject).rejects.toThrow('Cannot perform this operation on the thread runner')
    })
  })

  describe<Context>('uniqueness', (it) => {
    it('should throw an error if the thread runner is already registered', async({ setupUser, moduleThreadRunner }) => {
      const address = 'http://localhost'
      const { user } = await setupUser({ isSuperAdministrator: true })
      await registerThreadRunner.call(moduleThreadRunner, { address, user })
      const shouldReject = registerThreadRunner.call(moduleThreadRunner, { address, user })
      await expect(shouldReject).rejects.toThrow('Thread runner with base URL "http://localhost" is already registered in the database')
    })
  })
})
