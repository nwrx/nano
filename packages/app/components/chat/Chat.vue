<script setup lang="ts">
import type { ChatThreadObject, WorkspaceProjectObject } from '@nwrx/api'
import type { UUID } from 'node:crypto'

const props = defineProps<{
  search?: string
  thread?: ChatThreadObject
  threads?: ChatThreadObject[]
  projects?: WorkspaceProjectObject[]
}>()

const emit = defineEmits<{
  createThread: [project: string, flow: string]
  openThread: [id: UUID]
  archiveThread: [id: string]
  renameThread: [id: string, title: string]
  sendMessage: [message: string]
  'update:search': [value: string]
}>()

const search = useVModel(props, 'search', emit, { passive: true })
</script>

<template>
  <div class="flex h-full relative">

    <!-- Threads & Flow selection -->
    <ChatPanel
      v-model:search="search"
      class="w-lg"
      :threads="threads"
      :projects="projects"
      @open-thread="(id) => emit('openThread', id)"
      @create-thread="(project, flow) => emit('createThread', project, flow)"
      @archive-thread="(id) => emit('archiveThread', id)"
      @rename-thread="(id, title) => emit('renameThread', id, title)"
    />

    <!-- Current Thread -->
    <ChatThread
      v-if="thread"
      :title="thread.title"
      :description="thread.description"
      :messages="thread.messages"
      class="w-full"
      @send-message="(message) => emit('sendMessage', message)"
    />

    <!-- Select Thread Hint / Full page -->
    <div v-else class="flex items-center justify-center w-full h-full">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-white">
          Select a thread
        </h1>
        <p class="text-white">
          Select a thread to start chatting
        </p>
      </div>
    </div>
  </div>
</template>
