<script setup lang="ts">
import type { UserSessionObject } from '@nwrx/api'

defineProps<{
  sessions: UserSessionObject[]
}>()

const emit = defineEmits<{
  removeSession: [index: number]
}>()

// --- Localize
const { t } = useI18n()
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')"
    vertical>

    <!-- Sessions -->
    <div class="w-full rounded border border-app">
      <h3 class="text-sm font-medium px-md py-sm bg-subtle border-b border-app">
        Active Sessions
      </h3>
      <UserSettingsSessionsItem
        v-for="(session, index) in sessions"
        :key="index"
        v-bind="session"
        :is-current="index === 0"
        @remove="() => emit('removeSession', index)"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Sessions
  text: Manage your active sessions and sign out from devices you no longer use. We advise you to sign out from devices you no longer use to keep your account secure.
fr:
  title: Sessions
  text: Gérez vos sessions actives et déconnectez-vous des appareils que vous n'utilisez plus. Nous vous conseillons de vous déconnecter des appareils que vous n'utilisez plus pour sécuriser votre compte.
de:
  title: Sitzungen
  text: Verwalten Sie Ihre aktiven Sitzungen und melden Sie sich von Geräten ab, die Sie nicht mehr verwenden. Wir raten Ihnen, sich von Geräten abzumelden, die Sie nicht mehr verwenden, um Ihr Konto sicher zu halten.
es:
  title: Sesiones
  text: Administre sus sesiones activas y cierre la sesión en dispositivos que ya no utiliza. Le aconsejamos que cierre la sesión en dispositivos que ya no utiliza para mantener segura su cuenta.
zh:
  title: 会话
  text: 管理您的活动会话并注销您不再使用的设备。我们建议您注销您不再使用的设备，以保护您的帐户安全。
</i18n>
