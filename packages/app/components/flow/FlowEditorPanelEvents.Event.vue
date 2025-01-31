<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload
  node?: NodeInstanceJSON
}>()

// --- Localization
const isOpen = ref(false)
</script>

<template>
  <div
    class="flex flex-col items-start border-editor not-first:border-t"
    :class="{ '!bg-emphasized/50': isOpen }">

    <!-- Header -->
    <FlowEditorPanelEventsEventHeader
      v-model:isOpen="isOpen"
      :event="event"
      :node="node"
    />

    <!-- Detail -->
    <BaseCollapse
      vertical
      :isOpen="isOpen"
      class="w-full transition-all"
      :class="{ 'op-0 pointer-events-none': !isOpen }">

      <!-- Content -->
      <div class="w-full p-md pt-xs space-y-sm">
        <FlowEditorPanelEventsFlowStart v-if="event.event === 'flow:start'" :event="event"/>
        <FlowEditorPanelEventsFlowEnd v-if="event.event === 'flow:end'" :event="event"/>
        <FlowEditorPanelEventsNodeEnd v-if="event.event === 'node:end'" :event="event" :node="node"/>
        <FlowEditorPanelEventsNodeError v-if="event.event === 'node:error'" :event="event"/>
      </div>
    </BaseCollapse>
  </div>
</template>
