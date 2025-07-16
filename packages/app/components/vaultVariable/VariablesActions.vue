<script setup lang="ts">
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import DialogRemove from './VariablesDialogRemove.vue'
import DialogUpdate from './VariablesDialogUpdate.vue'

defineProps<{
  workspace: string
  variable: string
  vault: string
}>()

const emit = defineEmits<{
  'update': []
  'remove': []
}>()

const { t } = useI18n()
const showUpdateDialog = ref(false)
const showRemoveDialog = ref(false)
</script>

<template>
  <div>
    <ContextMenu x="right" y="top">
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('updateLabel')"
          @click="() => showUpdateDialog = true"
        />
        <ContextMenuItem
          icon="i-carbon:delete"
          :label="t('removeLabel')"
          @click="() => showRemoveDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Update dialog -->
    <DialogUpdate
      v-model="showUpdateDialog"
      :workspace="workspace"
      :variable="variable"
      :vault="vault"
      @submit="() => emit('update')"
    />

    <!-- Remove dialog -->
    <DialogRemove
      v-model="showRemoveDialog"
      :workspace="workspace"
      :variable="variable"
      :vault="vault"
      @submit="() => emit('remove')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  removeLabel: Remove variable
  updateLabel: Update variable
fr:
  removeLabel: Supprimer la variable
  updateLabel: Mettre à jour la variable
de:
  removeLabel: Variable entfernen
  updateLabel: Variable aktualisieren
es:
  removeLabel: Eliminar variable
  updateLabel: Actualizar variable
zh:
  removeLabel: 删除变量
  updateLabel: 更新变量
</i18n>
