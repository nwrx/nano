<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsSessions',
  path: '/settings/sessions',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-security',
  icon: 'i-carbon:mobile-session',
  title: {
    en: 'Sessions',
    fr: 'Sessions',
    de: 'Sitzungen',
    es: 'Sesiones',
    zh: '会话',
  },
  description: {
    en: 'Manage your active sessions and secure your account.',
    fr: 'Gérez vos sessions actives et sécurisez votre compte.',
    de: 'Verwalten Sie Ihre aktiven Sitzungen und sichern Sie Ihr Konto.',
    es: 'Administre sus sesiones activas y asegure su cuenta.',
    zh: '管理您的活动会话并保护您的帐户。',
  },
})

// --- Get the session and user data.
const session = useSession()
const user = useUser(session.data.username)

onMounted(async() => {
  await session.getSession()
  await user.getUser()
})
</script>

<template>
  <AppPageContainer contained />
</template>
