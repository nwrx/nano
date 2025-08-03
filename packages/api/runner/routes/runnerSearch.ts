import type { ModuleRunner } from '..'
import type { Runner } from '../entities'
import type { RunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { type FindOptionsOrder, ILike } from 'typeorm'
import { ModuleUser } from '../../user'

export function searchRunner(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<Runner>]],
      }),
    },
    async({ event, query }): Promise<RunnerObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator)
        throw moduleUser.errors.USER_FORBIDDEN()

      // --- Get runners from the database.
      const { page = 1, limit = 10, search = '', order = { createdAt: 'DESC' } } = query
      const { Runner } = this.getRepositories()
      const runners = await Runner.find({
        where: [
          { address: ILike(`%${search}%`) },
          { identity: ILike(`%${search}%`) },
        ],
        order,
        take: limit,
        skip: (page - 1) * limit,
      })

      // --- Return the thread runners.
      return runners.map(runner => runner.serialize())
    },
  )
}
