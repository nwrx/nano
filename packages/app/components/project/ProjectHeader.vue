<script setup lang="ts">
import type { MaybeArray } from '@unshared/types'

defineProps<{
  icon?: string
  title: MaybeArray<string>
  description: string
  workspace?: string
  project?: string
}>()

const { t } = useI18n()
const routeLocation = useRouteLocation()
</script>

<template>
  <AppPageHeader
    v-if="workspace"
    :icon="icon"
    :title="[workspace, project, title].filter(Boolean) as string[]"
    :description="description">

    <!-- Tabs -->
    <AppPageHeaderTab
      :label="t('projects')"
      icon="i-carbon:flow"
      :to="routeLocation.getWorkspaceRoute(workspace)"
    />
    <AppPageHeaderTab
      :label="t('chat')"
      icon="i-carbon:chat"
      :to="routeLocation.getWorkspaceChatRoute(workspace)"
    />
    <AppPageHeaderTab
      :label="t('monitoring')"
      icon="i-carbon:cloud-monitoring"
      :to="routeLocation.getWorkspaceMonitoringRoute(workspace)"
    />
    <AppPageHeaderTab
      :label="t('tests')"
      icon="i-carbon:checkmark-outline"
    />
    <AppPageHeaderTab
      :label="t('settings')"
      icon="i-carbon:settings"
      :to="routeLocation.getWorkspaceSettingsRoute(workspace)"
    />
  </AppPageHeader>
</template>

<i18n lang="yaml">
en:
  projects: Projects
  chat: Chat
  monitoring: Monitoring
  tests: Tests
  settings: Settings
fr:
  projects: Projets
  chat: Chat
  monitoring: Métriques
  tests: Tests
  settings: Parametres
de:
  projects: Projekte
  monitoring: Überwachung
  tests: Tests
  settings: Einstellungen
es:
  projects: Proyectos
  monitoring: Monitoreo
  tests: Pruebas
  settings: Ajustes
zh:
  projects: 项目
  monitoring: 监控
  tests: 测试
  settings: 设置
</i18n>
