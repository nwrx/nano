<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsProfile',
  path: '/settings/profile',
  alias: '/settings',
  middleware: 'redirect-when-guest',
})

// --- Get the session and user data.
const { t } = useI18n()
useHead(() => ({
  title: t('title'),
  meta: [{ name: 'description', content: t('description') }],
}))

const session = useSession()
const user = useUser(session.data.username, {
  withProfile: true,
})

onMounted(async() => {
  await session.refresh()
  await user.refresh()
})
</script>

<template>
  <AppPage>

    <!-- Header -->
    <AppPageHeader
      icon="i-carbon:user"
      :title="[user.data.displayName, t('title')]"
      :description="t('description')"
    />

    <!-- Side menu -->
    <UserSettings>
      <UserSettingsInformations
        :display-name="user.data.displayName"
        :biography="user.data.biography"
        :website="user.data.website"
        :company="user.data.company"
        @submit="(profile) => user.setProfile(profile)"
      />
      <UserSettingsAvatar
        :avatar-url="`/api/users/${user.data.username}/avatar`"
        @submit="(avatar) => user.setAvatar({ avatar })"
      />
    </UserSettings>
  </AppPage>
</template>

<i18n lang="yaml">
en:
  title: Profile Settings
  description: Manage and review your account settings and security configurations.
fr:
  title: Paramètres de profil
  description: Gérez et consultez vos paramètres de compte et configurations de sécurité.
de:
  title: Profil-Einstellungen
  description: Verwalten und überprüfen Sie Ihre Kontoeinstellungen und Sicherheitskonfigurationen.
es:
  title: Configuración de perfil
  description: Administre y revise la configuración de su cuenta y las configuraciones de seguridad.
zh:
  title: 个人资料设置
  description: 管理和查看您的帐户设置和安全配置。
</i18n>
