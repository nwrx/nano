<script setup lang="ts">
import type { McpGatewayObject } from '@nwrx/nano-api'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import DialogDisable from './McpGatewayDialogDisable.vue'
import DialogEnable from './McpGatewayDialogEnable.vue'
import DialogRemove from './McpGatewayDialogRemove.vue'

defineProps<{
  gateway: McpGatewayObject
  manager: string
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const showRemoveDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
</script>

<template>
  <div class="flex items-center justify-end">
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          v-if="gateway.disabledAt"
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
          :label="t('remove')"
          icon="i-carbon:trash-can"
          @click="() => showRemoveDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Enable Dialog -->
    <DialogEnable
      v-model="showEnableDialog"
      :gateway="gateway"
      :manager="manager"
      @submit="() => emit('submit')"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-model="showDisableDialog"
      :gateway="gateway"
      :manager="manager"
      @submit="() => emit('submit')"
    />

    <!-- Remove Dialog -->
    <DialogRemove
      v-model="showRemoveDialog"
      :gateway="gateway"
      :manager="manager"
      @submit="() => emit('submit')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  enable: Enable
  disable: Disable
  remove: Remove
fr:
  enable: Activer
  disable: Désactiver
  remove: Supprimer
de:
  enable: Aktivieren
  disable: Deaktivieren
  remove: Entfernen
es:
  enable: Habilitar
  disable: Deshabilitar
  remove: Eliminar
zh:
  enable: 启用
  disable: 禁用
  remove: 移除
</i18n>
