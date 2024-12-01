<script setup lang="ts">
defineProps<{
  label?: number | string
  icon?: string
  iconLoad?: boolean
  iconAppend?: string
  iconPrepend?: string
}>()
</script>

<template>
  <BaseBadge class="badge space-x-xs">

    <!-- Prepend -->
    <BaseIcon
      v-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :load="iconLoad"
    />

    <!-- Content -->
    <slot v-if="label || $slots.default">
      <span>
        {{ label }}
      </span>
    </slot>

    <!-- Append -->
    <BaseIcon
      v-if="iconAppend"
      :icon="iconAppend"
      :load="iconLoad"
    />
  </BaseBadge>
</template>
