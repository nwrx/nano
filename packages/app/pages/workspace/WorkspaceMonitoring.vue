<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceMonitoring',
  path: '/:workspace/monitoring',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace',
  icon: 'i-carbon:cloud-monitoring',
  groups: ['nav-items-workspace'],
  title: {
    en: 'Monitoring',
    fr: 'Métriques',
    de: 'Überwachung',
    es: 'Monitoreo',
    zh: '监控',
  },
  description: {
    en: 'Monitor activities and traces across your projects.',
    fr: 'Surveillez les activités et les traces de vos projets.',
    de: 'Überwachen Sie Aktivitäten und Spuren in Ihren Projekten.',
    es: 'Monitoree actividades y trazas en sus proyectos.',
    zh: '监视您项目中的活动和跟踪。',
  },
  isWorkInProgress: true,
})

throw createError({
  name: 'E_WORK_IN_PROGRESS',
  statusCode: 503,
  statusMessage: 'Service Unavailable',
  message: 'This page is under construction. Please check back later.',
})
</script>

<template>
  <AppPageContainer contained>
    <Pattern class="h-full" />
  </AppPageContainer>
</template>
