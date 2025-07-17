<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import IconCollectionsTable from '~/components/iconCollection/IconCollectionsTable.vue'

definePageMeta({
  name: 'AdminIconCollections',
  path: '/admin/icons',
  middleware: 'redirect-when-guest',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:image',
  title: {
    en: 'Icons',
    fr: 'Icônes',
    de: 'Symbole',
    es: 'Iconos',
    zh: '图标',
  },
  description: {
    en: 'Manage icon collections across the platform. Import new collections and manage existing ones.',
    fr: 'Gérez les collections d\'icônes sur la plateforme. Importez de nouvelles collections et gérez les existantes.',
    de: 'Verwalten Sie Icon-Sammlungen auf der gesamten Plattform. Importieren Sie neue Sammlungen und verwalten Sie bestehende.',
    es: 'Administre colecciones de iconos en toda la plataforma. Importe nuevas colecciones y administre las existentes.',
    zh: '管理整个平台的图标集合。导入新集合并管理现有集合。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <IconCollectionsTable />
  </AppPageContainer>
</template>
