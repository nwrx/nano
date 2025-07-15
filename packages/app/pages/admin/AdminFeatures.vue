<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsFeatures',
  path: '/admin/features',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:checkbox-checked',
  title: {
    en: 'Features',
    fr: 'Fonctionnalités',
    de: 'Funktionen',
    es: 'Características',
    zh: '功能',
  },
  description: {
    en: 'Enable or disable platform features and capabilities.',
    fr: 'Activer ou désactiver les fonctionnalités et capacités de la plateforme.',
    de: 'Aktivieren oder deaktivieren Sie Plattformfunktionen und -fähigkeiten.',
    es: 'Habilite o deshabilite características y capacidades de la plataforma.',
    zh: '启用或禁用平台功能和能力。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>
