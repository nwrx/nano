<script setup lang="ts">
import type { NavItem } from '~/utils/types'
import { NuxtLink } from '#components'

defineProps<{ collapsed?: boolean } & NavItem>()
</script>

<template>
  <li class="w-full">
    <BaseButton
      :as="NuxtLink"
      :to="to"
      eager
      class-active-exact="
        font-bold bg-white
        !ring-primary-600
      "
      class="
        flex items-center
        w-full px-3 py-2 rounded-md
        text-black text-base
        ring-1 ring-transparent
        hover:bg-white
        opacity-80 hover:opacity-100
        transition-all duration-100
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
        :class="{ 'opacity-0': collapsed }"
        v-text="label"
      />
    </BaseButton>
  </li>
</template>
