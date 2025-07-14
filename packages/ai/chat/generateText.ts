import type { Client } from '../createClient'
import type { Provider } from '../utils'
import type { Chat } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters } from '../utils'
import { joinUrl } from '../utils/joinUrl'
import { callTool } from './callTool'
import { handleEvent } from './handleEvent'
import { toMessage } from './toMessage'

export async function generateText<T extends Provider = Provider>(
  client: Client<T>,
  request: Chat.Request<T>,
): Promise<ReadableStream<string>> {

  // --- Extract the provider and options from the client.
  const { id = randomUUID(), messages = [], signal, options } = request
  const { chat: chat, baseUrl, name, parameters } = client.provider
  if (!chat) throw new Error(`Provider "${name}" does not support speech-to-text generation`)

  // --- Get the adapter and prepare URL and RequestInit for the fetch request.
  const url = joinUrl(baseUrl, chat.path)
  const init: RequestInit = { method: 'POST', keepalive: true, signal }

  // --- Normalize all `MessageLike` messages to the `Message` format.
  const toMessagePromises = messages.map(message => toMessage(message))
  const allMessages = await Promise.all(toMessagePromises)

  return new ReadableStream<string>({
    start: async(controller) => {

      // --- Create the context that will be passed to the adapter's methods.
      const context: Chat.Context = {
        id,
        provider: client.provider,
        request,
        messages: allMessages,
        isDone: false,
        url,
        init,
        response: undefined,
        pendingMessages: new Map(),
        pendingToolCalls: [],
        controller,
        resume: () => context.isDone = false,
        pushEvent: (event) => {
          client.dispatch('chatEvent', id, event)
          handleEvent(context, event)
        },
      }

      // --- Loop until the finish reason is not a tool call or the stream is closed.
      // --- This allows the model to generate text and handle tool calls in a streaming manner.
      try {
        while (!context.isDone) {
          if (chat.onRequest) await chat.onRequest(context)
          applyParameters({ url, init, parameters, options: client.options })
          applyParameters({ url, init, parameters: chat.parameters, options })

          // --- Make the request to the provider's API.
          client.dispatch('request', id, { url, init })
          client.dispatch('chatRequest', id, context)
          context.response = await fetch(url, init)
          client.dispatch('response', id, context.response)

          // --- Handle the response.
          context.isDone = true
          await chat.onResponse(context)

          // --- If there are pending tool calls, execute them.
          if (context.pendingToolCalls.length > 0) {
            const promises = context.pendingToolCalls.map(x => callTool(context, x))
            await Promise.all(promises)
            context.pendingToolCalls = []
          }
        }

        // --- If the `isDone` flag is set, we can close the stream.
        if (context.isDone) return controller.close()
      }
      catch (error) {
        controller.error(error)
        client.dispatch('chatError', id, error as Error)
      }
    },
  })
}
