<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import DialogDisable from './RunnerDialogDisable.vue'
import DialogEnable from './RunnerDialogEnable.vue'
import DialogRelease from './RunnerDialogRelease.vue'
import DialogSetAddress from './RunnerDialogSetAddress.vue'

const props = defineProps<{
  runner: ThreadRunnerObject
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const showSetAddress = ref(false)
const showEnable = ref(false)
const showDisable = ref(false)
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
          :label="t('release')"
          icon="i-carbon:trash-can"
          @click="() => showRelease = true"
        />
      </template>
    </ContextMenu>

    <!-- Set Address Dialog -->
    <DialogSetAddress
      v-model="showSetAddress"
      :runner="runner"
      @submit="() => emit('submit')"
    />

    <!-- Enable Dialog -->
    <DialogEnable
      v-model="showEnable"
      :runner="runner"
      @submit="() => emit('submit')"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-model="showDisable"
      :runner="runner"
      @submit="() => emit('submit')"
    />

    <!-- Release Dialog -->
    <DialogRelease
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
