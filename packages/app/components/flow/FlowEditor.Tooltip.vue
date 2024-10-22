<script setup lang="ts">
const isOpen = ref(false)
const isOpenDebounced = refDebounced(isOpen, 200)

function handleClick(event: MouseEvent) {
  if (event.button !== 0) return
  event.stopPropagation()
}
</script>

<template>
  <BaseMenu
    x="left"
    y="above"
    class-menu="cursor-auto select-text"
    @mouseenter="() => isOpen = true"
    @mouseleave="() => isOpen = false">

    <!-- Trigger -->
    <template v-slot="slotProps">
      <slot v-bind="slotProps" />
    </template>

    <!-- Content -->
    <template #menu>
      <Transition>
        <div
          v-if="isOpenDebounced"
          class="rd bg-editor-panel b b-editor backdrop-blur-2xl"
          @mousedown="(event: MouseEvent) => handleClick(event)">
          <slot name="tooltip" />
        </div>
      </Transition>
    </template>
  </BaseMenu>
</template>
