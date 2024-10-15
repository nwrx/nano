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
const container = ref<HTMLElement>()
const filter = ref<string>('')

// --- Scroll to bottom if the container is already at the bottom.
async function scrollToBottom() {
  if (!container.value) return
  const { scrollHeight, scrollTop, clientHeight } = container.value
  const stickyHeight = 250
  if (scrollHeight - scrollTop > clientHeight + stickyHeight) return
  await nextTick()
  container.value.scrollTo({ top: scrollHeight, behavior: 'smooth' })
}

// --- When a new event is added, scroll to the bottom if the container is already at the bottom.
watch(() => props.events, scrollToBottom, { deep: true })
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
      @click="() => scrollToBottom()"
    />
  </div>
</template>
