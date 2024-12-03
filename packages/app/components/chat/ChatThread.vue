<script setup lang="ts">
import type { ChatMessageObject } from '@nwrx/api'

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
  <div class="flex flex-col w-full h-full select-text relative p-md">

    <!-- Title -->
    <div class="w-full mx-auto max-w-thread">
      <h1 class="text-2xl font-bold text-app">
        {{ title }}
      </h1>
      <p class="text-app">
        {{ description }}
      </p>
    </div>

    <!-- Messages -->
    <div class="flex flex-col w-full mx-auto max-w-thread overflow-y-auto">
      <TransitionGroup name="slide">
        <template v-for="{ id, data } in messages" :key="id">

          <ChatThreadMessageUserMessage
            v-if="data.role === 'user'"
            :name="data.name"
            :content="data.content"
            class="self-end my-lg first:mt-0"
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
    </div>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Input -->
    <ChatThreadInput
      @send-message="(message) => emit('sendMessage', message)"
      @submit-attachment="() => {}"
    />
  </div>
</template>
