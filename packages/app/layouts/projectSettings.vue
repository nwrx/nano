<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const project = computed(() => route.params.project as string)
</script>

<template>
  <AppLayout>
    <AppPage>

      <!-- Header -->
      <AppPageHeader
        :icon="route.meta.icon"
        :title="[workspace, project, localize(route.meta.title)]"
        :description="localize(route.meta.description)"
      />

      <!-- Side menu -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto">
        <AppPageNav class="shrink-0 h-full sticky top-0 overflow-y-auto">
          <AppPageNavGroup name="project-settings" />
          <AppPageNavGroup name="project-security" :label="t('security')" />
          <AppPageNavGroup name="project-billing" :label="t('billing')" />
        </AppPageNav>

        <!-- Content -->
        <div class="relative w-full">
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
