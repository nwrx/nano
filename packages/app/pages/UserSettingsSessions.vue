<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsSessions',
  path: '/settings/sessions',
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
    <UserSettingsSessions
      :sessions="user.data.sessions"
      @submit="(profile) => user.setProfile(profile)"
    />
    <UserSettingsSessionsSignout
      :sessions-length="user.data.sessions?.length ?? 0"
      @submit-signout="() => session.signout()"
    />
  </UserSettings>
</template>
