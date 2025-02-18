<script setup lang="ts">
import type { ChatMessageObject } from '@nwrx/nano-api'

const props = defineProps<{
  messages?: ChatMessageObject[]
}>()

interface ChatMessageProcessed extends ChatMessageObject {
  isDone?: boolean
  toolName?: string
  toolMessage?: string
}

const messagesProcessed = computed(() => {
  if (!props.messages) return []
  const results: ChatMessageProcessed[] = []
  for (const message of props.messages) {

    // --- If message is a tool call request, save the tool message.
    if (message.data.role === 'toolCallRequest') {
      results.push({
        ...message,
        toolName: message.data.content?.__toolName as string,
        toolMessage: message.data.content?.__toolMessage as string,
        isDone: false,
      })
    }

    // --- If message is a tool call response, remove the request.
    else if (message.data.role === 'toolCallResponse') {
      const id = message.data.id
      const requestMessage = results.find(x => x.data.role === 'toolCallRequest' && x.data.id === id)
      if (requestMessage) requestMessage.isDone = true
    }

    // --- Push message
    else {
      results.push({ ...message })
    }
  }
  return results
})
</script>

<template>
  <TransitionGroup name="slide">
    <template v-for="{ id, data, isDone, toolMessage, toolName, createdAt } in messagesProcessed" :key="createdAt">
      <ChatThreadMessageUserMessage
        v-if="data.role === 'user'"
        :name="data.name"
        :content="data.content"
        class="self-end my-lg first:mt-0"
      />

      <ChatThreadMessageTool
        v-else-if="data.role === 'toolCallRequest' || data.role === 'toolCallResponse'"
        :id="data.id"
        :content="data.content"
        :tool-name="toolName"
        :tool-message="toolMessage"
        :is-done="isDone"
        class="self-start my-lg first:mt-0"
      />

      <template v-if="data.role === 'assistant'">
        <ChatThreadMessageAgentMessage
          v-if="typeof data.content === 'string'"
          :content="data.content"
          class="self-start my-md"
        />
      </template>
    </template>
  </TransitionGroup>
</template>
