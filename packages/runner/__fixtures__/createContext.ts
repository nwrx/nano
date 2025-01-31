import type { Server } from 'node:http'
import { Application } from '@unserved/server'
import { createResolvable } from '@unshared/functions'
import { randomUUID } from 'node:crypto'
import { rm } from 'node:fs/promises'
import { request } from 'node:http'
import { DataSource } from 'typeorm'
import { ModuleRunner } from '..'

export interface Context {
  ctx: Awaited<ReturnType<typeof createContext>>
}

export async function createContext() {
  const id = randomUUID()
  const socketPath = `/tmp/${id}.sock`
  const application = await Application.initialize([ModuleRunner], {
    dataSource: new DataSource({
      name: id,
      type: 'sqlite',
      synchronize: true,
      database: ':memory:',
    }),
  })

  return {
    application,
    server: undefined as Server | undefined,

    /************************************************/
    /* Module instances.                            */
    /************************************************/

    get ModuleRunner() {
      return this.application.getModule(ModuleRunner)
    },

    /************************************************/
    /* Module instances.                            */
    /************************************************/

    async createServer(): Promise<void> {
      this.server = this.application.createServer({
        onRequest(event) { event.context.clientAddress = '127.0.0.1' },
      })
      await new Promise((resolve, reject) => {
        this.server!.on('error', reject)
        this.server!.on('listening', resolve)
        this.server!.listen(socketPath)
      })
    },

    fetch: async(path: string, options: RequestInit = {}): Promise<Response> => {
      const { method = 'GET', headers = {}, body } = options
      const resolvable = createResolvable<Response>()
      const clientRequest = request({
        path,
        method,
        socketPath,
        headers: headers as Record<string, string>,
      },

      // --- Handle incoming response.
      (response) => {
        const body = new ReadableStream<Uint8Array>({
          start(controller) {
            response.on('data', (chunk: Uint8Array) => controller.enqueue(chunk))
            response.on('error', error => controller.error(error))
            response.on('end', () => controller.close())
          },
        })

        const bytes = async() => {
          const reader = body.getReader()
          const chunks: Uint8Array[] = []
          while (true) {
            const { done, value } = await reader.read()
            if (done || !value) break
            chunks.push(value)
          }
          const buffer = Buffer.concat(chunks)
          return Uint8Array.from(buffer)
        }

        const text = async() => {
          const buffer = await bytes()
          const text = [...buffer].map(x => String.fromCodePoint(x)).join('')
          return text
        }

        resolvable.resolve({
          ok: response.statusCode! >= 200 && response.statusCode! < 300,
          status: response.statusCode!,
          statusText: response.statusMessage!,
          headers: new Headers(response.headers as Record<string, string>),
          body,
          get bodyUsed() { return body.locked },
          bytes,
          text,
          json: () => text().then(JSON.parse),
          arrayBuffer: () => bytes().then(buffer => buffer.buffer),
        } as Response)
      })

      // --- Write the request body.
      if (body) clientRequest.write(body)
      clientRequest.on('error', resolvable.reject)
      clientRequest.end()
      return resolvable.promise
    },

    async destroy() {
      this.server?.close()
      await rm(socketPath, { force: true })
      await this.application?.dataSource?.destroy()
      this.server = undefined
    },
  }
}
