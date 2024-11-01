<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsAccount',
  path: '/settings/account',
  middleware: 'redirect-when-guest',
})

// --- Get the session and user data.
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
  <UserSettings>
    <UserSettingsUsername
      :username="user.data.username"
      :avatar-url="user.data.avatarUrl"
      :display-name="user.data.displayName"
      @submit-rename="(profile) => user.setProfile(profile)"
    />
    <UserSettingsDangerZone
      :username="user.data.username"
      :avatar-url="user.data.avatarUrl"
      :display-name="user.data.displayName"
      @submit="(password) => user.setPassword(password)"
    />
  </UserSettings>
</template>
