import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe.sequential<Context>('DELETE /api/runners/:identity', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    await context.runner.createTestServer()

    // Stub fetch to support Unix sockets
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.runner.fetch(path, options)
    })
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
    await context.runner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('release', (it) => {
    it('should release a thread runner successfully', async({ createUser, application, moduleThreadRunner }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const { ThreadRunner } = moduleThreadRunner.getRepositories()
      const { identity } = await ThreadRunner.findOneByOrFail({})
      const response = await application.fetch(`/api/runners/${identity}`, { method: 'DELETE', headers })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })
      expect(moduleThreadRunner.threadRunners.has(identity)).toBe(false)
      const runner = await ThreadRunner.findOne({ where: { identity }, withDeleted: true })
      expect(runner?.deletedAt).toBeTruthy()
    })
  })

  describe<Context>('errors', (it) => {
    it('should fail with status 404 when runner is not found', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const response = await application.fetch('/api/runners/not-found', { method: 'DELETE', headers })
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
    })

    it('should fail with status 403 when user is not a super administrator', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: false })
      const response = await application.fetch('/api/runners/runner-identity', { method: 'DELETE', headers })
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
    })

    it('should fail with status 401 when user is not authenticated', async({ application }) => {
      const response = await application.fetch('/api/runners/runner-identity', { method: 'DELETE' })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
    })
  })
})
