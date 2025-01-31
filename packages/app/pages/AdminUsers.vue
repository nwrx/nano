<script setup lang="ts">
definePageMeta({
  name: 'AdminUsers',
  path: '/admin/users',
  middleware: 'redirect-when-guest',
})

const users = useUsers({
  withProfile: true,
  withSessions: true,
})

onMounted(async() => {
  await users.refresh()
})
</script>

<template>
  <AppPage>
    <AppPageHeader
      icon="i-carbon:user"
      title="Users"
      description="Manage users, their settings, and permissions."
    />

    <!-- Toolbar -->
    <AppPageContainer class="grow pt-32">
      <AdminUsersTable
        :users="users.data.value"
        @submitEnable="(username) => users.enable(username)"
        @submitDelete="(username) => users.delete(username)"
        @submitDisable="(username) => users.disable(username)"
      />
    </AppPageContainer>
  </AppPage>
</template>
