<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })
</script>

<template>
  <AppPage class="flex flex-col overflow-hidden w-full">

    <!-- Header -->
    <AppPageHeader
      icon="i-carbon:box"
      :title="t('title')"
      :description="t('description')"
    />

    <!-- Side menu -->
    <AppPageContainer contained class="bg-white">
      <div class="flex w-full h-full gap-16">
        <AppPageNav class="h-full shrink">
          <AppPageNavGroup>
            <AppPageNavItem :label="t('nav.settings.settings')" icon="i-carbon:settings" :to="{ name: 'ProjectSettings' }" />
            <AppPageNavItem :label="t('nav.settings.access')" icon="i-carbon:user" to="/settings/access" />
            <AppPageNavItem :label="t('nav.settings.integrations')" icon="i-carbon:connect" to="/settings/integrations" />
            <AppPageNavItem :label="t('nav.settings.webhooks')" icon="i-carbon:webhook" to="/settings/webhooks" />
            <AppPageNavItem :label="t('nav.settings.variables')" icon="i-carbon:label" to="/settings/variables" />
            <AppPageNavItem :label="t('nav.settings.apiKeys')" icon="i-carbon:api-key" to="/settings/security/api-keys" />
          </AppPageNavGroup>

          <AppPageNavGroup :label="t('nav.monitoring')">
            <AppPageNavItem :label="t('nav.monitoring.logs')" icon="i-carbon:activity" to="/settings/monitoring/logs" />
            <AppPageNavItem :label="t('nav.monitoring.metrics')" icon="i-carbon:dashboard" to="/settings/monitoring/metrics" />
            <AppPageNavItem :label="t('nav.monitoring.alerts')" icon="i-carbon:notification" to="/settings/monitoring/alerts" />
          </AppPageNavGroup>
        </AppPageNav>

        <!-- Content -->
        <div class="w-full">
          <slot/>
        </div>
      </div>
    </AppPageContainer>
  </AppPage>
</template>

<i18n lang="yaml">
  en:
    title: Project Settings
    description: Manage your project settings, and configurations.
    nav.settings.settings: Settings
    nav.settings.access: Members & Access
    nav.settings.integrations: Integrations
    nav.settings.webhooks: Webhooks
    nav.settings.variables: Variables & Secrets
    nav.settings.apiKeys: API Keys
    nav.monitoring: Monitoring
    nav.monitoring.logs: Logs
    nav.monitoring.metrics: Metrics
    nav.monitoring.alerts: Alerts
  fr:
    title: Paramètres du projet
    description: Gérez les paramètres et configurations de votre projet.
    nav.settings.settings: Paramètres
    nav.settings.access: Membres & Accès
    nav.settings.integrations: Intégrations
    nav.settings.webhooks: Webhooks
    nav.settings.variables: Variables & Secrets
    nav.settings.apiKeys: Clés API
    nav.monitoring: Surveillance
    nav.monitoring.logs: Journaux
    nav.monitoring.metrics: Métriques
    nav.monitoring.alerts: Alertes
  de:
    title: Projekteinstellungen
    description: Verwalten Sie Ihre Projekteinstellungen und Konfigurationen.
    nav.settings.settings: Einstellungen
    nav.settings.access: Mitglieder & Zugriff
    nav.settings.integrations: Integrationen
    nav.settings.webhooks: Webhooks
    nav.settings.variables: Variablen & Geheimnisse
    nav.settings.apiKeys: API-Schlüssel
    nav.monitoring: Überwachung
    nav.monitoring.logs: Protokolle
    nav.monitoring.metrics: Metriken
    nav.monitoring.alerts: Warnungen
  es:
    title: Configuración del proyecto
    description: Administre la configuración y las configuraciones de su proyecto.
    nav.settings.settings: Ajustes
    nav.settings.access: Miembros y Acceso
    nav.settings.integrations: Integraciones
    nav.settings.webhooks: Webhooks
    nav.settings.variables: Variables y Secretos
    nav.settings.apiKeys: Claves API
    nav.monitoring: Monitoreo
    nav.monitoring.logs: Registros
    nav.monitoring.metrics: Métricas
    nav.monitoring.alerts: Alertas
  zh:
    title: 项目设置
    description: 管理您的项目设置和配置。
    nav.settings.settings: 设置
    nav.settings.access: 成员和访问
    nav.settings.integrations: 集成
    nav.settings.webhooks: Webhooks
    nav.settings.variables: 变量和秘密
    nav.settings.apiKeys: API密钥
    nav.monitoring: 监控
    nav.monitoring.logs: 日志
    nav.monitoring.metrics: 指标
    nav.monitoring.alerts: 警报
</i18n>
