<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import RunnerTable from '~/components/runner/RunnerTable.vue'

definePageMeta({
  name: 'AdminSettingsRunners',
  path: '/admin/runners',
  layout: 'admin-settings',
  group: 'admin-server',
  icon: 'i-carbon:bare-metal-server-02',
  title: {
    en: 'Thread Runners',
    fr: 'Serveurs d\'exécution',
    de: 'Thread-Runners',
    es: 'Ejecutores',
    zh: '线程运行器',
  },
  description: {
    en: 'Manage compute runners and execution environments.',
    fr: 'Gérer les serveurs d\'exécution et les environnements de calcul.',
    de: 'Verwalten Sie Compute-Runners und Ausführungsumgebungen.',
    es: 'Gestionar ejecutores y entornos de ejecución.',
    zh: '管理计算运行器和执行环境。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <RunnerTable />
  </AppPageContainer>
</template>
