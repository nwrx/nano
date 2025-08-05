import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getRunner, renameRunner } from '../utils'

export function runnerRename(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'PUT /api/runners/:name/rename',
      parseParameters: createParser({
        name: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await getRunner.call(this, { user, ...parameters })
      await renameRunner.call(this, { user, runner, ...body })
    },
  )
}
