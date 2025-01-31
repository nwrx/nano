<script lang="ts" setup>
const isFocused = ref(false)

function handleGroupClick(event: MouseEvent) {
  const element = event.target as HTMLElement
  const input = element.querySelector('input')
  if (input) input.focus()
}
</script>

<template>
  <div
    class="
      flex items-center transition py-xs group cursor-text
      input input-layout hover:input-layout-hover
    "
    :class="{
      'input-layout-focus': isFocused,
    }"
    @click="(event) => handleGroupClick(event)">

    <!-- Search icon -->
    <BaseIcon
      class="size-6 mr-4 pointer-events-none"
      icon="i-carbon:search"
    />

    <!-- Search box -->
    <input
      type="text"
      placeholder="Search..."
      :class="{ 'input-focus': isFocused }"
      class="w-full outline-none bg-transparent"
      @focus="() => isFocused = true"
      @blur="() => isFocused = false"
    />

    <!-- Keybind -->
    <Keybind
      label="Ctrl + K"
      icon="i-carbon:keyboard"
      class="opacity-0 group-hover:opacity-100 transition pointer-events-none"
    />
  </div>
</template>
