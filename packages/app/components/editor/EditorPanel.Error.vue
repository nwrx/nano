<script setup lang="ts">
defineProps<{
  message?: string
  code?: string
}>()
</script>

<template>
  <div class="flex flex-col items-start hint hint-danger p-md b-x-0 rd-0">

    <!-- Code -->
    <Badge
      v-if="code"
      :label="code"
      class="badge-sm badge-danger mb-xs font-mono"
    />

    <!-- Error -->
    <span class="text-sm">
      <slot>
        {{ message }}
      </slot>
    </span>
  </div>
</template>
