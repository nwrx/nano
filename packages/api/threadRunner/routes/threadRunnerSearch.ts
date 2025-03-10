import type { ModuleThreadRunner } from '..'
import type { ThreadRunner } from '../entities'
import type { ThreadRunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { type FindOptionsOrder, ILike } from 'typeorm'
import { ModuleUser } from '../../user'

export function searchThreadRunner(this: ModuleThreadRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners',
      parseQuery: createSchema({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<ThreadRunner>]],
      }),
    },
    async({ event, query }): Promise<ThreadRunnerObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Assert the user is a super administrator.
      if (!user.isSuperAdministrator)
        throw moduleUser.errors.USER_FORBIDDEN()

      // --- Get runners from the database.
      const { page = 1, limit = 10, search = '', order = { createdAt: 'DESC' } } = query
      const { ThreadRunner } = this.getRepositories()
      const runners = await ThreadRunner.find({
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
