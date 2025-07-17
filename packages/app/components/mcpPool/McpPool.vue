<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import McpPoolDangerZone from './McpPool.DangerZone.vue'
import McpPoolGeneral from './McpPool.General.vue'
import McpPoolHeader from './McpPool.Header.vue'
import McpPoolSpecs from './McpPool.Specs.vue'
import McpPoolStatus from './McpPool.Status.vue'

const props = defineProps<{
  name: string
  workspace: string
}>()

const pool = ref<McpPoolObject>()
const client = useClient()
async function getPool() {
  await client.requestAttempt('GET /api/workspaces/:workspace/pools/:pool', {
    data: {
      pool: props.name,
      workspace: props.workspace,
      withSpec: true,
    },
    onData: (data) => {
      pool.value = data
    },
  })
}

type PanelType = 'settings' | 'status'
const panel = ref<PanelType>('settings')
watch(() => props, getPool, { immediate: true })
</script>

<template>
  <div v-if="pool" class="flex flex-col h-full overflow-y-auto w-full">
    <McpPoolHeader
      class="sticky top-0 z-1"
      :pool="pool"
    />

    <div v-if="panel === 'settings'">
      <McpPoolGeneral
        class="p-lg !m-0"
        :pool="pool"
        :workspace="workspace"
        @refresh="() => getPool()"
      />
      <McpPoolDangerZone
        class="p-lg !m-0"
        :pool="pool"
        :workspace="workspace"
        @refresh="() => getPool()"
      />
    </div>

    <div v-if="panel === 'status'">
      <McpPoolSpecs
        class="p-lg !m-0"
        :pool="pool"
        :workspace="workspace"
        @refresh="() => getPool()"
      />
      <McpPoolStatus
        class="p-lg !m-0"
        :pool="pool"
        :workspace="workspace"
        @refresh="() => getPool()"
      />
    </div>
  </div>

  <!-- Panel Selector -->
  <ContextTabs class="b-l b-app">
    <ContextTabsItem v-model="panel" type="radio" value="settings" icon="i-carbon:settings" />
    <ContextTabsItem v-model="panel" type="radio" value="status" icon="i-carbon:text-align-justify" />
  </ContextTabs>
</template>
