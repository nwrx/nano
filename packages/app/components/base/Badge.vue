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
    />

    <!-- Content -->
    <slot>
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
