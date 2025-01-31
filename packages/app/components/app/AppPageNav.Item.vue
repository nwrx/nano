<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  icon?: string
  label?: string
  to?: RouteLocationRaw
}>()
</script>

<template>
  <BaseButton
    eager
    :to="to"
    :label="label"
    class-active="font-medium !bg-prominent !text-prominent"
    class="
      flex items-center gap-sm px-md py-sm rd
      bg-transparent hover:bg-emphasized
      text-app hover:text-app
    ">

    <!-- Icon -->
    <BaseIcon v-if="icon" :icon="icon" />

    <!-- Label -->
    <span>{{ label }}</span>

  </BaseButton>
</template>
