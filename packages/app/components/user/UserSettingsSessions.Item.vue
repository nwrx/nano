<script setup lang="ts">
import type { UserSessionObject } from '@nwrx/nano-api'

const props = defineProps<{
  isCurrent: boolean
} & UserSessionObject>()

const emit = defineEmits<{
  remove: []
}>()

// --- Localize
const { t } = useI18n()
const lastUsedAt = computed(() => formatDateFromNow(props.lastUsedAt))
</script>

<template>
  <div class="flex items-center px-8 not-last:border-b border-app py-4 gap-8">

    <!-- Is current indicator (circle) -->
    <BaseIcon
      icon="i-carbon:circle-solid"
      class="size-2 rounded-full border border-app shrink"
      :class="isCurrent ? 'text-success' : 'text-subtle'"
    />

    <!-- Icon -->
    <BaseIcon
      icon="i-carbon:screen"
      class="size-10 text-app shrink-0"
    />

    <!-- IP Address -->
    <div class="flex items-center space-x-lg">
      <UserSettingsSessionsItemValue v-if="address" :name="t('value.address')" :value="address" />
      <UserSettingsSessionsItemValue v-if="lastUsedAt" :name="t('value.lastUsedAt')" :value="lastUsedAt" />
      <UserSettingsSessionsItemValue v-if="browser" :name="t('value.browser')" :value="browser" />
      <UserSettingsSessionsItemValue v-if="os" :name="t('value.os')" :value="os" />
      <UserSettingsSessionsItemValue v-if="device" :name="t('value.device')" :value="device" />
    </div>

    <!-- Delete button -->
    <Button
      outlined
      size="sm"
      variant="danger"
      :label="t('button.remove')"
      class="ml-auto"
      icon-prepend="i-carbon:logout"
      @click="() => emit('remove')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  value.address: IP Address
  value.lastUsedAt: Last used
  value.browser: Browser
  value.os: System
  value.device: Device
  button.remove: Sign out
fr:
  value.address: Adresse IP
  value.lastUsedAt: Dernière utilisation
  value.browser: Navigateur
  value.os: Système
  value.device: Appareil
  button.remove: Déconnecter
de:
  value.address: IP-Adresse
  value.lastUsedAt: Zuletzt verwendet
  value.browser: Browser
  value.os: System
  value.device: Gerät
  button.remove: Abmelden
es:
  value.address: Dirección IP
  value.lastUsedAt: Último uso
  value.browser: Navegador
  value.os: Sistema
  value.device: Dispositivo
  button.remove: Cerrar sesión
zh:
  value.address: IP 地址
  value.lastUsedAt: 上次使用
  value.browser: 浏览器
  value.os: 系统
  value.device: 设备
  button.remove: 登出
</i18n>
