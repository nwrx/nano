import type { EventStream } from '@unserved/server'
import type { ModuleRunner } from '../index'
import type { RunnerStatus } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getRunner, getRunnerClient } from '../utils'

export function runnerStatus(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:name/status',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<EventStream<RunnerStatus>> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters })
      const client = getRunnerClient.call(this, { runner })
      return client.status.subscribe(event)
    },
  )
}
