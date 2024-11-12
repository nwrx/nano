<script setup lang="ts">
import type {
  MonitoringFlowThreadEventObject,
  MonitoringFlowThreadNodeEventObject,
  MonitoringFlowThreadObject,
  WorkspaceProjectObject,
} from '@nwrx/api'

defineProps<{
  selectedProject?: string
  selectedFlow?: string
  selectedThread?: string
  selectedEvent?: string
  projects: WorkspaceProjectObject[]
  threads: MonitoringFlowThreadObject[]
  events: MonitoringFlowThreadEventObject[]
  nodeEvents: MonitoringFlowThreadNodeEventObject[]
}>()

const emit = defineEmits<{
  selectFlow: [project: string, flow: string]
  selectThread: [thread: string]
  selectEvent: [event: string]
}>()
</script>

<template>
  <div class="flex items-stretch h-full bg-layout">

    <!-- Flows -->
    <MonitoringProjects
      :selected-flow="selectedFlow"
      :selected-project="selectedProject"
      :projects="projects"
      class="w-1/4 bg-app rd overflow-y-auto"
      @select="(project, flow) => emit('selectFlow', project, flow)"
    />

    <!-- Divider -->
    <div class="w-1" />

    <!-- Threads -->
    <MonitoringThreads
      :selected-flow="selectedFlow"
      :selected-thread="selectedThread"
      :threads="threads"
      class="w-1/4 bg-app rd overflow-y-auto"
      @select="thread => emit('selectThread', thread)"
    />

    <!-- Divider -->
    <div class="w-1" />

    <!-- Events -->
    <MonitoringEvents
      :selected-event="selectedEvent"
      :selected-thread="selectedThread"
      :events="events"
      :node-events="nodeEvents"
      class="flex-1 bg-app rd overflow-y-auto"
      @select="event => emit('selectEvent', event)"
    />
  </div>
</template>
