<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import IconDynamic from '~/components/icon/IconDynamic.vue'

defineProps<{
  group: Editor.ComponentGroup
}>()

const activeGroup = defineModel<string | undefined>()
</script>

<template>
  <!-- Categories -->
  <div
    :class="{
      'op-50': activeGroup !== group.name,
      'op-100': activeGroup === group.name,
    }"
    class="
      w-16 py-3 last:pb-4 first:pt-4
      flex items-center justify-center
      pointer-events-auto
      transition cursor-pointer
    "
    @mouseenter="() => activeGroup = group.name">

    <!-- Icon is by name -->
    <IconDynamic
      :name="group.icon"
      class="size-8"
      load
    />
  </div>
</template>
