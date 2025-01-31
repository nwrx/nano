<script setup lang="ts">
import type { NavItem } from '~/utils/types'
import { NuxtLink } from '#components'

defineProps<{ isOpen?: boolean } & NavItem>()
</script>

<template>
  <BaseButton
    :as="NuxtLink"
    :to="to"
    eager
    :class="{
      'opacity-40': !to,
    }"
    class-active="
      !bg-layout-prominent text-layout-prominent
      border-prominent font-medium"
    class="
      flex items-center w-full p-sm rounded transition
      text-layout-emphasized  hover:text-layout-prominent
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
