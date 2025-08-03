/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.sequential<Context>('POST /api/runners', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    await context.applicationRunner.createTestServer()

    // --- Since the 'POST /api/runners' will be calling `fetch` on the runner and that
    // --- the runner listens on a Unix socket, we need to stub the global fetch function
    // --- with one that supports Unix sockets.
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.applicationRunner.fetch(path, options)
    })
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
    await context.applicationRunner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('claim', (it) => {
    it('should respond with status 204', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 201, statusText: 'Created' })
    })

    it('should register the thread runner', async({ setupUser, application, moduleRunner }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const runner = moduleRunner.runnerClients.entries().next().value![1]
      expect(runner).toMatchObject({ address: 'http://localhost' })
    })

    it('should store the thread runner in the database', async({ setupUser, application, moduleRunner }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const { Runner } = moduleRunner.getRepositories()
      const runners = await Runner.find()
      expect(runners).toHaveLength(1)
      expect(runners[0]).toMatchObject({
        address: 'http://localhost',
        token: expect.any(String),
        identity: expect.any(String),
      })
    })
  })

  describe<Context>('schema', (it) => {
    it('should throw an error when the body is not an object', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify('http://localhost')
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Validation Error' })
    })

    it('should throw an error when the body is missing the baseUrl', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({})
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Validation Error' })
    })
  })

  describe<Context>('errors', (it) => {
    it('should respond with status 409 when already claimed', async({ setupUser, application, runner }) => {
      runner.runnerIsClaimed = true
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 409, statusText: 'Conflict' })
    })

    it('should respond with status 403 when user is not a super administrator', async({ setupUser, application }) => {
      const { headers } = await setupUser({ isSuperAdministrator: false })
      const body = JSON.stringify({ address: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
    })

    it('should respond with status 401 when user is not authenticated', async({ application }) => {
      const body = JSON.stringify({ address: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
    })
  })
})
