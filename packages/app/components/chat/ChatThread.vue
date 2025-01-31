<script setup lang="ts">
import type { ChatMessageObject } from '@nwrx/nano-api'

defineProps<{
  title?: string
  description?: string
  messages?: ChatMessageObject[]
}>()

const emit = defineEmits<{
  sendMessage: [message: string]
}>()
</script>

<template>
  <div class="flex flex-col w-full h-full select-text relative overflow-y-auto">

    <!-- Title -->
    <div
      class="
      sticky top-0 w-full mx-auto max-w-thread bg-app p-lg pb-xl
      mask-to-b-60/100
    ">
      <h1 class="text-2xl font-bold text-app">
        {{ title }}
      </h1>
      <p class="text-app">
        {{ description }}
      </p>
    </div>

    <!-- Messages -->
    <div class="flex flex-col w-full mx-auto max-w-thread px-xl pb-xl">
      <ChatThreadMessages :messages="messages" />
    </div>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Input -->
    <div class="sticky bottom-0 w-full mx-auto max-w-thread bg-app p-lg pt-0">
      <ChatThreadInput
        @send-message="(message) => emit('sendMessage', message)"
        @submit-attachment="() => {}"
      />
    </div>
  </div>
</template>
