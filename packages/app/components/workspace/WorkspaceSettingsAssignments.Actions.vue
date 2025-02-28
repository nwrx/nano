<script setup lang="ts">
import type { WorkspacePermission } from '@nwrx/nano-api'

defineProps<{
  workspace: string
  username: string
  displayName: string
  permissions: WorkspacePermission[]
}>()

const emit = defineEmits<{
  submitPermissions: [WorkspacePermission[]]
  submitUnassign: []
}>()

const { t } = useI18n()
const isDialogManageOpen = ref(false)
const isDialogUnassignOpen = ref(false)
</script>

<template>
  <div class="flex items-center justify-end space-x-md">
    <ContextMenu x="right" y="top">
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('manage')"
          keybind="Ctrl + E"
          @click="() => isDialogManageOpen = true"
        />
        <ContextMenuItem
          icon="i-carbon:delete"
          :label="t('unassign')"
          keybind="Backspace"
          @click="() => isDialogUnassignOpen = true"
        />
      </template>
    </ContextMenu>

    <!-- Manage Dialog -->
    <WorkspaceSettingsAssignmentsDialogEdit
      v-model="isDialogManageOpen"
      :workspace="workspace"
      :username="username"
      :display-name="displayName"
      :permissions="permissions"
      @submit="(permissions) => emit('submitPermissions', permissions)"
    />

    <!-- Unassign Dialog -->
    <WorkspaceSettingsAssignmentsDialogUnassign
      v-model="isDialogUnassignOpen"
      :workspace="workspace"
      :username="username"
      :display-name="displayName"
      @submit="() => emit('submitUnassign')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  manage: Manage
  unassign: Unassign
</i18n>
