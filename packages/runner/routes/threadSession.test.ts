/* eslint-disable @typescript-eslint/no-base-to-string */
import type { FlowV1 } from '@nwrx/nano'
import type { TestApplication } from '@unserved/server'
import type { ThreadClientMessage, ThreadWorkerMessage } from '../worker'
import { createTestApplication } from '@unserved/server'
import { WebSocket } from 'ws'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
  address: string
}

async function createConnection(context: Context) {
  const { application, moduleRunner } = context
  const messages: ThreadWorkerMessage[] = []
  const address = `ws+unix:${application.socketPath}:/threads?token=${moduleRunner.runnerToken}`
  const ws = new WebSocket(address)
  await new Promise<void>((resolve, reject) => {
    ws.on('open', resolve)
    ws.on('error', reject)
    ws.on('message', (data) => {
      const utf8 = data.toString()
      const message = JSON.parse(utf8) as ThreadWorkerMessage
      messages.push(message)
    })
  })
  return { ws, messages }
}

function sendMessage(ws: WebSocket, message: ThreadClientMessage) {
  ws.send(JSON.stringify(message))
}

async function receiveMessage(ws: WebSocket, event?: ThreadWorkerMessage['event']): Promise<ThreadWorkerMessage> {
  return await new Promise((resolve, reject) => {
    ws.on('message', (data) => {
      const utf8 = data.toString()
      const message = JSON.parse(utf8) as ThreadWorkerMessage
      if (message.event === 'error') reject(message.data[0])
      if (event && message.event !== event) return
      resolve(message)
    })
    ws.on('error', (error) => {
      reject(error)
    })
  })
}

describe<Context>('WS /threads/:id', () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    await context.application.createTestServer()
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

  const flow: FlowV1 & Record<string, unknown> = {
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

  describe<Context>('session', (it) => {
    it('should upgrade the connection to a WebSocket', async({ application }) => {
      const upgrade = await application.fetch('/threads')
      expect(upgrade).toMatchObject({ status: 426, statusText: 'Upgrade Required' })
    })

    it('should load the flow and wait for `worker.loaded` event', async(context) => {
      const { ws } = await createConnection(context)
      sendMessage(ws, { event: 'worker.load', data: flow })
      const message = await receiveMessage(ws, 'worker.loaded')
      expect(message).toStrictEqual({ event: 'worker.loaded' })
    })

    it('should start a thread and return the output', async(context) => {
      const { ws, messages } = await createConnection(context)
      sendMessage(ws, { event: 'worker.load', data: flow })
      await receiveMessage(ws, 'worker.loaded')
      sendMessage(ws, { event: 'worker.start', data: { name: 'Alice' } })
      const result = await receiveMessage(ws, 'done')
      expect(result).toStrictEqual({ event: 'done', data: [{ greet: 'Hello, Alice!' }] })
      expect(messages).toHaveLength(19)
    })

    it('should reload a flow that has been loaded', async(context) => {
      const { ws } = await createConnection(context)
      sendMessage(ws, { event: 'worker.load', data: flow })
      await receiveMessage(ws, 'worker.loaded')
      sendMessage(ws, { event: 'worker.start', data: { name: 'Alice' } })
      await receiveMessage(ws, 'done')
      sendMessage(ws, { event: 'worker.load', data: flow })
      const message = await receiveMessage(ws, 'worker.loaded')
      expect(message).toStrictEqual({ event: 'worker.loaded' })
    })
  })

  describe<Context>('errors', (_) => {})
})
