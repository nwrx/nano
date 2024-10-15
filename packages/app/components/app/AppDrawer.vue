<script setup lang="ts">
import type { NavItem } from '~/utils/types'

const props = defineProps<{
  modelValue?: boolean
  itemsTop?: NavItem[]
  itemsBottom?: NavItem[]
  isHidden?: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
}>()

const isOpen = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: true,
})
</script>

<template>
  <div
    class="flex flex-col px-4 transition-all overflow-x-hidden pt-md"
    :class="{
      'w-64': isOpen,
      'w-18': !isOpen,
      'w-8 -translate-x-4 !px-0 opacity-0': isHidden,
    }">

    <!-- Collapse switch -->
    <AppDrawerItem
      :icon="!isOpen ? 'i-carbon:side-panel-open' : 'i-carbon:side-panel-close-filled'"
      class="flex justify-between items-center sticky top-0 w-full px-2 rounded z-10"
      @click="() => { isOpen = !isOpen }"
    />

    <!-- Spacer -->
    <div class="h-12" />

    <!-- Nav -->
    <AppDrawerSection
      v-if="itemsTop"
      :items="itemsTop"
      :isOpen="isOpen"
    />

    <!-- Bottom -->
    <AppDrawerSection
      v-if="itemsBottom"
      class="!mt-auto"
      :items="itemsBottom"
      :isOpen="isOpen"
    />
  </div>
</template>
