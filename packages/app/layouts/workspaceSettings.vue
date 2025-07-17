<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
import AppLayout from '~/components/app/AppLayout.vue'
import AppPage from '~/components/app/AppPage.vue'
import WorkspaceHeader from '~/components/workspace/WorkspaceHeader.vue'

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <AppLayout>
    <AppPage>

      <!-- Header -->
      <WorkspaceHeader />

      <!-- Side menu -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto">
        <AppPageNav class="shrink-0 h-full sticky top-0 overflow-y-auto">
          <AppPageNavGroup name="workspace-settings" />
          <AppPageNavGroup name="workspace-security" :label="t('security')" />
          <AppPageNavGroup name="workspace-billing" :label="t('billing')" />
        </AppPageNav>

        <!-- Content -->
        <div class="relative w-full">
          <AppPageFormBreadcrumb
            v-if="route.meta.parent"
            class="sticky top-0"
            :items="[route.meta.parent, route.name as string]"
          />
          <NuxtPage />
        </div>
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
