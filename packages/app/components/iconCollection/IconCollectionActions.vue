<script setup lang="ts">
import type { IconCollectionObject } from '@nwrx/nano-api'
import ContextMenuDivider from '~/components/base/ContextMenu.Divider.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import DialogDisable from './IconCollectionDialogDisable.vue'
import DialogEnable from './IconCollectionDialogEnable.vue'
import DialogInstall from './IconCollectionDialogInstall.vue'
import DialogUninstall from './IconCollectionDialogUninstall.vue'

const props = defineProps<{
  collection: IconCollectionObject
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const showInstallDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
const showUninstallDialog = ref(false)
const isDisabled = computed(() => Boolean(props.collection.disabledAt))
const isInstalled = computed(() => props.collection.status === 'Installed')
const isInstalling = computed(() => props.collection.status === 'Installing')
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          v-if="!isInstalled && !isInstalling"
          :label="t('install')"
          icon="i-carbon:download"
          @click="() => showInstallDialog = true"
        />
        <ContextMenuItem
          v-if="isInstalled && isDisabled"
          :label="t('enable')"
          icon="i-carbon:play"
          @click="() => showEnableDialog = true"
        />
        <ContextMenuItem
          v-if="isInstalled && !isDisabled"
          :label="t('disable')"
          icon="i-carbon:pause"
          @click="() => showDisableDialog = true"
        />
        <ContextMenuDivider v-if="isInstalled" />
        <ContextMenuItem
          v-if="isInstalled"
          :label="t('uninstall')"
          icon="i-carbon:trash-can"
          @click="() => showUninstallDialog = true"
        />
      </template>
    </ContextMenu>

    <!-- Install Dialog -->
    <DialogInstall
      v-model="showInstallDialog"
      :name="collection.name"
      @submit="() => emit('refresh')"
    />

    <!-- Enable Dialog -->
    <DialogEnable
      v-model="showEnableDialog"
      :name="collection.name"
      @submit="() => emit('refresh')"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-model="showDisableDialog"
      :name="collection.name"
      @submit="() => emit('refresh')"
    />

    <!-- Uninstall Dialog -->
    <DialogUninstall
      v-model="showUninstallDialog"
      :name="collection.name"
      @submit="() => emit('refresh')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  install: Install
  enable: Enable
  disable: Disable
  uninstall: Uninstall
fr:
  install: Installer
  enable: Activer
  disable: Désactiver
  uninstall: Désinstaller
de:
  install: Installieren
  enable: Aktivieren
  disable: Deaktivieren
  uninstall: Deinstallieren
es:
  install: Instalar
  enable: Habilitar
  disable: Deshabilitar
  uninstall: Desinstalar
zh:
  install: 安装
  enable: 启用
  disable: 禁用
  uninstall: 卸载
</i18n>
