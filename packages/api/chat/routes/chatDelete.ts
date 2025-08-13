import type { ModuleChat } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'

export function chatDelete(this: ModuleChat) {
  return createHttpRoute(
    {
      name: 'DELETE /workspaces/:workspace/threads/:id',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
        id: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, id } = parameters

      const { ChatThread } = this.getRepositories()
      const chatThread = await ChatThread.findOne({
        where: {
          id,
          flow: { project: { workspace: { name: workspace } } },
          createdBy: user,
        },
        relations: { createdBy: true },
      })

      if (!chatThread) throw new Error('Thread not found.')
      await ChatThread.softRemove(chatThread)
      setResponseStatus(event, 204)
    },
  )
}
