/* eslint-disable sonarjs/todo-tag */
import type { ChatServerMessage, ChatThreadObject } from '@nwrx/api'
import type { UUID } from 'node:crypto'
import { useAlerts, useClient } from '#imports'

export function useChat(workspace: MaybeRef<string>) {
  const client = useClient()
  const alerts = useAlerts()
  const threads = ref([] as ChatThreadObject[])

  const thread = reactive({} as ChatThreadObject)

  const channel = client.connect('WS /ws/chat/:workspace', {
    data: { workspace: unref(workspace) },
    // @ts-expect-error: TODO Fix in `@unserved/client`
    onMessage: (payload: ChatServerMessage) => {
      switch (payload.event) {

        /***************************************************************************/
        /* Lifecycle                                                               */
        /***************************************************************************/

        case 'error': {
          const { message } = payload
          alerts.error(message)
          break
        }

        case 'threadOpened': {
          const { id, title, summary, messages } = payload
          thread.id = id
          thread.title = title
          thread.description = summary
          thread.messages = messages
          break
        }

        case 'message': {
          const { id, createdAt, data } = payload
          thread.messages = thread.messages ?? []
          thread.messages = [...thread.messages, { id, createdAt, data }]
          break
        }
      }
    },
  })

  return {
    thread,
    threads,
    channel,

    refresh: () => client.requestAttempt('GET /api/workspaces/:workspace/threads', {
      data: { workspace: unref(workspace) },
      onData: data => threads.value = data,
      onError: alerts.error,
    }),

    createThread: (project: string, name: string) => {
      channel.send({ event: 'createThread', project, name })
    },

    openThread: (id: UUID) => {
      channel.send({ event: 'openThread', id })
    },

    sendMessage: (message: string) => {
      channel.send({ event: 'message', message })
    },
  }
}
