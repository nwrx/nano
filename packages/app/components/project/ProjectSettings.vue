<script setup lang="ts">
defineProps<{
  workspace: string
  project: string
}>()

const { t } = useI18n()
</script>

<template>
  <AppPage>

    <!-- Header -->
    <AppPageHeader
      icon="i-carbon:box"
      :title="t('title')"
      :description="t('description')"
    />

    <!-- Side menu -->
    <div class="flex w-full gap-lg py-lg">
      <AppPageNav class="shrink">
        <AppPageNavGroup>
          <AppPageNavItem
            :label="t('settings')"
            icon="i-carbon:settings"
            :to="{ name: 'WorkspaceProjectSettings', params: { workspace, project } }"
          />
          <AppPageNavItem
            :label="t('access')"
            icon="i-carbon:user"
            to="/settings/access"
          />
          <AppPageNavItem
            :label="t('integrations')"
            icon="i-carbon:connect"
            to="/settings/integrations"
          />
          <AppPageNavItem
            :label="t('webhooks')"
            icon="i-carbon:webhook"
            to="/settings/webhooks"
          />
          <AppPageNavItem
            :label="t('variables')"
            icon="i-carbon:label"
            :to="{ name: 'WorkspaceProjectSettingsVariables', params: { workspace, project } }"
          />
          <AppPageNavItem
            :label="t('apiKeys')"
            icon="i-carbon:api-key"
            to="/settings/security/api-keys"
          />
        </AppPageNavGroup>

        <AppPageNavGroup :label="t('monitoring')">
          <AppPageNavItem
            :label="t('logs')"
            icon="i-carbon:activity"
            to="/settings/monitoring/logs"
          />
          <AppPageNavItem
            :label="t('metrics')"
            icon="i-carbon:dashboard"
            to="/settings/monitoring/metrics"
          />
          <AppPageNavItem
            :label="t('alerts')"
            icon="i-carbon:notification"
            to="/settings/monitoring/alerts"
          />
        </AppPageNavGroup>
      </AppPageNav>

      <!-- Content -->
      <AppPageContainer contained>
        <slot />
      </AppPageContainer>
    </div>
  </AppPage>
</template>

<i18n lang="yaml">
en:
  title: Project Settings
  description: Manage your project settings, and configurations.
  settings: Settings
  access: Members & Access
  integrations: Integrations
  webhooks: Webhooks
  variables: Variables & Secrets
  secrets: Secrets
  apiKeys: API Keys
  monitoring: Monitoring
  logs: Logs
  metrics: Metrics
  alerts: Alerts
fr:
  title: Paramètres du projet
  description: Gérez les paramètres et configurations de votre projet.
  settings: Paramètres
  access: Membres & Accès
  integrations: Intégrations
  webhooks: Webhooks
  variables: Variables & Secrets
  secrets: Secrets
  apiKeys: Clés API
  monitoring: Surveillance
  logs: Journaux
  metrics: Métriques
  alerts: Alertes
de:
  title: Projekteinstellungen
  description: Verwalten Sie Ihre Projekteinstellungen und Konfigurationen.
  settings: Einstellungen
  access: Mitglieder & Zugriff
  integrations: Integrationen
  webhooks: Webhooks
  variables: Variablen & Geheimnisse
  secrets: Geheimnisse
  apiKeys: API-Schlüssel
  monitoring: Überwachung
  logs: Protokolle
  metrics: Metriken
  alerts: Warnungen
es:
  title: Configuración del proyecto
  description: Administre la configuración y las configuraciones de su proyecto.
  settings: Ajustes
  access: Miembros y Acceso
  integrations: Integraciones
  webhooks: Webhooks
  variables: Variables y Secretos
  secrets: Secretos
  apiKeys: Claves API
  monitoring: Monitoreo
  logs: Registros
  metrics: Métricas
  alerts: Alertas
zh:
  title: 项目设置
  description: 管理您的项目设置和配置。
  settings: 设置
  access: 成员和访问
  integrations: 集成
  webhooks: Webhooks
  variables: 变量和秘密
  secrets: 秘密
  apiKeys: API密钥
  monitoring: 监控
  logs: 日志
  metrics: 指标
  alerts: 警报
</i18n>
