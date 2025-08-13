import type { Chat } from '@nwrx/ai'
import type { ThreadEventObject, ThreadObject } from '@nwrx/nano-api'

export interface ThreadChat {
  messages: ThreadChat.Message[]
}

export namespace ThreadChat {
  export interface Message {
    user?: string
    nodeId: string
    requestId: string
    createdAt: string
    usage: Chat.Usage
    element?: HTMLDivElement
    pendingTextNodes: Text[]
    setElement: (element: ComponentPublicInstance | Element | null) => void
  }
}

export function useThreadChat(thread: Ref<ThreadObject>): ThreadChat {
  const messages = ref<ThreadChat.Message[]>([])
  let processedEventCount = 0

  function handleEvent(event: ThreadEventObject) {
    if (event.message.event !== 'nodeChatEvent') return
    const [nodeId, requestId, data] = event.message.data

    // --- Find the message by requestId or create a new one.
    let message = messages.value.find(x => x.requestId === requestId)
    if (!message) {
      const createdAt = event.createdAt || new Date().toISOString()
      message = {
        nodeId,
        requestId,
        createdAt,
        usage: {} as Chat.Usage,
        pendingTextNodes: [],
        setElement: (element) => {
          if (!element) return
          if (!message) return
          if (message.element) return
          message.element = element as HTMLDivElement
          for (const node of message.pendingTextNodes) message.element.prepend(node)
          message.pendingTextNodes = []
        },
      }
      messages.value.push(message)
      messages.value = [...messages.value]
    }

    // --- When a text delta is received, append it as a DOM `Text` node. We do this
    // --- to bypass the Vue reactivity system and avoid unnecessary re-renders as it
    // --- can be very expensive for large messages.
    if (data.type === 'text-delta') {
      const textNode = document.createTextNode(data.delta)
      if (message.element) message.element.append(textNode)
      else message.pendingTextNodes.unshift(textNode)
    }

    else if (data.type === 'response-metadata') {
      message.user = data.modelId ?? 'unknown'
    }

    else if (data.type === 'usage') {
      message.usage ??= {} as Chat.Usage
      message.usage = { ...message.usage, ...data.usage }
    }

    processedEventCount += 1
  }

  /**
   * Processes the events of a thread and handles them accordingly. This function
   * will only process events that have not been processed yet, based on the
   * `processedEventCount` variable.
   *
   * @param thread The thread object containing events to process.
   */
  function processEvents(thread: ThreadObject) {
    if (!thread.events) return
    if (thread.events.length <= processedEventCount) return
    for (const x of thread.events
      .slice(processedEventCount)
      .sort((a, b) => a.index - b.index)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))) handleEvent(x)
  }

  watch(
    () => thread.value,
    thread => processEvents(thread),
    { deep: true, immediate: true },
  )

  watch(() => thread.value.id, (id, oldId) => {
    if (id !== oldId) {
      messages.value = []
      processedEventCount = 0
    }
  })

  return toReactive({
    messages,
  })
}
