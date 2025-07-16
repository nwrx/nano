<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import McpGatewayTable from '../mcpGateway/McpGatewayTable.vue'
import McpManagerDangerZone from './McpManagerFormDangerZone.vue'
import McpManagerGeneral from './McpManagerFormSettings.vue'
import McpManagerStatus from './McpManagerFormStatus.vue'

const props = defineProps<{
  identity: string
}>()

const client = useClient()
const manager = ref<McpManagerObject>()

async function getManager() {
  await client.request('GET /api/mcp/:_identity', {
    data: {
      _identity: props.identity,
      withGateways: true,
    },
    onData: data => manager.value = data,
  })
}

onMounted(getManager)
</script>

<template>
  <div v-if="manager" class="space-y-xl">
    <McpManagerGeneral :manager="manager" />
    <McpManagerStatus :manager="manager" />
    <McpGatewayTable :manager="manager" @refresh="() => getManager()" />
    <McpManagerDangerZone :manager="manager" @refresh="() => getManager()" />
  </div>
</template>
