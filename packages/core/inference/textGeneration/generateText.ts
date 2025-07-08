import type { Provider } from '../createProvider'
import type { TextGeneration } from './types'
import { randomUUID } from 'node:crypto'
import { applyParameters } from '../utils'
import { joinUrl } from '../utils/joinUrl'
import { callTool } from './callTool'
import { handleEvent } from './handleEvent'
import { normalizeMessage } from './normalizeMessage'

export function generateText(this: Provider, request: TextGeneration.Request): ReadableStream<string> {

  // --- Destructure the request options.
  const {
    model,
    messages = [],
    options = {},
    abortSignal = new AbortController().signal,
  } = request

  // --- Destructure the provider options.
  const {
    name,
    baseUrl,
    features = {},
    parameters: providerParameters = [],
    fetch = globalThis.fetch,
  } = this.provider

  // --- Assert that the provider and model supports text generation.
  if (!model) throw new Error('The model is not defined or is invalid.')
  if (!baseUrl) throw new Error(`The provider "${name}" does not have a valid base URL.`)
  if (!features) throw new Error(`The provider "${name}" does not have a valid adapter type.`)
  if (!features.textGeneration) throw new Error(`The provider "${name}" does not support text generation.`)
  if (!features.textGeneration.path) throw new Error(`The provider "${name}" does not have a valid path for text generation.`)
  if (!features.textGeneration.onRequest) throw new Error(`The provider "${name}" does not have a valid onRequest method for text generation.`)
  if (!features.textGeneration.onResponse) throw new Error(`The provider "${name}" does not have a valid onResponse method for text generation.`)

  // --- Merge the adapter's features with the provider's features.
  const { path, parameters: featureParameters = [], onRequest, onResponse } = features.textGeneration

  // --- Merge the mappings from the provider, adapter, and feature.
  const parameters = [...providerParameters, ...featureParameters]

  // --- Get the adapter and prepare URL and RequestInit for the fetch request.
  const url = joinUrl(baseUrl, path)
  const init: RequestInit = {
    method: 'POST',
    keepalive: true,
    signal: abortSignal,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }

  return new ReadableStream<string>({
    start: async(controller) => {

      // --- Resolve all messages to the correct format.
      const toMessagePromises = messages.map(message => normalizeMessage(message))
      const allMessages = await Promise.all(toMessagePromises)

      // --- Create the context that will be passed to the adapter's methods.
      const context: TextGeneration.Context = {
        id: randomUUID(),
        provider: this,
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
        pushEvent: event => handleEvent(context, event),
      }

      // --- Loop until the response is done or an error occurs.
      try {
        while (!context.isDone) {

          // --- Prepare the `URL` and `RequestInit` for the fetch request.
          this.dispatch('textGenerationStart', request)
          await onRequest(context)
          applyParameters({ url, init, parameters, options })

          // --- Make the request to the provider's API.
          this.dispatch('request', { url: context.url, init: context.init })
          context.response = await fetch(url, init)
          this.dispatch('response', context.response)

          // --- Handle the response.
          context.isDone = true
          await onResponse(context)

          // --- If there are pending tool calls, execute them.
          if (context.pendingToolCalls.length > 0) {
            const promises = context.pendingToolCalls.map(x => callTool(context, x))
            await Promise.all(promises)
            context.pendingToolCalls = []
          }
        }

        if (context.isDone) return controller.close()
        const error = new Error('The inference process was interrupted.')
        controller.error(error)
      }
      catch (error) {
        controller.error(error)
      }
    },
  })
}
