<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceMonitoring',
  path: '/:workspace/monitoring',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const { t } = useI18n()
useHead(() => ({
  title: t('title'),
  meta: [{ name: 'description', content: t('description') }],
}))

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const session = useMonitoringSession(workspace)
</script>

<template>
  <AppPage>
    <Monitoring
      :projects="session.data.projects"
      :threads="session.data.threads"
      :events="session.data.events"
      :node-events="session.data.nodeEvents"
      :selected-project="session.data.selectedProject"
      :selected-flow="session.data.selectedFlow"
      :selected-thread="session.data.selectedThread"
      :selected-event="session.data.selectedEvent"
      @select-flow="(project, flow) => session.selectFlow(project, flow)"
      @select-thread="thread => session.selectThread(thread)"
      @select-event="event => session.selectEvent(event)"
    />
  </AppPage>
</template>

<i18n lang="yaml">
en:
  title: Monitoring
  description: Monitor activities and traces across your projects.
fr:
  title: Surveillance
  description: Surveillez les activités et les traces de vos projets.
de:
  title: Überwachung
  description: Überwachen Sie Aktivitäten und Spuren in Ihren Projekten.
es:
  title: Monitoreo
  description: Monitoree actividades y trazas en sus proyectos.
zh:
  title: 监控
  description: 监视您项目中的活动和跟踪。
</i18n>
