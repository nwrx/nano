import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getRunner, releaseRunner } from '../utils'

export function runnerRelease(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'DELETE /api/runners/:name',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters })
      await releaseRunner.call(this, { user, runner })
    },
  )
}
