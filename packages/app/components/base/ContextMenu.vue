<script setup lang="ts">
import type { BaseMenuProps } from '@unshared/vue'

const props = defineProps<{
  modelValue?: boolean
} & BaseMenuProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <BaseMenu
    v-model="model"
    x="right"
    y="below"
    v-bind="$props"
    class="children:z-10">

    <!-- User Image -->
    <template #default="slotProps">
      <BaseButton
        eager
        class="p-2 rounded hover:bg-black/5 transition-all duration-100"
        @click="() => slotProps.toggle()">
        <slot v-bind="slotProps">
          <BaseIcon
            icon="i-carbon:overflow-menu-vertical"
            class="w-6 h-6"
          />
        </slot>
      </BaseButton>
    </template>

    <!-- Menu -->
    <template #menu="slotProps">
      <Transition
        :duration="100"
        enter-active-class="transition ease-out duration-50"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition ease-in duration-50"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0">
        <div
          v-if="slotProps.isOpen"
          :class="{ 'z-9999': slotProps.isOpen }"
          class="p-4 space-y-2 w-64 bg-white border border-black/10 rounded-xl cursor-auto">
          <slot name="menu" v-bind="slotProps"/>
        </div>
      </Transition>
    </template>
  </BaseMenu>
</template>
