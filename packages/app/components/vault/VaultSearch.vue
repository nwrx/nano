<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue: string
  multiple?: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const search = ref('')
const client = useClient()
const model = useVModel(props, 'modelValue', emit, { passive: true })

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
    :option-value="(option) => option.name"
    :option-label="(option) => option.name"
    :option-text="(option) => option.description"
    @focus="() => searchVaults()"
  />
</template>
