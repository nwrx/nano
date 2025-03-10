<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'

defineProps<{
  runner: ThreadRunnerObject
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const showReleaseOpen = ref(false)
const showDisableOpen = ref(false)
const showEnableOpen = ref(false)
</script>

<template>
  <div class="flex items-center">
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          :label="t('menu.ping')"
          icon="i-carbon:connection-signal"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          v-if="runner.disabledAt"
          :label="t('menu.enable')"
          icon="i-carbon:checkmark"
          @click="() => showEnableOpen = true"
        />
        <ContextMenuItem
          v-else
          :label="t('menu.disable')"
          icon="i-carbon:close"
          @click="() => showDisableOpen = true"
        />
        <ContextMenuItem
          :label="t('menu.release')"
          icon="i-carbon:trash-can"
          @click="() => showReleaseOpen = true"
        />
      </template>
    </ContextMenu>

    <!-- Release Dialog -->
    <AdminSettingsRunnersDialogRelease
      v-model="showReleaseOpen"
      :address="runner.address"
      :identity="runner.identity"
      @submit="() => emit('submit')"
    />

    <!-- Disable Dialog -->
    <AdminSettingsRunnersDialogDisable
      v-model="showDisableOpen"
      :address="runner.address"
      :identity="runner.identity"
      @submit="() => emit('submit')"
    />

    <!-- Enable Dialog -->
    <AdminSettingsRunnersDialogEnable
      v-model="showEnableOpen"
      :address="runner.address"
      :identity="runner.identity"
      @submit="() => emit('submit')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  menu:
    ping: Ping
    disable: Disable
    enable: Enable
    release: Release
fr:
  menu:
    ping: Ping
    disable: Désactiver
    enable: Activer
    release: Libérer
</i18n>
