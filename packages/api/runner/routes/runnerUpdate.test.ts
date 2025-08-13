/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'

describe<Context>('PUT /runners/:identity', () => {
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
    it('should update a thread runner address successfully', async({ application, setupUser, moduleRunner }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })

      // Claim a runner first.
      const createBody = JSON.stringify({ address: 'http://localhost:3000' })
      await application.fetch('/runners', { method: 'POST', body: createBody, headers })
      const { Runner } = moduleRunner.getRepositories()
      const { identity } = await Runner.findOneByOrFail({})

      // Update the runner address.
      const updateBody = JSON.stringify({ address: 'http://localhost:4000' })
      const response = await application.fetch(`/runners/${identity}`, { method: 'PUT', body: updateBody, headers })
      const data = await response.json()
      expect(response).toMatchObject({ status: 200, statusText: 'OK' })
      expect(data).toMatchObject({
        address: 'http://localhost:4000',
        identity,
        createdAt: expect.any(String),
        lastSeenAt: expect.any(String),
      })

      // Verify the address was updated in the database.
      const updatedRunner = await Runner.findOneByOrFail({ identity })
      expect(updatedRunner.address).toBe('http://localhost:4000')
    })
  })

  describe<Context>('errors', (it) => {
    it('should fail with status 404 when runner is not found', async({ application, setupUser }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: 'http://localhost:4000' })
      const response = await application.fetch('/runners/non-existent-identity', { method: 'PUT', body, headers })
      expect(response).toMatchObject({ status: 404, statusText: 'Not Found' })
    })

    it('should fail with status 403 when user is not a super administrator', async({ application, setupUser }) => {
      const { headers } = await setupUser({ isSuperAdministrator: false })
      const body = JSON.stringify({ address: 'http://localhost:4000' })
      const response = await application.fetch('/runners/some-identity', { method: 'PUT', body, headers })
      expect(response).toMatchObject({ status: 403, statusText: 'Forbidden' })
    })

    it('should fail with status 401 when user is not authenticated', async({ application }) => {
      const body = JSON.stringify({ address: 'http://localhost:4000' })
      const response = await application.fetch('/runners/some-identity', { method: 'PUT', body })
      expect(response).toMatchObject({ status: 401, statusText: 'Unauthorized' })
    })

    it('should fail with status 400 when address is missing', async({ application, setupUser }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({})
      const response = await application.fetch('/runners/some-identity', { method: 'PUT', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Validation Error' })
    })

    it('should fail with status 400 when address is empty', async({ application, setupUser }) => {
      const { headers } = await setupUser({ isSuperAdministrator: true })
      const body = JSON.stringify({ address: '' })
      const response = await application.fetch('/runners/some-identity', { method: 'PUT', body, headers })
      expect(response).toMatchObject({ status: 400, statusText: 'Validation Error' })
    })
  })
})
