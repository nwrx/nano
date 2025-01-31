<script setup lang="ts">
defineProps<{
  name?: string
  content?: string
}>()
</script>

<template>
  <div>
    <div class="text-right text-xs text-emphasized">
      {{ name }}
    </div>
    <div class="px-md py-sm rd bg-prominent max-w-2xl">
      <span> {{ content }} </span>
    </div>
  </div>
</template>
