import type { ModuleRunner } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { enableRunner, getRunner } from '../utils'

export function runnerEnable(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'PUT /api/runners/:name/enable',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, name: parameters.name })
      await enableRunner.call(this, { user, runner })
    },
  )
}
