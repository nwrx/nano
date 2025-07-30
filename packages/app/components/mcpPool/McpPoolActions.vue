<script setup lang="ts">
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import DialogDelete from './McpPoolDialogDelete.vue'
import DialogDisable from './McpPoolDialogDisable.vue'
import DialogEnable from './McpPoolDialogEnable.vue'
import DialogRename from './McpPoolDialogRename.vue'

defineProps<{
  workspace: string
  name: string
}>()

const { t } = useI18n()
const showRename = ref(false)
const showEnable = ref(false)
const showDisable = ref(false)
const showDelete = ref(false)
const isDisabled = computed(() => false)
</script>

<template>
  <div class="flex items-center justify-end">
    <ContextMenu x="right" y="top" compact @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          :label="t('rename')"
          icon="i-carbon:edit"
          @click="() => showRename = true"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          v-if="isDisabled"
          :label="t('enable')"
          icon="i-carbon:play"
          @click="() => showEnable = true"
        />
        <ContextMenuItem
          v-else
          :label="t('disable')"
          icon="i-carbon:pause"
          @click="() => showDisable = true"
        />
        <ContextMenuItem
          :label="t('delete')"
          icon="i-carbon:trash-can"
          @click="() => showDelete = true"
        />
      </template>
    </ContextMenu>

    <!-- Rename Dialog -->
    <DialogRename
      v-if="showRename"
      v-model="showRename"
      :workspace="workspace"
      :name="name"
    />

    <!-- Enable Dialog -->
    <DialogEnable
      v-if="showEnable"
      v-model="showEnable"
      :workspace="workspace"
      :name="name"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-if="showDisable"
      v-model="showDisable"
      :workspace="workspace"
      :name="name"
    />

    <!-- Delete Dialog -->
    <DialogDelete
      v-if="showDelete"
      v-model="showDelete"
      :workspace="workspace"
      :name="name"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  rename: Rename pool
  enable: Enable pool
  disable: Disable pool
  delete: Delete pool
fr:
  rename: Renommer le pool
  enable: Activer le pool
  disable: Désactiver le pool
  delete: Supprimer le pool
de:
  rename: Pool umbenennen
  enable: Pool aktivieren
  disable: Pool deaktivieren
  delete: Pool löschen
es:
  rename: Renombrar pool
  enable: Habilitar pool
  disable: Deshabilitar pool
  delete: Eliminar pool
zh:
  rename: 重命名池
  enable: 启用池
  disable: 禁用池
  delete: 删除池
</i18n>
