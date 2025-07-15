<script setup lang="ts">
import MyAvatar from '~/components/my/MyAvatar.vue'
import MyDangerZone from '~/components/my/MyDangerZone.vue'
import MyProfile from '~/components/my/MyProfile.vue'

definePageMeta({
  name: 'UserSettings',
  path: '/settings',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Account',
    fr: 'Compte',
    de: 'Konto',
    es: 'Cuenta',
    zh: '帐户',
  },
  description: {
    en: 'Manage your account settings and enrich your profile.',
    fr: 'Gérez les paramètres de votre compte et enrichissez votre profil.',
    de: 'Verwalten Sie Ihre Kontoeinstellungen und bereichern Sie Ihr Profil.',
    es: 'Administre la configuración de su cuenta y enriquezca su perfil.',
    zh: '管理您的帐户设置并丰富您的个人资料。',
  },
})

const user = useSession()
</script>

<template>
  <AppPageContainer v-if="user.data.username" contained>
    <MyProfile />
    <MyAvatar />
    <MyDangerZone />
  </AppPageContainer>
</template>
