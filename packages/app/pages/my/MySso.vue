<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsSso',
  path: '/settings/sso',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-security',
  icon: 'i-carbon:credentials',
  title: {
    en: 'Single sign-on',
    fr: 'Authentification unique',
    de: 'Single Sign-On',
    es: 'Inicio de sesión único',
    zh: '单点登录',
  },
  description: {
    en: 'Manage your single sign-on settings.',
    fr: 'Gérez vos paramètres d\'authentification unique.',
    de: 'Verwalten Sie Ihre Single Sign-On-Einstellungen.',
    es: 'Administre su configuración de inicio de sesión único.',
    zh: '管理您的单点登录设置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>
