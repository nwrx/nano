<script setup lang="ts">
import type { NavItem } from '~/utils/types'

defineProps<{ isOpen?: boolean } & NavItem>()
</script>

<template>
  <BaseButton
    :to="to"
    eager
    :class="{
      'cursor-pointer': to,
    }"
    class-active="
      !bg-layout-prominent text-layout-prominent font-medium
    "
    class="
      flex items-center w-full p-sm rounded
      text-layout-emphasized  hover:text-layout
      border border-transparent hover:border-prominent
      bg-layout hover:bg-layout-prominent
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-6 shrink-0"
    />

    <!-- Text -->
    <span
      class="transition shrink-1 whitespace-nowrap pl-md"
      :class="{ 'opacity-0': !isOpen }"
      v-text="label"
    />
  </BaseButton>
</template>
