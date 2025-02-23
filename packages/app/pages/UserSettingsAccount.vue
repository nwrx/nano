<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsAccount',
  path: '/settings',
  alias: '/settings/account',
  middleware: 'redirect-when-guest',
})

const user = useSession()
const { setAvatar, setProfile, setUsername } = useUser(user.data.username)

onMounted(async() => {
  await user.getSession()
})
</script>

<template>
  <UserSettings>
    <UserSettingsAvatar
      :avatar-url="`/api/users/${user.data.username}/avatar`"
      @submit="(avatar) => setAvatar({ file: avatar })"
    />
    <UserSettingsInformations
      :username="user.data.username"
      :display-name="user.data.displayName"
      :biography="user.data.biography"
      :website="user.data.website"
      :company="user.data.company"
      @submit="(profile) => setProfile(profile)"
    />
    <UserSettingsDangerZone
      :username="user.data.username"
      :display-name="user.data.displayName"
      @submit-username="(newUsername) => setUsername(newUsername)"
      @submit-delete="() => $router.push('/logout')"
    />
  </UserSettings>
</template>
