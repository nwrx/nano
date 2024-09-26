<script setup lang="ts">
definePageMeta({
  name: 'User',
  path: '/:username/profile',
  middleware: ['protected'],
})
</script>

<template>
  <AppPage class="flex flex-col overflow-hidden w-full space-y-8">
  </AppPage>
</template>
