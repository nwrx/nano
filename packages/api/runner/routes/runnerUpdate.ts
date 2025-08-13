import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getRunner, updateRunner } from '../utils'

export function runnerUpdate(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'PUT /runners/:name',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        address: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters })
      await updateRunner.call(this, { user, runner, ...body })
    },
  )
}
