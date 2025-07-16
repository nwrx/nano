<script setup lang="ts">
import type { McpGatewayObject } from '@nwrx/nano-api'
import McpGatewayFormDangerZone from './McpGatewayFormDangerZone.vue'
import McpGatewayFormSettings from './McpGatewayFormSettings.vue'
import McpGatewayFormStatus from './McpGatewayFormStatus.vue'

const props = defineProps<{
  manager: string
  identity: string
}>()

// --- Model.
const client = useClient()
const gateway = ref<McpGatewayObject>()

// --- Fetch.
async function getGateway() {
  await client.request('GET /api/mcp/:_manager/gateways/:identity', {
    parameters: {
      _manager: props.manager,
      identity: props.identity,
    },
    onData: (data) => {
      gateway.value = data
    },
  })
}

onMounted(getGateway)
</script>

<template>
  <div v-if="gateway" class="space-y-xl">
    <McpGatewayFormSettings
      :gateway="gateway"
      :manager="manager"
    />
    <McpGatewayFormStatus
      :gateway="gateway"
      :manager="manager"
    />
    <McpGatewayFormDangerZone
      :gateway="gateway"
      :manager="manager"
      @refresh="() => getGateway()"
    />
  </div>
</template>
