<script setup lang="ts">
import type { McpPoolObject, McpServerObject } from '@nwrx/nano-api'
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import DialogDelete from './McpServerDialogDelete.vue'
import DialogDisable from './McpServerDialogDisable.vue'
import DialogEnable from './McpServerDialogEnable.vue'
import DialogRename from './McpServerDialogRename.vue'

const props = defineProps<{
  pool: McpPoolObject
  server: McpServerObject
  workspace: string
}>()

const emit = defineEmits<{
  edit: []
  refresh: []
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
const showDeleteDialog = ref(false)
const isDisabled = computed(() => Boolean(props.server.disabledAt))
</script>

<template>
  <div class="flex h-full items-center justify-center">
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
          v-if="isDisabled"
          :label="t('enable')"
          icon="i-carbon:play"
          @click="() => showEnableDialog = true"
        />
        <ContextMenuItem
          v-else
          :label="t('disable')"
          icon="i-carbon:pause"
          @click="() => showDisableDialog = true"
        />
        <ContextMenuItem
          :label="t('delete')"
          icon="i-carbon:trash-can"
          @click="() => showDeleteDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Rename Dialog -->
    <DialogRename
      v-model="showRenameDialog"
      :workspace="workspace"
      :pool="pool.name"
      :name="server.name"
      @submit="() => emit('refresh')"
    />

    <!-- Enable Dialog -->
    <DialogEnable
      v-model="showEnableDialog"
      :workspace="workspace"
      :pool="pool.name"
      :name="server.name"
      @submit="() => emit('refresh')"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-model="showDisableDialog"
      :workspace="workspace"
      :pool="pool.name"
      :name="server.name"
      @submit="() => emit('refresh')"
    />

    <!-- Delete Dialog -->
    <DialogDelete
      v-model="showDeleteDialog"
      :workspace="workspace"
      :pool="pool.name"
      :name="server.name"
      @submit="() => emit('refresh')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  edit: Settings
  rename: Rename
  enable: Enable
  disable: Disable
  delete: Delete
fr:
  edit: Paramètres
  rename: Renommer
  enable: Activer
  disable: Désactiver
  delete: Supprimer
de:
  edit: Einstellungen
  rename: Umbenennen
  enable: Aktivieren
  disable: Deaktivieren
  delete: Löschen
es:
  edit: Configuración
  rename: Renombrar
  enable: Habilitar
  disable: Deshabilitar
  delete: Eliminar
zh:
  edit: 设置
  rename: 重命名
  enable: 启用
  disable: 禁用
  delete: 删除
</i18n>
