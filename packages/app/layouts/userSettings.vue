<script setup lang="ts">
const { t } = useI18n()
const user = useSession()
const route = useRoute()
</script>

<template>
  <AppLayout>
    <AppPage>

      <!-- Header -->
      <AppPageHeader
        :icon="route.meta.icon"
        :title="[user.data.displayName, localize(route.meta.title)]"
        :description="localize(route.meta.description)"
      />

      <!-- Side menu -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto divide-x divide-app">
        <NuxtPage />
        <AppPageNav class="shrink-0 h-full sticky top-0 overflow-y-auto">
          <AppPageNavGroup name="user-settings" />
          <AppPageNavGroup name="user-security" :label="t('security')" />
          <AppPageNavGroup name="user-billing" :label="t('billing')" />
        </AppPageNav>
      </div>
    </AppPage>
  </AppLayout>
</template>

<i18n lang="yaml">
en:
  security: Security
  billing: Billing
fr:
  security: Sécurité
  billing: Facturation
de:
  security: Sicherheit
  billing: Abrechnung
es:
  security: Seguridad
  billing: Facturación
zh:
  security: 安全
  billing: 计费
</i18n>
