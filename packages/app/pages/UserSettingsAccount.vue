<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsAccount',
  path: '/settings/account',
  middleware: 'redirect-when-guest',
})

// --- Get the session and user data.
const session = useSession()
const user = useUser(session.data.username!, {
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
      :avatarUrl="user.data.avatarUrl"
      :displayName="user.data.displayName"
      @submitRename="(profile) => user.setProfile(profile)"
    />
    <UserSettingsDangerZone
      :username="user.data.username"
      :avatarUrl="user.data.avatarUrl"
      :displayName="user.data.displayName"
      @submit="(password) => user.setPassword(password)"
    />
  </UserSettings>
</template>
