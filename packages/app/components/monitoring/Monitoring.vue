<script setup lang="ts">
import type {
  MonitoringFlowThreadEventObject,
  MonitoringFlowThreadNodeEventObject,
  MonitoringFlowThreadObject,
  WorkspaceProjectObject,
} from '@nwrx/nano-api'

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

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++)
    color += letters[Math.floor(Math.random() * 16)]
  return color
}
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
    <div class="flex flex-col w-3/4 h-full space-y-xs overflow-hidden">
      <div class="grow grid grid-cols-2 gap-xs overflow-hidden">
        <MonitoringThreads
          :selected-flow="selectedFlow"
          :selected-thread="selectedThread"
          :threads="threads"
          class="w-1/2 bg-app rd overflow-y-auto"
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

      <!-- Stat Selector -->
      <div class="shrink-0 grid grid-cols-4 gap-xs">
        <div class="w-full bg-subtle rd col-span-1">
          <h3 class="text-lg font-medium p-md">
            Select Statistic
          </h3>
          <MonitoringItem title="Tokens usage (Total)" text="1,343,702" icon="i-carbon:ai-launch" is-selected />
          <MonitoringItem title="Tokens usage (Completion)" text="401,343" icon="i-carbon:ai-launch" />
          <MonitoringItem title="Costs (Inference)" text="$32,234" icon="i-carbon:currency" />
          <MonitoringItem title="Executions (Nodes)" text="1,734" icon="i-carbon:play" />
          <MonitoringItem title="Executions (Flows)" text="434" icon="i-carbon:play" />
          <MonitoringItem title="Errors" text="122" icon="i-carbon:error" />
        </div>

        <div class="grid grid-cols-3 gap-xs col-span-3">
          <MonitoringProjectChart
            title="Per Provider"
            unit="tokens"
            :data="[
              { label: 'OpenAI', color: COLORS.danger[300], min: 100000, max: 120000 },
              { label: 'Mistral', color: COLORS.secondary[300], min: 100000, max: 110000 },
              { label: 'Groq', color: COLORS.primary[300], min: 120000, max: 150000 },
            ]"
          />
          <MonitoringProjectChart
            title="Per Model"
            unit="tokens"
            :data="[
              { label: 'gpt-3.5-turbo', color: COLORS.danger[300], min: 100000, max: 120000 },
              { label: 'mixtral-8x22b', color: COLORS.secondary[300], min: 100000, max: 110000 },
              { label: 'llama2-8192-8b', color: COLORS.primary[300], min: 120000, max: 150000 },
            ]"
          />
          <MonitoringProjectChart
            title="Per Flow"
            unit="tokens"
            :data="projects.flatMap(({ flows }) => flows.map(({ title }) => ({
              label: title,
              color: getRandomColor(),
              min: 100000,
              max: 120000,
            })) as any)"
          />
          <!--
            <MonitoringProjectChart
            title="Per User"
            unit="tokens"
            :data="[
            { label: 'John Doe', color: COLORS.danger[300], min: 100000, max: 120000 },
            { label: 'Jane Doe', color: COLORS.secondary[300], min: 100000, max: 110000 },
            { label: 'Alice', color: COLORS.primary[300], min: 120000, max: 150000 },
            ]"
            />
          -->
        </div>
      </div>
    </div>
  </div>
</template>
