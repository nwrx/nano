<script setup lang="ts">
defineProps<{ name: string; value: string }>()
</script>

<template>
  <div>
    <p class="text-xs text-subtle" v-text="name" />
    <p class="text-sm text-app" v-text="value" />
  </div>
</template>
