<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue/BaseButton'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Keybind from '~/components/base/Keybind.vue'

const props = defineProps<BaseButtonProps & {
  label: string
  icon?: string
  keybind?: string
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    class="
      flex items-center justify-start
      w-full p-sm space-x-md rounded
      text-app hover:text-app-emphasis
      hover:bg-emphasized
      transition
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4"
    />

    <!-- Label -->
    <span class="text-sm text-left truncate grow">
      {{ label }}
    </span>

    <!-- Keybind -->
    <Keybind
      v-if="keybind"
      :label="keybind"
      class="border border-app rounded ml-auto"
    />
  </BaseButton>
</template>
