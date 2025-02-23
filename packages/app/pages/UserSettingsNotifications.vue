<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsNotifications',
  path: '/settings/notifications',
  middleware: 'redirect-when-guest',
})

// --- Get the session and user data.
const session = useSession()
const user = useUser(session.data.username)

onMounted(async() => {
  await user.getUser()
})
</script>

<template>
  <UserSettings>
    <UserSettingsNotifications @submit="(data) => user.setNotifications(data)" />
  </UserSettings>
</template>
