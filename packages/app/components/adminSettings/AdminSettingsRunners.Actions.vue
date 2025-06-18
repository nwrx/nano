<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'

const props = defineProps<{
  runner: ThreadRunnerObject
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const showSetAddress = ref(false)
const showToggle = ref(false)
const showRelease = ref(false)
const isDisabled = computed(() => Boolean(props.runner.disabledAt))
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
    <AdminSettingsRunnerDangerZoneDialogSetAddress
      v-model="showSetAddress"
      :runner="runner"
      @submit="() => emit('submit')"
    />

    <!-- Enable/Disable Dialog -->
    <AdminSettingsRunnerDangerZoneDialogToggle
      v-model="showToggle"
      :runner="runner"
      @submit="() => emit('submit')"
    />

    <!-- Release Dialog -->
    <AdminSettingsRunnerDangerZoneDialogRelease
      v-model="showRelease"
      :runner="runner"
      @submit="() => emit('submit')"
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
