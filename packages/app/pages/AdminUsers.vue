<script setup lang="ts">
definePageMeta({
  name: 'AdminUsers',
  path: '/admin/users',
  middleware: 'redirect-when-guest',
})

const { t } = useI18n()
const users = useUsers({
  withProfile: true,
  withSessions: true,
})

useHead(() => ({
  title: t('title'),
  meta: [
    { hid: 'description', name: 'description', content: t('description') },
  ],
}))

onMounted(async() => {
  await users.refresh()
})
</script>

<template>
  <AppPage>
    <AppPageHeader
      icon="i-carbon:user"
      :title="t('title')"
      :description="t('description')"
    />

    <!-- Toolbar -->
    <AppPageContainer>
      <AdminUsersTable
        :users="users.data.value"
        @submitEnable="(username) => users.enable(username)"
        @submitDelete="(username) => users.delete(username)"
        @submitDisable="(username) => users.disable(username)"
        @submitVerify="(username) => users.verify(username)"
      />
    </AppPageContainer>
  </AppPage>
</template>

<i18n lang="yaml">
  en:
    title: Users
    description: Manage users and their access.
  fr:
    title: Utilisateurs
    description: Gérer les utilisateurs et leur accès.
  de:
    title: Benutzer
    description: Verwalten Sie Benutzer und deren Zugriff.
  es:
    title: Usuarios
    description: Administre los usuarios y su acceso.
  zh:
    title: 用户
    description: 管理用户及其访问权限。
</i18n>
