<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'

defineProps<{
  events: FlowSessionEventPayload[]
}>()

const emit = defineEmits<{
  'clear': []
}>()
</script>

<template>
  <div>
    <!-- Clear button -->
    <BaseButton
      v-if="events.length > 0"
      class="w-full mb-2"
      label="Clear events"
      @click="() => emit('clear')"
    />

    <FlowEditorPanelSectionEvent
      v-for="(event, index) in events"
      :key="index"
      :event="event"
    />
  </div>
</template>
