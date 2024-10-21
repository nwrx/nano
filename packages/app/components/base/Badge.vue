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
  <BaseBadge class="badge">

    <!-- Prepend -->
    <BaseIcon
      v-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :load="iconLoad"
      class="size-4 last:mr-sm"
    />

    <!-- Content -->
    <slot v-if="label || $slots.default">
      {{ label }}
    </slot>

    <!-- Append -->
    <BaseIcon
      v-if="iconAppend"
      :icon="iconAppend"
      :load="iconLoad"
      class="size-4 first:ml-sm"
    />
  </BaseBadge>
</template>
