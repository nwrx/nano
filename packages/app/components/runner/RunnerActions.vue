<script setup lang="ts">
import type { RunnerObject } from '@nwrx/nano-api'
import DialogDisable from './RunnerDialogDisable.vue'
import DialogEnable from './RunnerDialogEnable.vue'
import DialogRelease from './RunnerDialogRelease.vue'
import DialogRename from './RunnerDialogRename.vue'
import DialogSetAddress from './RunnerDialogSetAddress.vue'

defineProps<{
  runner: RunnerObject
}>()

const { t } = useI18n()
const showSetAddress = ref(false)
const showRename = ref(false)
const showEnable = ref(false)
const showDisable = ref(false)
const showRelease = ref(false)
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
        <ContextMenuItem
          :label="t('rename')"
          icon="i-carbon:edit"
          @click="() => showRename = true"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          v-if="runner.disabledAt"
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
      v-if="showSetAddress"
      v-model="showSetAddress"
      :name="runner.name"
    />

    <!-- Rename Dialog -->
    <DialogRename
      v-if="showRename"
      v-model="showRename"
      :name="runner.name"
    />

    <!-- Enable Dialog -->
    <DialogEnable
      v-if="showEnable"
      v-model="showEnable"
      :name="runner.name"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-if="showDisable"
      v-model="showDisable"
      :name="runner.name"
    />

    <!-- Release Dialog -->
    <DialogRelease
      v-if="showRelease"
      v-model="showRelease"
      :name="runner.name"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  setAddress: Set address
  rename: Rename
  enable: Enable
  disable: Disable
  release: Release
fr:
  setAddress: Définir l'adresse
  rename: Renommer
  enable: Activer
  disable: Désactiver
  release: Libérer
de:
  setAddress: Adresse festlegen
  rename: Umbenennen
  enable: Aktivieren
  disable: Deaktivieren
  release: Freigeben
es:
  setAddress: Establecer dirección
  rename: Renombrar
  enable: Habilitar
  disable: Deshabilitar
  release: Liberar
zh:
  setAddress: 设置地址
  rename: 重命名
  enable: 启用
  disable: 禁用
  release: 释放
</i18n>
