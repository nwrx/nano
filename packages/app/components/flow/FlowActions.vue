<script setup lang="ts">
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import FlowDialogDelete from './FlowDialogDelete.vue'
import FlowDialogDuplicate from './FlowDialogDuplicate.vue'
import FlowDialogRename from './FlowDialogRename.vue'

defineProps<{
  workspace: string
  project: string
  name: string
  compact?: boolean
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showDuplicateDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <ContextMenu x="right" y="top" :compact @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          :label="t('edit')"
          icon="i-carbon:edit"
          :to="{ name: 'FlowEditor', params: { workspace, project, name } }"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          :label="t('rename')"
          icon="i-carbon:label"
          @click="() => showRenameDialog = true"
        />
        <ContextMenuItem
          :label="t('duplicate')"
          icon="i-carbon:copy"
          @click="() => showDuplicateDialog = true"
        />
        <ContextMenuItem
          :label="t('delete')"
          icon="i-carbon:trash-can"
          @click="() => showDeleteDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Rename Dialog -->
    <FlowDialogRename
      v-if="showRenameDialog"
      v-model="showRenameDialog"
      :workspace="workspace"
      :project="project"
      :name="name"
    />

    <!-- Duplicate Dialog -->
    <FlowDialogDuplicate
      v-if="showDuplicateDialog"
      v-model="showDuplicateDialog"
      :workspace="workspace"
      :project="project"
      :name="name"
    />

    <!-- Delete Dialog -->
    <FlowDialogDelete
      v-if="showDeleteDialog"
      v-model="showDeleteDialog"
      :workspace="workspace"
      :project="project"
      :name="name"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  edit: Edit
  rename: Rename
  duplicate: Duplicate
  delete: Delete
fr:
  edit: Modifier
  rename: Renommer
  duplicate: Dupliquer
  delete: Supprimer
de:
  edit: Bearbeiten
  rename: Umbenennen
  duplicate: Duplizieren
  delete: Löschen
es:
  edit: Editar
  rename: Renombrar
  duplicate: Duplicar
  delete: Eliminar
zh:
  edit: 编辑
  rename: 重命名
  duplicate: 复制
  delete: 删除
</i18n>
