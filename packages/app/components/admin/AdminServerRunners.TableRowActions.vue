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

// --- Load i18n instance.
const { t } = useI18n()

// --- Dialog states.
const isDialogReleaseOpen = ref(false)
const isDialogDisableOpen = ref(false)
const isDialogEnableOpen = ref(false)
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
          @click="() => isDialogEnableOpen = true"
        />
        <ContextMenuItem
          v-if="isEnabled"
          :label="t('menu.disable')"
          icon="i-carbon:close"
          @click="() => isDialogDisableOpen = true"
        />
        <ContextMenuItem
          :label="t('menu.release')"
          icon="i-carbon:trash-can"
          @click="() => isDialogReleaseOpen = true"
        />
      </template>
    </ContextMenu>

    <!-- Release Dialog -->
    <AdminServerRunnersDialogRelease
      v-model="isDialogReleaseOpen"
      :address="address"
      :identity="identity"
      @submit="() => emit('submitRelease')"
    />

    <!-- Disable Dialog -->
    <AdminServerRunnersDialogDisable
      v-model="isDialogDisableOpen"
      :address="address"
      :identity="identity"
      @submit="() => emit('submitDisable')"
    />

    <!-- Enable Dialog -->
    <AdminServerRunnersDialogEnable
      v-model="isDialogEnableOpen"
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
