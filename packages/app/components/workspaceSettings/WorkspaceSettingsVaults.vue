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
        <Flags v-slot="dialogs" :keys="['setDefault', 'remove', 'disable', 'enable', 'health', 'edit']">
          <ContextMenu x="right" y="top" @mousedown.stop>
            <template #menu>
              <ContextMenuItem icon="i-carbon:edit" :label="t('menu.edit')" :to="{ name: 'WorkspaceSettingsVault', params: { workspace, vault: vault.name } }" />
              <ContextMenuItem v-if="!vault.isDefault" icon="i-carbon:star" :label="t('menu.setDefault')" @click="() => dialogs.open('setDefault')" />
              <ContextMenuItem icon="i-carbon:connect" :label="t('menu.health')" @click="() => dialogs.open('health')" />
              <ContextMenuDivider />
              <ContextMenuItem v-if="!vault.disabledAt" icon="i-carbon:close" :label="t('menu.disable')" @click="() => dialogs.open('disable')" />
              <ContextMenuItem v-if="vault.disabledAt" icon="i-carbon:checkmark" :label="t('menu.enable')" @click="() => dialogs.open('enable')" />
              <ContextMenuItem v-if="!vault.deletedAt" icon="i-carbon:delete" :label="t('menu.remove')" @click="() => dialogs.open('remove')" />
            </template>
          </ContextMenu>

          <!-- Set Default Dialog -->
          <WorkspaceSettingsVaultsSetDefault
            v-model="dialogs.value.setDefault"
            :workspace="workspace"
            :vault="vault.name"
            @submit="() => getVaults()"
          />

          <!-- Remove Dialog -->
          <WorkspaceSettingsVaultsRemove
            v-model="dialogs.value.remove"
            :workspace="workspace"
            :vault="vault.name"
            @submit="() => getVaults()"
          />

          <!-- Disable Dialog -->
          <WorkspaceSettingsVaultsDisable
            v-model="dialogs.value.disable"
            :workspace="workspace"
            :vault="vault.name"
            @submit="() => getVaults()"
          />

          <!-- Enable Dialog -->
          <WorkspaceSettingsVaultsEnable
            v-model="dialogs.value.enable"
            :workspace="workspace"
            :vault="vault.name"
            @submit="() => getVaults()"
          />
        </Flags>
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
  menu:
    edit: Edit
    setDefault: Set as Default
    health: Health
    disable: Disable
    enable: Enable
    remove: Remove
</i18n>
