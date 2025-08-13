import type { ModuleRunner } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { disableRunner, getRunner } from '../utils'

export function runnerDisable(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'PUT /runners/:name/disable',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters })
      await disableRunner.call(this, { user, runner })
    },
  )
}
