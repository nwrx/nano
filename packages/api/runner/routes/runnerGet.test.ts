/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe<Context>('GET /runners/:identity', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    await context.applicationRunner.createTestServer()

    // Stub global fetch for Unix socket support.
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.applicationRunner.fetch(path, options)
    })
  })

  afterEach<Context>(async({ application, runner }) => {
    await application.destroy()
    await runner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('success', (it) => {
    it('should return a specific thread runner by identity', async({ application, setupUser, moduleRunner }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost' })
      await application.fetch('/runners', { method: 'POST', body, headers })
      const { Runner } = moduleRunner.getRepositories()
      const { identity } = await Runner.findOneByOrFail({})
      const response = await application.fetch(`/runners/${identity}`, { method: 'GET', headers })
      const data = await response.json() as { address: string }
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toStrictEqual({
        address: 'http://localhost',
        identity: 'runner-1',
        createdAt: expect.any(String),
        lastSeenAt: expect.any(String),
      })
    })
  })

  describe<Context>('errors', (it) => {
    it('should fail with status 404 when runner is not found', async({ application, setupUser }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const response = await application.fetch('/runners/non-existent-identity', { method: 'GET', headers })
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
    })

    it('should fail with status 403 when user is not a super administrator', async({ application, setupUser }) => {
      const { headers } = await setupUser({ isSuperAdministrator: false })
      const response = await application.fetch('/runners/some-identity', { method: 'GET', headers })
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
    })

    it('should fail with status 401 when user is not authenticated', async({ application }) => {
      const response = await application.fetch('/runners/some-identity', { method: 'GET' })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
    })
  })
})
