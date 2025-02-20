/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe<Context>('threadRunnerStatus', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    await context.runner.createTestServer()

    // Stub global fetch for Unix socket support.
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.runner.fetch(path, options)
    })
  })

  afterEach<Context>(async({ application, runner }) => {
    await application.destroy()
    await runner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('GET /api/runners/:runner', (it) => {
    it('should return status of the registered runner', async({ application, createUser, moduleThreadRunner }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      // Claim a runner first.
      const body = JSON.stringify({ address: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const runnerId = moduleThreadRunner.threadRunners.entries().next().value![0]

      // Check the status for the claimed runner.
      const response = await application.fetch(`/api/runners/${runnerId}`, { method: 'GET', headers })
      const data = await response.json() as { address: string; status: unknown }
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toStrictEqual({
        address: 'http://localhost',
        createdAt: expect.any(String),
        identity: expect.any(String),
        lastSeenAt: expect.any(String),
        isClaimed: true,
        isRunning: false,
        isReachable: true,
        workerPool: expect.any(Array),
      })
    })

    it('should not return status for unreachable runner', async({ application, createUser, moduleThreadRunner }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      // Claim a runner first.
      const body = JSON.stringify({ address: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const runnerId = moduleThreadRunner.threadRunners.entries().next().value![0]

      // Check the status for the claimed runner.
      moduleThreadRunner.threadRunners.get(runnerId)!.ping = async() => { throw new Error('Unreachable') }
      moduleThreadRunner.threadRunners.get(runnerId)!.getStatus =async() => { throw new Error('Unreachable') }
      const response = await application.fetch(`/api/runners/${runnerId}`, { method: 'GET', headers })
      const data = await response.json() as { address: string; status: unknown }
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toStrictEqual({
        address: 'http://localhost',
        createdAt: expect.any(String),
        identity: expect.any(String),
        lastSeenAt: expect.any(String),
        isClaimed: false,
        isRunning: false,
        isReachable: false,
        workerPool: [],
      })
    })
  })

  describe<Context>('errors', (it) => {
    it('should fail with status 404 when runner is not found', async({ application, createUser }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const response = await application.fetch('/api/runners/00000000-0000-0000-0000-000000000000', { method: 'GET', headers })
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
    })

    it('should fail with status 403 when user is not a super administrator', async({ application, createUser }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: false })
      const response = await application.fetch('/api/runners/00000000-0000-0000-0000-000000000000', { method: 'GET', headers })
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
    })

    it('should fail with status 401 when user is not authenticated', async({ application }) => {
      const response = await application.fetch('/api/runners/00000000-0000-0000-0000-000000000000', { method: 'GET' })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
    })
  })
})
