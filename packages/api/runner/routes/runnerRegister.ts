import type { RunnerObject } from '../entities'
import type { ModuleRunner } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { registerRunner } from '../utils/registerRunner'

export function runnerRegister(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'POST /runners',
      parseBody: createParser({
        address: assert.stringNotEmpty,
        token: assert.stringNotEmpty,
      }),
    },
    async({ event, body }): Promise<RunnerObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runner = await registerRunner.call(this, { user, ...body })
      return runner.serialize({
        withCreatedBy: true,
        withUpdatedBy: true,
        withDisabledBy: true,
      })
    },
  )
}
