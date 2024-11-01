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
  await session.refresh()
  await user.refresh()
})
</script>

<template>
  <UserSettings>
    <UserSettingsPassword @submit="(data) => user.setPassword(data)" />
  </UserSettings>
</template>
