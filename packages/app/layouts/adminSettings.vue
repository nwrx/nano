<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <AppLayout>
    <AppPage>

      <!-- Header -->
      <AppPageHeader
        :icon="route.meta.icon"
        :title="[t('admin'), localize(route.meta.title)]"
        :description="localize(route.meta.description)"
      />

      <!-- Side menu -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto">
        <AppPageNav class="shrink-0 h-full sticky top-0 overflow-y-auto">
          <AppPageNavGroup name="admin-settings" />
          <AppPageNavGroup name="admin-server" :label="t('server')" />
          <AppPageNavGroup name="admin-users" :label="t('users')" />
          <AppPageNavGroup name="admin-registry" :label="t('registry')" />
          <AppPageNavGroup name="admin-analytics" :label="t('analytics')" />
        </AppPageNav>

        <!-- Content -->
        <div class="relative w-full">
          <NuxtPage transition />
        </div>
      </div>
    </AppPage>
  </AppLayout>
</template>

<i18n lang="yaml">
en:
  admin: Administation
  server: Server
  users: Users
  registry: Registry
  analytics: Analytics
fr:
  admin: Administration
  server: Serveur
  users: Utilisateurs
  registry: Registre
  analytics: Analytique
de:
  admin: Verwaltung
  server: Server
  users: Benutzer
  registry: Registrierung
  analytics: Analytik
es:
  admin: Administración
  server: Servidor
  users: Usuarios
  registry: Registro
  analytics: Analítica
zh:
  admin: 管理
  server: 服务器
  users: 用户
  registry: 注册表
  analytics: 分析
</i18n>
