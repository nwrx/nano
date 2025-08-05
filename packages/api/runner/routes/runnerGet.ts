import type { EventStream } from '@unserved/server'
import type { ModuleRunner } from '..'
import type { RunnerObject } from '../entities'
import type { RunnerEvent } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getRunner, getRunnerEvents } from '../utils'

export function runnerGet(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:name',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabledBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }): Promise<RunnerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters, ...query })
      return runner.serialize(query)
    },
  )
}

export function runnerGetEvents(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners/:name/events',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<EventStream<RunnerEvent>> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters })
      const events = getRunnerEvents.call(this, { runner, createIfNotExists: true })
      return events!.subscribe(event)
    },
  )
}
