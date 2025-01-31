<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'

const props = defineProps<{
  isEventsOpen: boolean
  events: FlowSessionEventPayload[]
}>()

const emit = defineEmits<{
  'update:isEventsOpen': [isOpen: boolean]
  'clear': []
}>()

// --- State
const isOpen = useVModel(props, 'isEventsOpen', emit, { passive: true })
</script>

<template>
  <div>

    <!-- Events -->
    <FlowEditorPanelSectionEvents
      v-model="isOpen"
      :events="events"
      @clear="() => emit('clear')"
    />
  </div>
</template>
