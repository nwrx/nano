<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'

const props = defineProps<{
  multiple?: boolean
  workspace: string
}>()

const search = ref('')
const client = useClient()
const model = defineModel<string>()
const vaults = ref([]) as Ref<VaultObject[]>

async function searchVaults() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults', {
    data: {
      search: search.value,
      workspace: props.workspace,
    },
    onData: (data) => {
      vaults.value = data
    },
  })
}

watch(search, (search) => {
  if (search) void searchVaults()
  else vaults.value = []
})
</script>

<template>
  <InputList
    v-model="model"
    v-model:search="search"
    icon="i-carbon:password"
    :options="vaults"
    :option-icon="(option) => getVaultTypeIcon(option.type)"
    :option-value="(option) => option.name"
    :option-label="(option) => option.name"
    :option-text="(option) => option.description"
    @focus="() => searchVaults()"
  />
</template>
