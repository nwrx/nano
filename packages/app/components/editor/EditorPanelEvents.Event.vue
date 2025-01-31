<script setup lang="ts">
import type { FlowSessionEventPayload, FlowThreadNodeJSON } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload
  node?: FlowThreadNodeJSON
}>()

// --- Localization
const isOpen = ref(false)
</script>

<template>
  <div
    class="flex flex-col items-start border-editor not-first:border-t"
    :class="{ '!bg-emphasized/50': isOpen }">

    <!-- Header -->
    <EditorPanelEventsEventHeader
      v-model:is-open="isOpen"
      :event="event"
      :node="node"
    />

    <!-- Detail -->
    <BaseCollapse
      vertical
      :is-open="isOpen"
      class="w-full transition-all overflow-clip"
      :class="{ 'op-0 pointer-events-none': !isOpen }">

      <!-- Content -->
      <div class="w-full p-md pt-xs space-y-sm">
        <EditorPanelEventsEventMeta :event="event" />
        <EditorPanelEventsThreadStart v-if="event.event === 'thread:start'" :event="event" />
        <EditorPanelEventsThreadEnd v-if="event.event === 'thread:end'" :event="event" />
        <EditorPanelEventsThreadNodeEnd v-if="event.event === 'thread:nodeEnd'" :event="event" :node="node" />
        <EditorPanelEventsThreadNodeError v-if="event.event === 'thread:nodeError'" :event="event" />
      </div>
    </BaseCollapse>
  </div>

  <!-- Separator when end -->
  <div
    v-if="event.event === 'thread:end'"
    class="bg-diagonalstripes-white/10 h-8 w-full last:hidden b-y b-editor"
  />
</template>
