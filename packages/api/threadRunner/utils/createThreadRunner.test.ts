/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { WebSocketChannel } from '@unshared/client/websocket'
import { type Context, createTestContext } from '../../__fixtures__'
import { createThreadRunner, ThreadRunner } from './createThreadRunner'

describe<Context>('createThreadRunner', () => {
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
      const runner = createThreadRunner('http://localhost')
      expect(runner).toBeInstanceOf(ThreadRunner)
    })
  })

  describe<Context>('claim', (it) => {
    it('should return a ThreadRunner instance', async() => {
      const runner = createThreadRunner('http://localhost')
      const shouldNotReject = runner.claim()
      await expect(shouldNotReject).resolves.toBeDefined()
    })

    it('should throw an error if the thread runner is already claimed', async() => {
      const runner = createThreadRunner('http://localhost')
      await runner.claim()
      const shouldReject = runner.claim()
      await expect(shouldReject).rejects.toThrow('Runner is already claimed')
    })
  })

  describe<Context>('ping', (it) => {
    it('should ping the thread runner', async() => {
      const runner = createThreadRunner('http://localhost')
      await runner.claim()
      const result = await runner.ping()
      expect(result).toStrictEqual({ ok: true })
    })

    it('should throw an error if the thread runner is not claimed', async() => {
      const runner = createThreadRunner('http://localhost')
      const shouldReject = runner.ping()
      await expect(shouldReject).rejects.toThrow('Not authorized')
    })
  })

  describe<Context>('getStatus', (it) => {
    it('should get the status of the thread runner', async() => {
      const runner = createThreadRunner('http://localhost')
      await runner.claim()
      const result = await runner.getStatus()
      expect(result).toStrictEqual({
        isClaimed: true,
        isRunning: false,
        isReachable: true,
        workerPool: expect.any(Array),
      })
    })

    it('should throw an error if the thread runner is not claimed', async() => {
      const runner = createThreadRunner('http://localhost')
      const shouldReject = runner.getStatus()
      await expect(shouldReject).rejects.toThrow('Not authorized')
    })
  })

  describe<Context>('createThread', { timeout: 1000 }, () => {
    describe('instanciation', (it) => {
      it('should create a WebSocket channel', async() => {
        const runner = createThreadRunner('http://localhost')
        await runner.claim()
        const result = await runner.createThread({ version: '1', nodes: {} })
        expect(result).toBeInstanceOf(WebSocketChannel)
      })

      it('should throw an error if the flow file version is unsupported', async() => {
        const runner = createThreadRunner('http://localhost')
        // @ts-expect-error: intentionally passing an unsupported version
        const shouldReject = runner.createThread({ version: '0' })
        await expect(shouldReject).rejects.toThrow('Unsupported flow file version: 0')
      })
    })

    describe('events', (it) => {
      it('should start a thread', async() => {
        const runner = createThreadRunner('http://localhost')
        await runner.claim()
        const thread = await runner.createThread({ version: '1', nodes: {} })
        thread.send({ event: 'start', data: {} })
        const result = await new Promise(resolve => thread.on('message', resolve))
        expect(result).toStrictEqual({ event: 'start', data: [{}] })
      })

      it('should start a thread and return the result', async() => {
        const runner = createThreadRunner('http://localhost')
        await runner.claim()
        const thread = await runner.createThread({
          version: '1',
          nodes: { 'node-1': { component: 'output', name: 'output', value: 42 } },
        })
        thread.send({ event: 'start', data: {} })
        const result = await new Promise(resolve => thread.on('message', (message) => { if (message.event === 'done') resolve(message) }))
        expect(result).toStrictEqual({ event: 'done', data: [{ output: 42 }] })
      })

      it('should start a thread with the given input and return the result', async() => {
        const runner = createThreadRunner('http://localhost')
        await runner.claim()
        const thread = await runner.createThread({
          version: '1',
          nodes: {
            'node-1': { component: 'input', name: 'input' },
            'node-2': { component: 'output', name: 'output', value: { $ref: '#/Nodes/node-1/value' } },
          },
        })
        thread.send({ event: 'start', data: { input: 'Hello, world!' } })
        const result = await new Promise(resolve => thread.on('message', (message) => { if (message.event === 'done') resolve(message) }))
        expect(result).toStrictEqual({ event: 'done', data: [{ output: 'Hello, world!' }] })
      })
    })
  })
})
