/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { ThreadRunner } from '../utils'

describe.sequential<Context>('claim', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    await context.runner.createTestServer()

    // --- Since the 'POST /api/runners' will be calling `fetch` on the runner and that
    // --- the runner listens on a Unix socket, we need to stub the global fetch function
    // --- with one that supports Unix sockets.
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

  describe<Context>('claim', (it) => {
    it('should respond with status 204', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 204, statusText: 'No Content' })
    })

    it('should register the thread runner', async({ createUser, application, moduleThreadRunner }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const runner = moduleThreadRunner.threadRunners.entries().next().value![1]
      expect(runner).toBeInstanceOf(ThreadRunner)
    })

    it('should store the thread runner in the database', async({ createUser, application, moduleThreadRunner }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      await application.fetch('/api/runners', { method: 'POST', body, headers })
      const { ThreadRunner } = moduleThreadRunner.getRepositories()
      const runners = await ThreadRunner.find()
      expect(runners).toHaveLength(1)
      expect(runners[0]).toMatchObject({ baseUrl: 'http://localhost', token: expect.any(String) })
    })
  })

  describe<Context>('schema', (it) => {
    it('should throw an error when the body is not an object', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify('http://localhost')
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Validation Error' })
    })

    it('should throw an error when the body is missing the baseUrl', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({})
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Validation Error' })
    })
  })

  describe<Context>('errors', (it) => {
    it('should respond with status 409 when already claimed', async({ createUser, application, moduleRunner }) => {
      moduleRunner.runnerIsClaimed = true
      const { headers } = await createUser('admin', { isSuperAdministrator: true })
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 409, statusText: 'Conflict' })
    })

    it('should respond with status 403 when user is not a super administrator', async({ createUser, application }) => {
      const { headers } = await createUser('admin', { isSuperAdministrator: false })
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body, headers })
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
    })

    it('should respond with status 401 when user is not authenticated', async({ application }) => {
      const body = JSON.stringify({ baseUrl: 'http://localhost' })
      const response = await application.fetch('/api/runners', { method: 'POST', body })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
    })
  })
})
