<script setup lang="ts">
definePageMeta({
  name: 'UserSettings',
  path: '/settings/profile',
  alias: '/settings',
  middleware: ['redirect-when-guest'],
  layout: 'user',
})

// --- Get the session and user data.
const session = useSession()
const user = useUser(session.username, {
  withProfile: true,
})

onMounted(async() => {
  await session.refresh()
  await user.refresh()
})
</script>

<template>
  <UserSettingsProfile
    v-if="user.data"
    :displayName="user.data.displayName"
    :biography="user.data.biography"
    :website="user.data.website"
    :company="user.data.company"
    class="grow"
    @submit="(profile) => user.setProfile(profile)"
  />
</template>
