import type { Chat } from '@nwrx/ai'
import type { ThreadObject } from '@nwrx/nano-api'

export interface ThreadChat {
  messages: ThreadChat.Message[]
}

export namespace ThreadChat {
  export interface Message {
    chunks?: string[]
    text?: string
    user?: string
    nodeId: string
    requestId: string
    timestamp: string
    usage?: Chat.Usage
    element?: HTMLDivElement
  }
}

export function getThreadChat(thread: Ref<ThreadObject>): ThreadChat {
  const messages = ref<ThreadChat.Message[]>([])
  let processedEventCount = 0

  watch(() => thread.value.id, (id, oldId) => {
    if (id !== oldId) {
      messages.value = []
      processedEventCount = 0
    }
  })

  watch(() => thread.value, (thread) => {
    const events = thread.events
    if (!events || events.length <= processedEventCount) return
    const newEvents = events
      .slice(processedEventCount)
      .sort((a, b) => a.index - b.index)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    for (const event of newEvents) {
      if (event.message.event !== 'nodeChatEvent') continue
      const [nodeId, requestId, data] = event.message.data

      let message = messages.value.find(x => x.requestId === requestId)
      if (!message) {
        message = { nodeId, requestId, timestamp: event.createdAt }
        messages.value.push(message)
        messages.value = [...messages.value]
      }

      // if (data.type === 'text-end') {
      //   message.chunks = []
      //   message.abc = data.
      // }

      if (data.type === 'text-delta') {
        message.chunks ??= []
        message.chunks.push(data.delta)
        // if (!message.element) return
        // const textNode = document.createTextNode(data.delta)
        // message.element.append(textNode)
      }

      // else if (data.type === 'text-end') {
      //   message.chunks ??= []
      //   message.text = message.chunks.join('')
      // }

      else if (data.type === 'response-metadata') {
        message.user = data.modelId ?? 'unknown'
      }
      else if (data.type === 'usage') {
        message.usage ??= {} as Chat.Usage
        // message.usage = { ...message.usage, ...data.usage }
      }
    }

    processedEventCount = events.length
  }, { deep: true, immediate: true })

  return toReactive({
    messages,
  })
}
