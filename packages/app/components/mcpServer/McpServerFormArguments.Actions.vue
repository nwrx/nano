<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import DialogEdit from './McpServerFormArguments.DialogEdit.vue'
import DialogLink from './McpServerFormArguments.DialogLink.vue'
import DialogRemove from './McpServerFormArguments.DialogRemove.vue'

defineProps<{
  workspace: string
  server: string
  name: string
  argument: McpServerArgumentObject
}>()

const { t } = useI18n()
const showEditDialog = ref(false)
const showLinkDialog = ref(false)
const showRemoveDialog = ref(false)
</script>

<template>
  <div>
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('edit')"
          @click="() => showEditDialog = true"
        />
        <ContextMenuItem
          icon="i-carbon:password"
          :label="t('link')"
          @click="() => showLinkDialog = true"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          icon="i-carbon:delete"
          :label="t('remove')"
          @click="() => showRemoveDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Edit Dialog -->
    <DialogEdit
      v-model="showEditDialog"
      :workspace="workspace"
      :pool="name"
      :name="server"
      :argument="argument"
    />

    <!-- Link to Variable Dialog -->
    <DialogLink
      v-model="showLinkDialog"
      :workspace="workspace"
      :pool="name"
      :name="server"
      :argument="argument"
    />

    <!-- Remove Dialog -->
    <DialogRemove
      v-model="showRemoveDialog"
      :workspace="workspace"
      :pool="name"
      :name="server"
      :argument="argument"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  edit: Edit
  link: Link to Variable
  remove: Remove
fr:
  edit: Modifier
  link: Lier à une Variable
  remove: Supprimer
de:
  edit: Bearbeiten
  link: Mit Variable verknüpfen
  remove: Entfernen
es:
  edit: Editar
  link: Vincular a Variable
  remove: Eliminar
zh:
  edit: 编辑
  link: 链接到变量
  remove: 删除
</i18n>
