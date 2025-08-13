<!-- eslint-disable sonarjs/prefer-single-boolean-return -->
<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<!-- eslint-disable sonarjs/no-nested-assignment -->
<script setup lang="ts">
import type { UUID } from 'node:crypto'
import { getThreadChat, useThreads } from '~/composables/useThread'
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
const chat = getThreadChat(thread)

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
    <div class="pt-md px-md pb-xl">

      <!-- Messages -->
      <div v-for="(message, index) in chat.messages" :key="index" class="overflow-hidden select-text">
        <div class="text-base text-subtle font-mono mb-sm">
          {{ message.user }}
          {{ message.nodeId.slice(0, 8) }}
        </div>
        <div class="bg-app p-md rd b b-app max-w-2xl whitespace-pre-wrap font-mono">
          <!-- <div :ref="(el) => message.element = el" /> -->
          <!-- <span>{{ message.text }}</span> -->

          <template v-if="message.chunks && message.chunks.length > 0">
            <template v-for="(chunk, i) in message.chunks" :key="i">
              {{ chunk }}
            </template>
          </template>

          <template v-else-if="message.text">
            <span>{{ message.text }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
