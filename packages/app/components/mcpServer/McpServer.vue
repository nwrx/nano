<script setup lang="ts">
import type { McpServerObject } from '@nwrx/nano-api'
import VerticalTabsItem from '~/components/base/VerticalTabs.Item.vue'
import VerticalTabs from '~/components/base/VerticalTabs.vue'
import McpServerArgumentCreate from './McpServerFormArguments.Create.vue'
import McpServerArguments from './McpServerFormArguments.vue'
import McpServerContainer from './McpServerFormContainer.vue'
import McpServerDangerZone from './McpServerFormDangerZone.vue'
import McpServerGeneral from './McpServerFormSettings.vue'
import McpServerHeader from './McpServerHeader.vue'
import McpServerStatus from './McpServerStatus.vue'
import McpServerTools from './McpServerTools.vue'
import McpServerTransport from './McpServerTransport.vue'
import McpServerVariables from './McpServerVariables.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const emit = defineEmits<{
  rename: [name: string]
}>()

const client = useClient()
const server = ref<McpServerObject>()
async function getServer() {
  await client.requestAttempt(
    'GET /api/workspaces/:workspace/pools/:pool/servers/:name',
    {
      parameters: {
        workspace: props.workspace,
        pool: props.pool,
        name: props.name,
      },
      query: {
        withSpec: true,
        withTools: true,
      },
      onData: (data) => {
        server.value = data
      },
    },
  )
}

type PanelType = 'arguments' | 'container' | 'settings' | 'status' | 'tools' | 'variables'
const panel = ref<PanelType>('settings')
watch(() => [props.name, props.pool, props.workspace], () => {
  panel.value = 'settings'
  getServer()
}, { immediate: true })
</script>

<template>
  <div v-if="server" class="flex flex-col h-full overflow-y-auto w-full">

    <!-- Variables -->
    <div v-else-if="panel === 'variables'">
      <McpServerVariables
        class="p-lg !m-0"
        :pool="pool"
        :server="server"
        :workspace="workspace"
        @refresh="() => getServer()"
      />
    </div>

    <!-- Tools -->
    <div v-else-if="panel === 'tools'">
      <McpServerTools
        class="p-lg !m-0"
        :pool="pool"
        :server="server"
        :workspace="workspace"
      />
    </div>
  </div>

  <!-- Panel Selector -->
  <VerticalTabs class="b-l b-app">
    <VerticalTabsItem v-model="panel" type="radio" value="settings" icon="i-carbon:settings" />
    <VerticalTabsItem v-model="panel" type="radio" value="container" icon="i-carbon:container-runtime" />
    <VerticalTabsItem v-model="panel" type="radio" value="variables" icon="i-carbon:value-variable" />
    <VerticalTabsItem v-model="panel" type="radio" value="arguments" icon="i-carbon:terminal" />
    <VerticalTabsItem v-model="panel" type="radio" value="status" icon="i-carbon:container-runtime-monitor" />
    <VerticalTabsItem v-model="panel" type="radio" value="tools" icon="i-carbon:tools" />
  </VerticalTabs>
</template>
