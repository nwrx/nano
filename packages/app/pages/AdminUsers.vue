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
  <AdminSettings>
    <AdminUsers
      :users="users.data.value"
      @submit-enable="(username) => users.enable(username)"
      @submit-delete="(username) => users.delete(username)"
      @submit-disable="(username) => users.disable(username)"
      @submit-verify="(username) => users.verify(username)"
    />
  </AdminSettings>
</template>
