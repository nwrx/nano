<script setup lang="ts">
import type { NavItem } from '~/utils/types'

defineProps<{
  itemsTop?: NavItem[]
  itemsBottom?: NavItem[]
}>()

const collapsed = ref(false)
</script>

<template>
  <div
    class="flex flex-col bg-primary-100 p-4 transition-all duration-300"
    :class="{
      'w-64': !collapsed,
      'w-20': collapsed,
    }">

    <!-- Collapse switch -->
    <Button
      icon="i-carbon:menu"
      @click="() => { collapsed = !collapsed }"
    />

    <!-- Nav -->
    <AppNavDrawerSection
      v-if="itemsTop"
      :items="itemsTop"
      :collapsed="collapsed"
    />

    <!-- Bottom -->
    <AppNavDrawerSection
      v-if="itemsBottom"
      class="!mt-auto"
      :items="itemsBottom"
      :collapsed="collapsed"
    />
  </div>
</template>
