<script setup lang="ts">
import type { WorkspaceProjectPermission } from '@nwrx/nano-api'

defineProps<{
  workspace?: string
  project?: string
  title?: string
  username?: string
  userDisplayName?: string
}>()

const emit = defineEmits<{
  submitSetPermissions: [permissions: WorkspaceProjectPermission[]]
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
    <ProjectSettingsAssignmentDialogEdit
      v-model="isDialogManageOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      :username="username"
      :user-display-name="userDisplayName"
      @submit="(permissions) => emit('submitSetPermissions', permissions)"
    />

    <!-- Unassign Dialog -->
    <ProjectSettingsAssignmentDialogUnassign
      v-model="isDialogUnassignOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      :username="username"
      :user-display-name="userDisplayName"
      @submit="() => emit('submitUnassign')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  manage: Manage
  unassign: Unassign
fr:
  manage: Gérer
  unassign: Désassigner
de:
  manage: Verwalten
  unassign: Entfernen
es:
  manage: Administrar
  unassign: Desasignar
zh:
  manage: 管理
  unassign: 取消分配
</i18n>
