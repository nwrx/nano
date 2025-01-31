import type { ModuleRunner } from '@nwrx/runner'
import type { ServerErrorName } from '@unserved/server'
import type { ObjectLike } from '@unshared/types'
import type { ModuleThread } from '../index'
import { createClient } from '@unserved/client'
import { createError } from '@unserved/server'

export class ThreadRunner {
  constructor(baseUrl: string) {
    this.client.options.baseUrl = baseUrl
  }

  private client = createClient<ModuleRunner>({
    onFailure: async(response) => {
      const data = await response.json() as { data: ObjectLike }
      throw createError({
        name: data.data.name as ServerErrorName,
        message: data.data.message as string,
        statusCode: response.status,
        statusMessage: response.statusText,
      })
    },
  })

  async claim() {
    const { token } = await this.client.request('POST /claim')
    this.client.options.headers = { Authorization: `Bearer ${token}` }
  }

  async ping() {
    return await this.client.request('GET /ping')
  }

  async getStatus() {
    return await this.client.request('GET /status')
  }
}

export async function registerThreadRunner(this: ModuleThread, baseUrl: string): Promise<ThreadRunner> {
  const runner = new ThreadRunner(baseUrl)
  await runner.claim()
  await runner.ping()
  return runner
}
