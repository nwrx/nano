<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import McpPoolSettingsDangerZoneDialogDelete from './McpPool.DialogDelete.vue'
import McpPoolSettingsDangerZoneDialogRename from './McpPool.DialogRename.vue'
import McpPoolSettingsDangerZoneDialogToggle from './McpPool.DialogToggle.vue'

const props = defineProps<{
  pool: McpPoolObject
  workspace: string
}>()

const emit = defineEmits<{
  edit: []
  refresh: []
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showToggleDialog = ref(false)
const showDeleteDialog = ref(false)
const isDisabled = computed(() => Boolean(props.pool.deletedAt))
</script>

<template>
  <div class="flex items-center justify-end">
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #default="slotProps">
        <BaseButton
          eager
          class="flex items-center justify-center aspect-square rd hover:bg-prominent"
          @click="() => slotProps.toggle()">
          <BaseIcon
            icon="i-carbon:menu"
            class="size-4"
          />
        </BaseButton>
      </template>

      <template #menu="slotProps">
        <ContextMenuItem
          :label="t('edit')"
          icon="i-carbon:settings"
          @click="() => {
            slotProps.close()
            emit('edit')
          }"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          :label="t('rename')"
          icon="i-carbon:edit"
          @click="() => showRenameDialog = true"
        />
        <ContextMenuItem
          :label="isDisabled ? t('enable') : t('disable')"
          :icon="isDisabled ? 'i-carbon:play' : 'i-carbon:pause'"
          @click="() => showToggleDialog = true"
        />
        <ContextMenuItem
          :label="t('delete')"
          icon="i-carbon:trash-can"
          @click="() => showDeleteDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Rename Dialog -->
    <McpPoolSettingsDangerZoneDialogRename
      v-model="showRenameDialog"
      :pool="pool"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />

    <!-- Enable/Disable Dialog -->
    <McpPoolSettingsDangerZoneDialogToggle
      v-model="showToggleDialog"
      :pool="pool"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />

    <!-- Delete Dialog -->
    <McpPoolSettingsDangerZoneDialogDelete
      v-model="showDeleteDialog"
      :pool="pool"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  edit: Edit pool settings
  rename: Rename pool
  enable: Enable pool
  disable: Disable pool
  delete: Delete pool
fr:
  edit: Modifier les paramètres du pool
  rename: Renommer le pool
  enable: Activer le pool
  disable: Désactiver le pool
  delete: Supprimer le pool
de:
  edit: Pool-Einstellungen bearbeiten
  rename: Pool umbenennen
  enable: Pool aktivieren
  disable: Pool deaktivieren
  delete: Pool löschen
es:
  edit: Editar configuración del pool
  rename: Renombrar pool
  enable: Habilitar pool
  disable: Deshabilitar pool
  delete: Eliminar pool
zh:
  edit: 编辑池设置
  rename: 重命名池
  enable: 启用池
  disable: 禁用池
  delete: 删除池
</i18n>
