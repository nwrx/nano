<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Hyperlink from '~/components/base/Hyperlink.vue'
import TableCellDate from '~/components/base/Table.CellDate.vue'
import Table from '~/components/base/Table.vue'
import VaultCard from './VaultCard.vue'

const props = defineProps<{
  workspace: string
}>()

// --- State.
const { t } = useI18n()
const client = useClient()
const vaults = ref([]) as Ref<VaultObject[]>

// --- Methods.
async function getVaults() {
  await client.requestAttempt('GET /workspaces/:workspace/vaults', {
    parameters: { workspace: props.workspace },
    onData: data => vaults.value = data,
  })
}

// --- Computed.
const linkCreateTo = computed(() => ({
  name: 'WorkspaceSettingsVaultCreate',
  params: { workspace: props.workspace },
}))

// --- Lifecycle.
onMounted(getVaults)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Table -->
    <Table :rows="vaults" :columns="['name', 'createdAt', 'actions']">
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Name -->
      <template #cell.name="vault">
        <VaultCard :vault="vault" is-link inline />
      </template>

      <!-- Created At -->
      <template #cell.createdAt="{ createdAt }">
        <TableCellDate :created-at="createdAt" />
      </template>

      <!-- Actions -->
      <template #cell.actions="vault">
        <VaultsActions :workspace="workspace" :vault="vault" />
      </template>
    </Table>

    <!-- Create Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('createVault')"
      :to="linkCreateTo"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Vaults
  text: View and manage your workspace vaults. Vaults are used to securely store and manage secrets that are used in your flows. Allowing you to securely share and manage your secrets across your workspace.
</i18n>
