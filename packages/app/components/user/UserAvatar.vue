<script setup lang="ts">
const props = defineProps<{
  username?: string
}>()

// --- Computed avatar URL based on username and API URL.
const avatarUrl = computed(() => {
  if (!props.username) return
  const apiUrl = useRuntimeConfig().public.apiUrl
  const avatarUrl = `/api/users/${props.username}/avatar`
  return apiUrl ? new URL(avatarUrl, apiUrl).href : avatarUrl
})
</script>

<template>
  <img :src="avatarUrl">
</template>
