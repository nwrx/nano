<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const props = defineProps<{
  username?: string
  displayName?: string
  load?: boolean
}>()

const client = useClient()
const data = ref<UserObject>({} as UserObject)

// --- If `load` is true, load the user profile data from the API
watch(() => props.username, async() => {
  if (!props.load || !props.username) return
  await client.requestAttempt('GET /users/:username', {
    data: {
      username: props.username,
      withProfile: true,
    },
    onData: (user) => {
      data.value = user
    },
  })
}, { immediate: true })
</script>

<template>
  <div class="flex items-center p-sm space-x-md text-start font-normal">
    <UserAvatar
      :username="username"
      class="size-12 rounded-full"
    />
    <div>
      <p class="font-medium" v-text="displayName ?? data.displayName" />
      <p class="text-sm" v-text="username" />
    </div>
  </div>
</template>
