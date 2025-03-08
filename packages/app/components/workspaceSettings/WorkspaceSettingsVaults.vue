<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'
const props = defineProps<{ workspace: string }>()

const { t } = useI18n()
const client = useClient()
const vaults = ref([]) as Ref<VaultObject[]>

async function getVaults() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults', {
    data: { workspace: props.workspace },
    onData: data => vaults.value = data,
  })
}

onMounted(getVaults)
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('text')">
    <Table :rows="vaults" :columns="['name', 'createdAt', 'actions']">
      <template #header="name">
        {{ t(`header.${name}`) }}
      </template>

      <!-- Name -->
      <template #cell.name="vault">
        <VaultCard :vault="vault" />
      </template>

      <!-- Created At -->
      <template #cell.createdAt="{ createdAt }">
        <TableCellDate :created-at="createdAt" />
      </template>

      <!-- Actions -->
      <template #cell.actions="vault">
        <WorkspaceSettingsVaultsActions :workspace="workspace" :vault="vault" />
      </template>
    </Table>

    <!-- Create Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('create')"
      :to="{ name: 'WorkspaceSettingsVaultCreate', params: { workspace } }"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Vaults
  text: View and manage your workspace vaults. Vaults are used to securely store and manage secrets that are used in your flows. Allowing you to securely share and manage your secrets across your workspace.
  create: Create a new vault for this workspace
  header:
    name: Vault Name
    createdAt: ''
    actions: ''
  type:
    local: Local
    hashicorp: HashiCorp
    aws: AWS
    gcp: GCP
    azure: Azure
</i18n>
