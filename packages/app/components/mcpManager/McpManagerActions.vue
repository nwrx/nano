<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import DialogRelease from './McpManagerDialogRelease.vue'
import DialogSetAddress from './McpManagerDialogSetAddress.vue'
import DialogToggle from './McpManagerDialogToggle.vue'

const props = defineProps<{
  manager: McpManagerObject
}>()

const emit = defineEmits<{
  refresh: []
  release: []
}>()

const { t } = useI18n()
const showSetAddress = ref(false)
const showToggle = ref(false)
const showRelease = ref(false)
const isDisabled = computed(() => Boolean(props.manager.disabledAt))
</script>

<template>
  <div class="flex items-center justify-end">
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          :label="t('setAddress')"
          icon="i-carbon:network-1"
          @click="() => showSetAddress = true"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          :label="isDisabled ? t('enable') : t('disable')"
          :icon="isDisabled ? 'i-carbon:play' : 'i-carbon:pause'"
          @click="() => showToggle = true"
        />
        <ContextMenuItem
          :label="t('release')"
          icon="i-carbon:trash-can"
          @click="() => showRelease = true"
        />
      </template>
    </ContextMenu>

    <!-- Set Address Dialog -->
    <DialogSetAddress
      v-model="showSetAddress"
      :manager="manager"
      @submit="() => emit('refresh')"
    />

    <!-- Enable/Disable Dialog -->
    <DialogToggle
      v-model="showToggle"
      :manager="manager"
      @submit="() => emit('refresh')"
    />

    <!-- Release Dialog -->
    <DialogRelease
      v-model="showRelease"
      :manager="manager"
      @submit="() => emit('release')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  setAddress: Set address
  enable: Enable
  disable: Disable
  release: Release
fr:
  setAddress: Définir l'adresse
  enable: Activer
  disable: Désactiver
  release: Libérer
de:
  setAddress: Adresse festlegen
  enable: Aktivieren
  disable: Deaktivieren
  release: Freigeben
es:
  setAddress: Establecer dirección
  enable: Habilitar
  disable: Deshabilitar
  release: Liberar
zh:
  setAddress: 设置地址
  enable: 启用
  disable: 禁用
  release: 释放
</i18n>
