<script setup lang="ts">
defineProps<{
  address: string
  identity: string
  isEnabled?: boolean
  isConnected?: boolean
}>()

// --- Define emits.
const emit = defineEmits<{
  submitPing: []
  submitRelease: []
  submitDisable: []
  submitEnable: []
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
          @click="() => emit('submitPing')"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          v-if="!isEnabled"
          :label="t('menu.enable')"
          icon="i-carbon:checkmark"
          @click="() => showEnableOpen = true"
        />
        <ContextMenuItem
          v-if="isEnabled"
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
    <AdminServerRunnersDialogRelease
      v-model="showReleaseOpen"
      :address="address"
      :identity="identity"
      @submit="() => emit('submitRelease')"
    />

    <!-- Disable Dialog -->
    <AdminServerRunnersDialogDisable
      v-model="showDisableOpen"
      :address="address"
      :identity="identity"
      @submit="() => emit('submitDisable')"
    />

    <!-- Enable Dialog -->
    <AdminServerRunnersDialogEnable
      v-model="showEnableOpen"
      :address="address"
      :identity="identity"
      @submit="() => emit('submitEnable')"
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
