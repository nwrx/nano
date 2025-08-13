<script setup lang="ts">
import type { ThreadChat } from '~/composables/useThread'

defineProps<{
  message: ThreadChat.Message
  setRef: (element: ComponentPublicInstance | Element | null) => void
}>()
</script>

<template>
  <div class="overflow-hidden select-text">
    <div class="text-base text-subtle font-mono mb-sm">
      {{ message.user }}
      {{ message.nodeId.slice(0, 8) }}
    </div>
    <div class="bg-app p-md rd b b-app max-w-2xl whitespace-pre-wrap">

      <!-- Text content, rendered as-is -->
      <div :ref="(el) => setRef(el)" class="whitespace-pre-wrap" />

      <!-- Usage info, if available -->
      <div v-if="message.usage" class="text-xs text-subtle mt-sm">
        <span v-if="message.usage.inputTokens" class="mr-md">
          Prompt: {{ message.usage.inputTokens }} tokens
        </span>
        <span v-if="message.usage.outputTokens">
          Completion: {{ message.usage.outputTokens }} tokens
        </span>
      </div>
    </div>
  </div>
</template>
