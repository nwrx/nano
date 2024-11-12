<script setup lang="ts">
import type {
  MonitoringFlowThreadEventObject,
  MonitoringFlowThreadNodeEventObject,
  MonitoringFlowThreadObject,
  WorkspaceProjectObject,
} from '@nwrx/api'

const props = defineProps<{
  selectedProject?: string
  selectedFlow?: string
  selectedThread?: string
  selectedEvent?: string
  projects?: WorkspaceProjectObject[]
  threads?: MonitoringFlowThreadObject[]
  events?: MonitoringFlowThreadEventObject[]
  nodeEvents?: MonitoringFlowThreadNodeEventObject[]
  eventNames?: string[]
  eventTypes?: string[]
}>()

const emit = defineEmits<{
  selectFlow: [project: string, flow: string]
  selectThread: [thread: string]
  selectEvent: [event: string]
  'update:filters': [value: MonitoringSessionFilters]
}>()

const eventNames = useVModel(props, 'eventNames', emit, { passive: true, defaultValue: [] })
const eventTypes = useVModel(props, 'eventTypes', emit, { passive: true, defaultValue: [] })
</script>

<template>
  <div class="flex items-stretch h-full bg-layout space-x-xs">

    <!-- Flows -->
    <MonitoringProjects
      :selected-flow="selectedFlow"
      :selected-project="selectedProject"
      :projects="projects"
      class="w-1/4 bg-app rd overflow-y-auto"
      @select="(project, flow) => emit('selectFlow', project, flow)"
    />

    <!-- Threads -->
    <MonitoringThreads
      :selected-flow="selectedFlow"
      :selected-thread="selectedThread"
      :threads="threads"
      class="w-1/4 bg-app rd overflow-y-auto"
      @select="thread => emit('selectThread', thread)"
    />

    <!-- Events -->
    <MonitoringEvents
      v-model:event-names="eventNames"
      v-model:event-types="eventTypes"
      :selected-event="selectedEvent"
      :selected-thread="selectedThread"
      :events="events"
      :node-events="nodeEvents"
      class="flex-1 bg-app rd overflow-y-auto"
    />
  </div>
</template>
