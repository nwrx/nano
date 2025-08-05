import type { ModuleRunner } from '..'
import type { RunnerObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { searchRunners } from '../utils'

export function searchRunner(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /api/runners',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        sortBy: [[assert.undefined], [assert.stringEnum(['name', 'address', 'createdAt', 'updatedAt'])]],
        sortDirection: [[assert.undefined], [assert.stringEnum(['ASC', 'DESC'])]],
        withCreatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withUpdatedBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDisabledBy: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
        withDeleted: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query }): Promise<RunnerObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const runners = await searchRunners.call(this, { user, ...query })
      return runners.map(runner => runner.serialize(query))
    },
  )
}
