<script setup lang="ts">
defineProps<{
  username?: string
  displayName?: string
}>()
</script>

<template>
  <div class="flex items-center p-sm space-x-md text-start font-normal">
    <UserAvatar
      :username="username"
      class="size-12 rounded-full"
    />
    <div>
      <p class="font-medium" v-text="displayName" />
      <p class="text-sm" v-text="username" />
    </div>
  </div>
</template>
