<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsRunners',
  path: '/admin/runners',
  layout: 'admin-settings',
  group: 'admin-server',
  icon: 'i-carbon:bare-metal-server-02',
  title: {
    en: 'Runners',
    fr: 'Travailleurs',
    de: 'Runner',
    es: 'Ejecutores',
    zh: '运行器',
  },
  description: {
    en: 'Manage compute runners and execution environments.',
    fr: 'Gérer les travailleurs de calcul et les environnements d\'exécution.',
    de: 'Verwalten Sie Rechenläufer und Ausführungsumgebungen.',
    es: 'Administre los ejecutores de cómputo y entornos de ejecución.',
    zh: '管理计算运行器和执行环境。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <AdminSettingsRunners />
  </AppPageContainer>
</template>
