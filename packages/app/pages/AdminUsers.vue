<script setup lang="ts">
definePageMeta({
  name: 'AdminUsers',
  path: '/admin/users',
  middleware: 'redirect-when-guest',
})

const users = useUsers({
  withProfile: true,
  withProtected: true,
})

onMounted(users.getUsers)
</script>

<template>
  <AdminLayout>
    <AdminUsers
      :users="users.users.value"
      @submit-enable="(username) => users.enable(username)"
      @submit-delete="(username) => users.remove(username)"
      @submit-disable="(username) => users.disable(username)"
      @submit-verify="(username) => users.verify(username)"
    />
  </AdminLayout>
</template>
