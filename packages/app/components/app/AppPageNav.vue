<script setup lang="ts">
defineProps<{ groups: NavItem[] }>()
</script>

<template>
  <div
    class="
      flex flex-col w-full max-w-80 h-full rounded gap-2 p-6
      bg-white border border-black/10 shadow-sm
    ">

    <AppPageNavGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
      :items="group.items"
    />
  </div>
</template>
