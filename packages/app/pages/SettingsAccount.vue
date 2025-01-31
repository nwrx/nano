<script setup lang="ts">
definePageMeta({
  name: 'SettingsAccount',
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
    <UserSettingsUsername @submitRename="(profile) => user.setProfile(profile)"/>
    <AppPageDivider />
    <UserSettingsEmail @submit="(email) => user.setEmail(email)"/>
    <AppPageDivider />
    <UserSettingsDangerZone @submitDelete="() => user.delete()"/>
  </UserSettings>
</template>
