<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  events: FlowSessionEventPayload[]
  nodes: NodeInstanceJSON[]
}>()

const emit = defineEmits<{
  'clear': []
}>()

// --- State
const filter = ref<string>('')
const events = computed(() => {
  if (!filter.value) return props.events
  const filterLower = filter.value.toLowerCase()
  return props.events.filter((event) => {
    if (event.event.toLowerCase().includes(filterLower)) return true
    return 'id' in event && event.id.toLowerCase().includes(filterLower)
  })
})
</script>

<template>
  <div>
    <BaseButton
      class="w-full mb-2"
      label="Clear events"
      @click="() => emit('clear')"
    />

    <!-- Filter Text Input -->
    <FlowEditorPanelSection
      title="Filter"
      text="Filter events by type or node.">

      <InputText
        v-model="filter"
        placeholder="Filter events..."
      />
    </FlowEditorPanelSection>

    <FlowEditorPanelSectionEvent
      v-for="(event, index) in events"
      :key="index"
      :event="event"
      :nodes="nodes"
    />
  </div>
</template>
