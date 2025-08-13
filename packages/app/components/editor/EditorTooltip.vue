<script setup lang="ts">
const isOpen = ref(false)
const delay = computed(() => (isOpen.value ? 500 : 0))
const isOpenDebounced = refDebounced(isOpen, delay)

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
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>

    <!-- Content -->
    <template #menu>
      <Transition
        enter-active-class="transition"
        enter-from-class="op-0 scale-98"
        enter-to-class="op-100"
        leave-active-class="transition"
        leave-from-class="op-100"
        leave-to-class="op-0 scale-98">
        <div
          v-if="isOpenDebounced"
          class="rd bg-editor-panel b b-app backdrop-blur-2xl z-1000"
          @mousedown="(event: MouseEvent) => handleClick(event)">
          <slot name="tooltip" />
        </div>
      </Transition>
    </template>
  </BaseMenu>
</template>
