<!-- eslint-disable sonarjs/prefer-single-boolean-return -->
<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<!-- eslint-disable sonarjs/no-nested-assignment -->
<script setup lang="ts">
import type { UUID } from 'node:crypto'
import { useThreadChat, useThreads } from '~/composables/useThread'
import ThreadChatMessage from './ThreadChat.Message.vue'
// import Event from './ThreadTree.Event.vue'

const props = defineProps<{
  workspace: string
  project: string
  flow: string
  id?: UUID
}>()

const threads = useThreads(props)
const threadId = computed(() => props.id)
const thread = threads.threadById(threadId)
const chat = useThreadChat(thread)

watch(() => props.id, async(id) => {
  if (!id) return
  await threads.fetchThread(id)
  await threads.subscribeToThread(id)
}, { immediate: true })

onBeforeUnmount(() => {
  if (!props.id) return
  threads.unsubscribeFromThread(props.id)
})
</script>

<template>
  <div class="flex flex-col grow w-full overflow-y-auto overflow-x-clip">
    <div class="pt-md px-md pb-xl space-y-md">

      <!-- Messages -->
      <ThreadChatMessage
        v-for="message in chat.messages"
        :key="message.requestId"
        :message="message"
        :set-ref="(el) => message.setElement(el)"
      />
    </div>
  </div>
</template>
