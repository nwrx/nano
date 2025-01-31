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
  <BaseBadge class="badge space-x-xs">

    <!-- Prepend -->
    <BaseIcon
      v-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :load="iconLoad"
      class="size-4"
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
      class="size-4"
    />
  </BaseBadge>
</template>
