/* eslint-disable sonarjs/no-async-constructor */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { FlowV1 } from '@nwrx/nano'
import type { Context } from '../../__fixtures__'
import type { ThreadWorkerMessage } from '../../../runner/worker'
import { WebSocketChannel } from '@unshared/client/websocket'
import { createTestContext } from '../../__fixtures__'
import { createThreadRunnerClient, ThreadRunnerClient } from './createThreadRunner'

const flow: FlowV1 = {
  version: '1',
  nodes: {
    inputName: {
      component: 'input',
      name: 'name',
    },
    template: {
      component: 'template',
      template: 'Hello, {{name}}!',
      values: {
        name: { $ref: '#/Nodes/inputName/value' },
      },
    },
    outputGreet: {
      component: 'output',
      name: 'greet',
      value: { $ref: '#/Nodes/template/value' },
    },
  },
}

describe.sequential<Context>('createThreadRunner', () => {
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
      const runner = createThreadRunnerClient({ address: 'http://localhost' })
      expect(runner).toBeInstanceOf(ThreadRunnerClient)
    })
  })

  describe<Context>('claim', (it) => {
    it('should return a ThreadRunner instance', async() => {
      const runner = createThreadRunnerClient({ address: 'http://localhost' })
      const shouldNotReject = runner.claim()
      await expect(shouldNotReject).resolves.toBeDefined()
    })

    it('should throw an error if the thread runner is already claimed', async() => {
      const runner = createThreadRunnerClient({ address: 'http://localhost' })
      await runner.claim()
      const shouldReject = runner.claim()
      await expect(shouldReject).rejects.toThrow('Runner is already claimed')
    })
  })

  describe<Context>('ping', (it) => {
    it('should ping the thread runner', async() => {
      const runner = createThreadRunnerClient({ address: 'http://localhost' })
      const result = await runner.ping()
      expect(result).toBeUndefined()
    })
  })

  describe<Context>('getStatus', (it) => {
    it('should get the status of the thread runner', async() => {
      const runner = createThreadRunnerClient({ address: 'http://localhost' })
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
      const runner = createThreadRunnerClient({ address: 'http://localhost' })
      const shouldReject = runner.getStatus()
      await expect(shouldReject).rejects.toThrow('Not authorized')
    })
  })

  describe<Context>('createThread', { timeout: 1000 }, () => {
    describe('instanciation', (it) => {
      it('should create a WebSocket channel', async() => {
        const runner = createThreadRunnerClient({ address: 'http://localhost' })
        await runner.claim()
        const result = await runner.createThread({ version: '1', nodes: {} })
        expect(result).toBeInstanceOf(WebSocketChannel)
      })

      it('should throw an error if the flow file version is unsupported', async() => {
        const runner = createThreadRunnerClient({ address: 'http://localhost' })
        await runner.claim()
        // @ts-expect-error: intentionally passing an unsupported version
        const shouldReject = runner.createThread({ version: '0' })
        await expect(shouldReject).rejects.toThrow('Unsupported flow file version: 0')
      })
    })

    describe('events', (it) => {
      it('should start a thread', async() => {
        const runner = createThreadRunnerClient({ address: 'http://localhost' })
        await runner.claim()
        const thread = await runner.createThread({ version: '1', nodes: {} })
        thread.send({ event: 'start', data: { name: 'Alice' } })
        const result = await new Promise(resolve => thread.on('message', resolve))
        expect(result).toStrictEqual({ event: 'start', data: [{ name: 'Alice' }] })
      })

      it('should start a thread and return the result', async() => {
        const runner = createThreadRunnerClient({ address: 'http://localhost' })
        await runner.claim()
        const thread = await runner.createThread(flow)
        thread.send({ event: 'start', data: { name: 'Alice' } })
        const result = await new Promise(resolve => thread.on('message', (message) => { if (message.event === 'done') resolve(message) }))
        expect(result).toStrictEqual({ event: 'done', data: [{ greet: 'Hello, Alice!' }] })
      })

      it('should collect all messages', async() => {
        const runner = createThreadRunnerClient({ address: 'http://localhost' })
        await runner.claim()
        const thread = await runner.createThread(flow)
        const messages: ThreadWorkerMessage[] = []
        thread.on('message', message => messages.push(message as ThreadWorkerMessage))
        thread.send({ event: 'start', data: { name: 'Alice' } })
        await new Promise(resolve => thread.on('message', (message) => { if (message.event === 'done') resolve(message) }))
        expect(messages).toHaveLength(18)
      })
    })
  })
})
