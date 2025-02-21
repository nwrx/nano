/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-base-to-string */
import type { FlowV1 } from '@nwrx/nano'
import type { TestApplication } from '@unserved/server'
import type { ThreadWorkerMessage } from '../worker'
import { createTestApplication } from '@unserved/server'
import { randomUUID } from 'node:crypto'
import { WebSocket } from 'ws'
import { ModuleRunner } from '../application'

interface Context {
  application: TestApplication<ModuleRunner>
  moduleRunner: ModuleRunner
  headers: Record<string, string>
  address: string
}

async function createConnection(context: Context, flow: FlowV1) {
  const { headers, application, moduleRunner } = context
  const body = JSON.stringify({ flow })
  const response = await application.fetch('/threads', { method: 'POST', body, headers })
  const data = await response.json() as { id: string }
  const address = `ws+unix:${application.socketPath}:/threads/${data.id}?token=${moduleRunner.runnerToken}`
  const ws = new WebSocket(address, { headers })
  await new Promise<void>(resolve => ws.on('open', resolve))
  return ws
}

async function startThread(ws: WebSocket, data: Record<string, unknown>) {
  ws.send(JSON.stringify({ event: 'start', data }))
  return await new Promise((resolve, reject) => {
    ws.on('message', (message) => {
      const utf8 = message.toString()
      const data = JSON.parse(utf8) as ThreadWorkerMessage
      if (data.event === 'done') resolve(data.data[0])
      if (data.event === 'error') {
        const error = new Error(data.data[0].message)
        error.name = data.data[0].name
        error.stack = data.data[0].stack
        reject(error)
      }
    })
  })
}

describe<Context>('WS /threads/:id', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    context.application = await createTestApplication([ModuleRunner])
    context.moduleRunner = context.application.getModule(ModuleRunner)
    context.headers = { 'X-Forwarded-For': '127.0.0.1', 'Authorization': `Bearer ${context.moduleRunner.runnerToken}` }
    await context.application.createTestServer()

    // --- Since we're using Unix sockets, there is not remote address to get the IP from.
    // --- We need to trust the proxy to get the IP from the X-Forwarded-For header.
    context.moduleRunner.runnerTrustProxy = true
  })

  afterEach<Context>(async({ application }) => {
    await application.destroy()
  })

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

  describe<Context>('threadSession', (it) => {
    it('should upgrade the connection to a WebSocket', async({ headers, application }) => {
      const body = JSON.stringify(flow)
      const response = await application.fetch('/threads', { method: 'POST', body, headers })
      const { id } = await response.json() as { id: string }
      const upgrade = await application.fetch(`/threads/${id}`, { headers })
      expect(upgrade).toMatchObject({ status: 426, statusText: 'Upgrade Required' })
    })

    it('should start a thread and return the output', async(context) => {
      const ws = await createConnection(context, flow)
      const output = await startThread(ws, { name: 'Alice' })
      expect(output).toStrictEqual({ greet: 'Hello, Alice!' })
    })

    it('should collect all the messages from the thread', async(context) => {
      const ws = await createConnection(context, flow)
      const messages: ThreadWorkerMessage[] = []
      ws.on('message', message => messages.push(JSON.parse(message.toString())))
      await startThread(ws, { name: 'Alice' })
      expect(messages).toHaveLength(18)
    })
  })

  describe<Context>('errors', (it) => {
    it('should fail with "E_THREAD_NOT_FOUND" if the thread does not exist', async({ headers, application, moduleRunner }) => {
      const id = randomUUID()
      const token = moduleRunner.runnerToken
      const ws = new WebSocket(`ws+unix:${application.socketPath}:/threads/${id}?token=${token}`, { headers })
      const data: Buffer = await new Promise(resolve => ws.on('message', resolve))
      const utf8 = data.toString()
      const event = JSON.parse(utf8) as ThreadWorkerMessage
      expect(event).toMatchObject({
        event: 'error',
        data: [{ data: { name: 'E_THREAD_NOT_FOUND' } }],
      })
    })
  })
})
