import type { ModuleChat } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertStringNumber, assertUndefined, createSchema } from '@unshared/validation'
import { ILike } from 'typeorm'
import { ModuleUser } from '../../user'

export function threadSearch(this: ModuleChat) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/threads',
      parseParameters: createSchema({ workspace: assertStringNotEmpty }),
      parseQuery: createSchema({
        search: [[assertUndefined], [assertStringNotEmpty]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        withMessages: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace } = parameters
      const {
        search,
        page = 1,
        limit = 20,
        withMessages = false,
      } = query

      const { ChatThread } = this.getRepositories()
      const threads = await ChatThread.find({
        where: [
          {
            flow: { project: { workspace: { name: workspace } } },
            title: search ? ILike(`%${search}%`) : undefined,
            createdBy: user.isSuperAdministrator ? undefined : user,
          },
          {
            flow: { project: { workspace: { name: workspace } } },
            description: search ? ILike(`%${search}%`) : undefined,
            createdBy: user.isSuperAdministrator ? undefined : user,
          },
        ],
        skip: page ? (page - 1) * limit : undefined,
        take: limit,
        relations: {
          flow: { project: { workspace: true } },
          createdBy: true,
          messages: withMessages,
        },
      })

      return threads.map(thread => thread.serialize({ withMessages }))
    },
  )
}
