<script setup lang="ts">
defineProps<{
  label?: string
  icon?: string
  iconLoad?: boolean
  iconAppend?: string
  iconPrepend?: string
}>()
</script>

<template>
  <BaseBadge class="badge space-x-sm">

    <!-- Prepend -->
    <BaseIcon
      v-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :load="iconLoad"
    />

    <!-- Content -->
    <slot v-if="label">
      <span>{{ label }}</span>
    </slot>

    <!-- Append -->
    <BaseIcon
      v-if="iconAppend"
      :icon="iconAppend"
      :load="iconLoad"
    />
  </BaseBadge>
</template>
