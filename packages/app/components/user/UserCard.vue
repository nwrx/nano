<script setup lang="ts">
defineProps<{
  avatarUrl: string
  displayName: string
  username: string
}>()
</script>

<template>
  <div class="flex items-center p-sm space-x-md text-start font-normal">
    <img :src="avatarUrl" class="size-12 rounded-full">
    <div>
      <p class="font-medium">
        {{ displayName }}
      </p>
      <p class="text-sm">
        {{ username }}
      </p>
    </div>
  </div>
</template>
