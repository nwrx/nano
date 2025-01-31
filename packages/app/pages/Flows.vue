<script setup lang="ts">
import type { UUID } from 'node:crypto'
import type { FlowModuleObject, FlowObject } from '~/server/flow'

definePageMeta({
  name: 'Flows',
  path: '/flows',
})

const { data: flows, refresh: refreshFlows } = useRequest('GET /api/flows', {
  default: () => [] as FlowObject[],
  onError: error => useAlerts().error(error),
})

async function createFlow() {
  await useClient().request('POST /api/flows', {
    data: { name: 'New Flow' },
    onError: showError,
    onEnd: refreshFlows,
  })
}

async function deleteFlow(id: UUID) {
  await useClient().request('DELETE /api/flows/:id', {
    data: { id },
    onSuccess: () => useAlerts().success('Chain deleted.'),
    onError: error => useAlerts().error(error),
    onEnd: refreshFlows,
  })
}

const moduleId = ref('@nanoworks/module-core')
const { data: modules, refresh: refreshModules } = useRequest('GET /api/modules', {
  default: () => [] as FlowModuleObject[],
  onError: error => useAlerts().error(error),
})

async function importModule() {
  await useClient().request('POST /api/modules', {
    data: { moduleId: moduleId.value },
    onError: showError,
    onEnd: refreshModules,
  })
}
</script>

<template>
  <div class="flex flex-col overflow-hidden w-full p-4 space-y-8">
    <FlowList
      :flows="flows"
      @flowCreate="() => createFlow()"
      @flowDelete="(id: UUID) => deleteFlow(id)"
    />

    <!-- Module import and list (test) -->
    <Card outlined class-container="flex flex-col">

      <!-- Input box -->
      <input v-model="moduleId" placeholder="Module ID" />

      <Button filled variant="primary" @click="() => importModule()">Import</Button>

      <ul>
        <li v-for="m in modules" :key="m.id">
          {{ m.name }}
        </li>
      </ul>

    </Card>
  </div>
</template>
