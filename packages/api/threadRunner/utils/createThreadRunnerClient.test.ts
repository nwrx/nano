/* eslint-disable sonarjs/no-async-constructor */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { ThreadRunner } from '../entities'
import { createThreadRunnerClient, ThreadRunnerClient } from './createThreadRunnerClient'

describe.sequential<Context>('createThreadRunnerClient', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.runner.createTestServer()

    // --- Since the thread runner client will be calling `fetch` on the runner and that
    // --- the runner listens on a Unix socket, we need to stub the global fetch function
    // --- with one that supports Unix sockets.
    vi.stubGlobal('fetch', async(url: string, options: RequestInit) => {
      const path = new URL(url).pathname
      return context.runner.fetch(path, options)
    })

    // --- We also need to stub the global WebSocket constructor to use the Unix socket.
    // --- Note that we use the `ws` module instead of the native WebSocket module because
    // --- the native NodeJS module does not support Unix sockets.
    vi.stubGlobal('WebSocket', class {
      constructor(url: string | URL) {
        const urlString = typeof url === 'string' ? url : url.toString()
        const path = urlString.replace('http://localhost', '')
        return context.runner.connect(path) as unknown as WebSocket
      }
    })
  })

  afterEach<Context>(async(context) => {
    await context.runner.destroy()
    vi.unstubAllGlobals()
  })

  describe<Context>('instance', (it) => {
    it('should return a ThreadRunner instance', () => {
      const runner = new ThreadRunner()
      const client = createThreadRunnerClient({ runner, address: 'http://localhost' })
      expect(client).toBeInstanceOf(ThreadRunnerClient)
    })
  })

  describe<Context>('claim', (it) => {
    it('should return a ThreadRunner instance', async() => {
      const runner = new ThreadRunner()
      const client = createThreadRunnerClient({ runner, address: 'http://localhost' })
      const shouldNotReject = client.claim()
      await expect(shouldNotReject).resolves.toBeDefined()
    })

    it('should throw an error if the thread runner is already claimed', async() => {
      const runner = new ThreadRunner()
      const client = createThreadRunnerClient({ runner, address: 'http://localhost' })
      await client.claim()
      const shouldReject = client.claim()
      await expect(shouldReject).rejects.toThrow('Runner is already claimed')
    })
  })

  describe<Context>('ping', (it) => {
    it('should ping the thread runner', async() => {
      const runner = new ThreadRunner()
      const client = createThreadRunnerClient({ runner, address: 'http://localhost' })
      const result = await client.ping()
      expect(result).toBeUndefined()
    })
  })

  describe<Context>('getStatus', (it) => {
    it('should get the status of the thread runner', async() => {
      const runner = new ThreadRunner()
      const client = createThreadRunnerClient({ runner, address: 'http://localhost' })
      await client.claim()
      const result = await client.getStatus()
      expect(result).toMatchObject({
        isClaimed: true,
        isRunning: false,
        isReachable: true,
        workerPool: expect.any(Array),
      })
    })

    it('should throw an error if the thread runner is not claimed', async() => {
      const runner = new ThreadRunner()
      const client = createThreadRunnerClient({ runner, address: 'http://localhost' })
      const shouldReject = client.getStatus()
      await expect(shouldReject).rejects.toThrow('Not authorized')
    })
  })
})
