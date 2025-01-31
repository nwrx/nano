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
      <slot v-bind="slotProps">
        <BaseButton
          eager
          class="p-sm rounded hover:bg-prominent transition"
          @click="() => slotProps.toggle()">
          <BaseIcon
            icon="i-carbon:overflow-menu-vertical"
            class="size-6"
          />
        </BaseButton>
      </slot>
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
          class="p-md space-y-sm w-full min-w-48 bg-app border border-app rounded cursor-auto">
          <slot name="menu" v-bind="slotProps"/>
        </div>
      </Transition>
    </template>
  </BaseMenu>
</template>
