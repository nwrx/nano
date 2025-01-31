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
  await session.refresh()
  await user.refresh()
})
</script>

<template>
  <UserSettings>
    <UserSettingsNotifications @submit="(data) => user.setNotifications(data)" />
  </UserSettings>
</template>
