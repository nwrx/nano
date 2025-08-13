<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'
import InputList from '~/components/base/InputList.vue'

const props = defineProps<{
  workspace: string
  multiple?: boolean
  vault?: string
}>()

const { t } = useI18n()
const search = ref('')
const client = useClient()
const model = defineModel<string>({ required: false })
const variables = ref([]) as Ref<VaultVariableObject[]>

async function searchVariables() {
  await client.requestAttempt('GET /workspaces/:workspace/variables', {
    parameters: {
      workspace: props.workspace,
    },
    query: {
      search: search.value,
      withVault: true,
    },
    onData: (data) => {
      variables.value = props.vault
        ? data.filter((variable: VaultVariableObject) =>
          variable.vault?.name === props.vault,
        )
        : data
    },
  })
}

watch(search, searchVariables, { immediate: true })
</script>

<template>
  <InputList
    v-model="model"
    v-model:search="search"
    icon="i-carbon:password"
    class-option-text="font-mono"
    class-option-label="font-mono"
    :placeholder="t('placeholder')"
    :options="variables"
    :option-icon="() => 'i-carbon:password'"
    :option-value="(option) => `${option.vault!.name}/${option.name}`"
    :option-label="(option) => option.name"
    :option-text="(option) => option.vault!.name"
    @focus="() => searchVariables()"
  />
</template>

<i18n lang="yaml">
en:
  placeholder: Search vault variables
fr:
  placeholder: Rechercher des variables de coffre-fort
de:
  placeholder: Nach Tresorvariablen suchen
es:
  placeholder: Buscar variables de bóveda
zh:
  placeholder: 搜索保险库变量
</i18n>
