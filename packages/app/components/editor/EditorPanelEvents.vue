<script setup lang="ts">
import type { FlowSessionEventName, FlowSessionEventPayload, FlowThreadNodeJSON } from '@nwrx/api'

const props = defineProps<{
  events?: FlowSessionEventPayload[]
  nodes?: FlowThreadNodeJSON[]
}>()

const emit = defineEmits<{
  'clear': []
}>()

const EVENTS_WHITELIST = new Set<FlowSessionEventName>([
  'thread:start',
  'thread:end',
  'thread:nodeError',
  'thread:nodeTrace',
  'thread:nodeEnd',
])

// --- Compute the given node based on the event.
function getNode(event: FlowSessionEventPayload): FlowThreadNodeJSON | undefined {
  return (props.nodes ?? []).find((node) => {
    if ('id' in event) return node.id === event.id
    return false
  })
}

// --- State
const filter = ref<string>('')
const eventsFiltered = computed(() => {
  const filterLower = filter.value.toLowerCase()
  return (props.events ?? [])
    .filter((event) => {
      if (!EVENTS_WHITELIST.has(event.event)) return false
      if (event.event.includes(filterLower)) return true

      // --- Filter by event name.
      if (!filterLower) return true
      if (event.event.toLowerCase().includes(filterLower)) return true

      // --- Filter by node.
      const node = getNode(event)
      if (!node) return false
      if (node.name.toLowerCase().includes(filterLower)) return true
      if (node.kind.toLowerCase().includes(filterLower)) return true
      return node.id.toLowerCase().includes(filterLower)
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

    <!-- Filter -->
    <EditorPanelSection title="Filter" text="Filter events by type or node.">
      <InputText
        v-model="filter"
        placeholder="Filter events..."
      />
    </EditorPanelSection>

    <!-- Events -->
    <EditorPanelEventsEvent
      v-for="(event, index) in eventsFiltered"
      :key="index"
      :event="event"
      :node="getNode(event)"
    />
  </div>
</template>
