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
    class="
      flex items-center
      w-full px-2 py-2 rounded text-base
      transition-all duration-100

      opacity-80
      hover:opacity-100

      text-white
      bg-gradient-to-r from-transparent to-transparent
      hover:from-primary-400/30 hover:to-primary-500/5
      current:from-primary-400/20 current:to-primary-500/10
      hover:current:from-primary-400/40 hover:current:to-primary-500/10

      ring-1
      ring-transparent
      hover:ring-primary-400/10
      current:ring-primary-400/20

      font-normal
      current:font-medium
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-6 h-6 shrink-0"
    />

    <!-- Text -->
    <span
      class="transition-opacity duration-300 shrink-1 whitespace-nowrap pl-4"
      :class="{ 'opacity-0': !isOpen }"
      v-text="label"
    />
  </BaseButton>
</template>
