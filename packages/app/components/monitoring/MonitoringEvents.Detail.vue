<script setup lang="ts">
import type {
  MonitoringFlowThreadEventObject,
  MonitoringFlowThreadNodeEventObject,
} from '@nwrx/api'

defineProps<{
  type: string
  event: MonitoringFlowThreadEventObject | MonitoringFlowThreadNodeEventObject
}>()

const isOpen = ref(false)

function isThreadStart(event: string, type: string) {
  return event === 'start' && type === 'thread'
}
</script>

<template>
  <div
    class="flex flex-col items-start b-editor not-b:border-t"
    :class="{ '!bg-emphasized/50': isOpen }">

    <!-- Header -->
    <MonitoringEventsItem
      :type="type"
      :event="event"
      :class="{ 'not-first:b-t b-app': isThreadStart(event.event, type) }"
      @click="() => isOpen = !isOpen"
    />

    <!-- Detail -->
    <BaseCollapse
      vertical
      :is-open="isOpen"
      class="w-full transition-all overflow-clip"
      :class="{ 'op-0 pointer-events-none': !isOpen }">

      <!-- Content -->
      <div class="w-full p-md pt-xs space-y-sm">
        <pre>{{ event }}</pre>
      </div>
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
en:
  node: Node
  thread: Thread
  start: Started
  end: Completed
</i18n>
