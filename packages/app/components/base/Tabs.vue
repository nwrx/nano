<script setup lang="ts">
const props = defineProps<{
  vertical?: boolean
}>()
</script>

<template>
  <div
    role="tablist"
    class="
      w-full bg-subtle
      b b-app p-sm rd
    "
    :class="{
      'flex flex-col space-y-sm': props.vertical,
      'flex flex-row space-x-sm': !props.vertical,
    }">
    <slot />
  </div>
</template>
