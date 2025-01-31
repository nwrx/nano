<script setup lang="ts">
definePageMeta({
  name: 'SettingsProfile',
  path: '/settings/profile',
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
    <UserSettingsInformations
      :displayName="user.data.displayName"
      :biography="user.data.biography"
      :website="user.data.website"
      :company="user.data.company"
      @submit="(profile) => user.setProfile(profile)"
    />
    <AppPageDivider />
    <UserSettingsAvatar
      :avatarUrl="`/api/users/${user.data.username}/avatar`"
      @submit="(avatar) => user.setAvatar({ avatar })"
    />
  </UserSettings>
</template>
