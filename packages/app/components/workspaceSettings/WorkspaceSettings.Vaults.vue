<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'
const props = defineProps<{ workspace: string }>()

const { t } = useI18n()

const client = useClient()
const alerts = useAlerts()
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
              <ContextMenuItem icon="i-carbon:edit" :label="t('menu.edit')" :to="{ name: 'WorkspaceSettingsVaultEdit', params: { workspace, name: vault.name } }" />
              <ContextMenuItem v-if="!vault.isDefault" icon="i-carbon:star" :label="t('menu.setDefault')" @click="() => dialogs.open('setDefault')" />
              <ContextMenuItem icon="i-carbon:connect" :label="t('menu.health')" @click="() => dialogs.open('health')" />
              <ContextMenuDivider />
              <ContextMenuItem v-if="!vault.disabledAt" icon="i-carbon:close" :label="t('menu.disable')" @click="() => dialogs.open('disable')" />
              <ContextMenuItem v-if="vault.disabledAt" icon="i-carbon:checkmark" :label="t('menu.enable')" @click="() => dialogs.open('enable')" />
              <ContextMenuItem v-if="!vault.deletedAt" icon="i-carbon:delete" :label="t('menu.remove')" @click="() => dialogs.open('remove')" />
            </template>
          </ContextMenu>

          <!-- Set Default Dialog -->
          <Dialog
            v-model="dialogs.value.setDefault"
            icon="i-carbon:warning"
            class-hint="hint-warning"
            class-button="button-warning"
            :title="t('dialog.setDefault.title', { workspace, name: vault.name })"
            :text="t('dialog.setDefault.text', { workspace, name: vault.name })"
            :label-confirm="t('dialog.setDefault.confirm')"
            :label-cancel="t('dialog.setDefault.cancel')"
            @confirm="() => {
              client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:name/default', {
                data: { workspace, name: vault.name },
                onSuccess: async() => {
                  alerts.success(t('dialog.setDefault.success', { workspace, name: vault.name }))
                  await getVaults()
                },
              })
            }">
            <VaultCard :vault="vault" />
          </Dialog>

          <!-- Remove Dialog -->
          <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
            <Dialog
              v-model="dialogs.value.remove"
              icon="i-carbon:delete"
              class-hint="hint-danger"
              class-button="button-danger"
              :title="t('dialog.remove.title', { workspace, name: vault.name })"
              :text="t('dialog.remove.text', { workspace, name: vault.name })"
              :label-confirm="t('dialog.remove.confirm')"
              :label-cancel="t('dialog.remove.cancel')"
              :disabled="!value.name || value.name !== vault.name"
              @confirm="() => {
                client.requestAttempt('DELETE /api/workspaces/:workspace/vaults/:name', {
                  data: { workspace, name: vault.name },
                  onSuccess: async() => {
                    alerts.success(t('dialog.remove.success', { workspace, name: vault.name }))
                    await getVaults()
                  },
                })
              }">
              <InputText
                v-model="value.name"
                :label="t('dialog.remove.confirmName', { name: vault.name })"
                :placeholder="vault.name"
                :text-before="`${CONSTANTS.appHost}/${workspace}`"
              />
            </Dialog>
          </Ephemeral>

          <!-- Disable Dialog -->
          <Dialog
            v-model="dialogs.value.disable"
            icon="i-carbon:close"
            class-hint="hint-danger"
            class-button="button-danger"
            :title="t('dialog.disable.title', { workspace, name: vault.name })"
            :text="t('dialog.disable.text', { workspace, name: vault.name })"
            :label-confirm="t('dialog.disable.confirm')"
            :label-cancel="t('dialog.disable.cancel')"
            @confirm="() => {
              client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:name/disable', {
                data: { workspace, name: vault.name },
                onSuccess: async() => {
                  alerts.success(t('dialog.disable.success', { workspace, name: vault.name }))
                  await getVaults()
                },
              })
            }">
            <VaultCard :vault="vault" />
          </Dialog>

          <!-- Enable Dialog -->
          <Dialog
            v-model="dialogs.value.enable"
            icon="i-carbon:checkmark"
            class-hint="hint-success"
            class-button="button-success"
            :title="t('dialog.enable.title', { workspace, name: vault.name })"
            :text="t('dialog.enable.text', { workspace, name: vault.name })"
            :label-confirm="t('dialog.enable.confirm')"
            :label-cancel="t('dialog.enable.cancel')"
            @confirm="() => {
              client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:name/enabled', {
                data: { workspace, name: vault.name },
                onSuccess: async() => {
                  alerts.success(t('dialog.enable.success', { workspace, name: vault.name }))
                  await getVaults()
                },
              })
            }">
            <VaultCard :vault="vault" />
          </Dialog>
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
  dialog:
    setDefault:
      title: Set the **{name}** vault as the default **{workspace}** vault?
      text: Setting this vault as default will allow all flows within the **{workspace}** workspace to read and write secrets from this vault. This can ease the management of secrets across your workspace but can also lead to security risks if not managed properly. Use this feature with caution.
      confirm: Set this vault as default
      cancel: Keep current default
      success: The **{workspace}/{name}** vault has been set as the default vault.
    disable:
      title: Disable the **{workspace}/{name}** vault?
      text: Disabling this vault will prevent all flows within the **{workspace}** workspace from reading and writing secrets from this vault. Are you sure you want to proceed?
      confirm: Disable this vault
      cancel: Keep this vault
      success: The **{workspace}/{name}** vault has been disabled.
    enable:
      title: Enable the **{workspace}/{name}** vault?
      text: Enabling this vault will allow all flows within the **{workspace}** workspace to read and write secrets from this vault. Are you sure you want to proceed?
      confirm: Enable this vault
      cancel: Keep this vault
      success: The **{workspace}/{name}** vault has been enabled.
    remove:
      title: Remove the **{workspace}/{name}** vault?
      text: Removing this vault will permanently delete all secrets stored within it. This action cannot be undone. Are you sure you want to proceed?
      confirm: Remove this vault
      cancel: Keep this vault
      confirmName: Confirm the vault name to remove
      success: The **{workspace}/{name}** vault has been removed.
</i18n>
