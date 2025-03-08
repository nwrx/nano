<script setup lang="ts">
import type { VaultPermission } from '@nwrx/nano-api'

defineProps<{
  workspace: string
  vault: string
  username: string
  permissions: VaultPermission[]
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const showEditDialog = ref(false)
const showRemoveDialog = ref(false)
</script>

<template>
  <div>
    <ContextMenu x="right" y="top">
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('actions.edit')"
          @click="() => showEditDialog = true"
        />
        <ContextMenuItem
          icon="i-carbon:delete"
          :label="t('actions.remove')"
          @click="() => showRemoveDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Edit dialog -->
    <WorkspaceSettingsVaultAssignmentsDialogEdit
      v-model="showEditDialog"
      :workspace="workspace"
      :vault="vault"
      :username="username"
      :permissions="permissions"
      @submit="() => emit('submit')"
    />

    <!-- Remove dialog -->
    <WorkspaceSettingsVaultAssignmentsDialogRemove
      v-model="showRemoveDialog"
      :workspace="workspace"
      :vault="vault"
      :username="username"
      @submit="() => emit('submit')"
    />

  </div>
</template>

<i18n lang="yaml">
en:
  actions:
    edit: Edit permissions
    remove: Remove access
</i18n>
