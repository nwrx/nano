import type { FlowV1, ThreadInputObject } from '@nwrx/nano'
import type { ModuleRunner } from '@nwrx/runner'
import type { Channels, Routes } from '@unserved/client'
import type { Client } from '@unshared/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
import type { ObjectLike } from '@unshared/types'
import type { ModuleThread } from '../index'
import { createClient } from '@unserved/client'

export class ThreadClient {
  constructor(baseUrl: string) {
    this.client = createClient<ModuleRunner>({ baseUrl })
  }

  private client: Client<Routes<ModuleRunner>, Channels<ModuleRunner>>
  private channel: WebSocketChannel<Channels<ModuleRunner>['WS /thread']>

  async create(data: FlowV1): Promise<string> {
    this.channel = await this.client.connect('WS /thread')
    this.channel.send({ event: 'create', data })
    return await new Promise<string>((resolve) => {
      this.channel.on('message', (message) => {
        if (message.event !== 'worker:created') return
        const [id] = message.data
        resolve(id)
      })
    })
  }

  async start(data: ThreadInputObject): Promise<ObjectLike> {
    this.channel.send({ event: 'start', data })
    return await new Promise<ObjectLike>((resolve) => {
      this.channel.on('message', (message) => {
        if (message.event !== 'done') return
        const [result] = message.data
        resolve(result)
      })
    })
  }

  async abort() {
    this.channel.send({ event: 'abort' })
    return await new Promise<void>((resolve) => {
      this.channel.on('message', (message) => {
        if (message.event === 'abort') resolve()
      })
    })
  }
}

export function createThreadClient(this: ModuleThread, baseUrl: string) {
  return new ThreadClient(baseUrl)
}
