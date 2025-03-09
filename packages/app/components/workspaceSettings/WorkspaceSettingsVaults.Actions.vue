<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'

defineProps<{
  workspace: string
  vault: VaultObject
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const showSetDefaultDialog = ref(false)
const showDisableDialog = ref(false)
const showEnableDialog = ref(false)
const showRemoveDialog = ref(false)
</script>

<template>
  <div>
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('actions.edit')"
          :to="{ name: 'WorkspaceSettingsVault', params: { workspace, vault: vault.name } }"
        />
        <ContextMenuItem
          v-if="!vault.isDefault"
          icon="i-carbon:star"
          :label="t('actions.setDefault')"
          @click="() => showSetDefaultDialog = true"
        />
        <!--
          <ContextMenuItem
          icon="i-carbon:connect"
          :label="t('actions.health')"
          @click="() => showHealthDialog = true"
          />
        -->
        <ContextMenuDivider />
        <ContextMenuItem
          v-if="!vault.disabledAt"
          icon="i-carbon:close"
          :label="t('actions.disable')"
          @click="() => showDisableDialog = true"
        />
        <ContextMenuItem
          v-if="vault.disabledAt"
          icon="i-carbon:checkmark"
          :label="t('actions.enable')"
          @click="() => showEnableDialog = true"
        />
        <ContextMenuItem
          v-if="!vault.deletedAt"
          icon="i-carbon:delete"
          :label="t('actions.remove')"
          @click="() => showRemoveDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Set Default Dialog -->
    <WorkspaceSettingsVaultsDialogSetDefault
      v-model="showSetDefaultDialog"
      :workspace="workspace"
      :vault="vault.name"
      @submit="() => emit('submit')"
    />

    <!-- Remove Dialog -->
    <WorkspaceSettingsVaultsDialogRemove
      v-model="showRemoveDialog"
      :workspace="workspace"
      :vault="vault.name"
      @submit="() => emit('submit')"
    />

    <!-- Disable Dialog -->
    <WorkspaceSettingsVaultsDialogDisable
      v-model="showDisableDialog"
      :workspace="workspace"
      :vault="vault.name"
      @submit="() => emit('submit')"
    />

    <!-- Enable Dialog -->
    <WorkspaceSettingsVaultsDialogEnable
      v-model="showEnableDialog"
      :workspace="workspace"
      :vault="vault.name"
      @submit="() => emit('submit')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  actions:
    edit: Edit
    setDefault: Set as Default
    health: Health
    disable: Disable
    enable: Enable
    remove: Remove
</i18n>
