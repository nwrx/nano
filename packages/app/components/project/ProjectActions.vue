<script setup lang="ts">
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import ProjectDialogDelete from './ProjectDialogDelete.vue'
import ProjectDialogRename from './ProjectDialogRename.vue'
import ProjectDialogTransfer from './ProjectDialogTransfer.vue'

defineProps<{
  workspace: string
  project: string
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showTransferDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          :label="t('settings')"
          icon="i-carbon:settings"
          :to="{ name: 'ProjectSettings', params: { workspace, project } }"
        />
        <ContextMenuItem
          :label="t('assignments')"
          icon="i-carbon:group"
          :to="{ name: 'ProjectSettingsAssignments', params: { workspace, project } }"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          :label="t('rename')"
          icon="i-carbon:edit"
          @click="() => showRenameDialog = true"
        />
        <ContextMenuItem
          :label="t('transfer')"
          icon="i-carbon:status-change"
          @click="() => showTransferDialog = true"
        />
        <ContextMenuItem
          :label="t('delete')"
          icon="i-carbon:trash-can"
          @click="() => showDeleteDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Rename Dialog -->
    <ProjectDialogRename
      v-model="showRenameDialog"
      :workspace="workspace"
      :project="project"
    />

    <!-- Transfer Dialog -->
    <ProjectDialogTransfer
      v-model="showTransferDialog"
      :workspace="workspace"
      :project="project"
    />

    <!-- Delete Dialog -->
    <ProjectDialogDelete
      v-model="showDeleteDialog"
      :workspace="workspace"
      :project="project"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  settings: Settings
  assignments: Members & Access
  rename: Rename
  transfer: Transfer
  delete: Delete
fr:
  settings: Paramètres
  assignments: Membres et Accès
  rename: Renommer
  transfer: Transférer
  delete: Supprimer
de:
  settings: Einstellungen
  assignments: Mitglieder & Zugriff
  rename: Umbenennen
  transfer: Übertragen
  delete: Löschen
es:
  settings: Configuración
  assignments: Miembros y Acceso
  rename: Renombrar
  transfer: Transferir
  delete: Eliminar
zh:
  settings: 设置
  assignments: 成员和访问
  rename: 重命名
  transfer: 转移
  delete: 删除
</i18n>
