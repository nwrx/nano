<script setup lang="ts">
definePageMeta({
  name: 'Chains',
  path: '/chains',
})

const client = useClient()
const moduleId = ref('@hsjm/oblisk-core/lm')

const { data: modules } = client.useRequest('GET /api/modules', {
  data: {},
}) 

async function importModule() {
  await client.request('POST /api/modules', {
    data: { moduleId },
  })
}

const { data: chains, refresh } = useRequest('GET /api/chains', {
  default: () => [] as ChainObject[],
  onError: error => useAlerts().error(error),
})

async function createChain() {
  await useClient().request('POST /api/chains', {
    data: { name: 'New Chain' },
    onSuccess: () => useAlerts().success('Chain created.'),
    onError: error => useAlerts().error(error),
    onEnd: refresh,
  })
}

async function deleteChain(id: UUID) {
  await useClient().request('DELETE /api/chains/:id', {
    data: { id },
    onSuccess: () => useAlerts().success('Chain deleted.'),
    onError: error => useAlerts().error(error),
    onEnd: refresh,
  })
}
</script>

<template>
  <div class="flex flex-col overflow-hidden h-screen">
    <ChainList
      :chains="chains"
      @chainCreate="() => createChain()"
      @chainDelete="id => deleteChain(id)"
    />

    <!-- Module import and list (test) -->
     <div>
      <h1>Modules</h1>

      <!-- Input box -->
      <input v-model="moduleId" placeholder="Module ID" />
      <Button @click="() => importModule()">Import</Button>

      <ul>
        <li v-for="m in modules" :key="m.id">
          {{ m.name }}
        </li>
      </ul>
     </div>
  </div>
</template>
