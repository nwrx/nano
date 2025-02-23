<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsPassword',
  path: '/settings/password',
  middleware: 'redirect-when-guest',
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
  <UserSettings>
    <UserSettingsPassword
      @submit="(oldPassword, newPassword, newPasswordConfirm) => user.setPassword({
        oldPassword,
        newPassword,
        newPasswordConfirm,
      })"
    />
  </UserSettings>
</template>
