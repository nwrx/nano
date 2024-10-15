<script setup lang="ts">
const props = defineProps<{
  title?: string
  text?: string
  modelValue?: boolean
  classContent?: string
  fullWidth?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const content = ref<HTMLDivElement>()
const isOpen = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <div class="border-t border-editor transition op-80 hover:op-100">

    <!-- Title & Description -->
    <BaseButton
      v-if="title || text || $slots.title || $slots.text"
      eager
      class="flex items-center justify-between w-full px-4 py-4"
      @click="() => { isOpen = !isOpen }">

      <!-- Left / Title & Text -->
      <div class="flex flex-col items-start text-left">
        <h3 v-if="title || $slots.title" class="text-base font-medium">
          <slot name="title">{{ title }}</slot>
        </h3>
        <p v-if="text || $slots.text" class="text-sm text-subtle">
          <slot name="text">{{ text }}</slot>
        </p>
      </div>

      <!-- Right / State Icon -->
      <BaseIcon
        :icon="isOpen ? 'i-carbon:chevron-down' : 'i-carbon:chevron-up'"
        class="w-6 h-6 shrink-0 ml-2 opacity-0 group-hover:opacity-40 transition-all duration-200"
      />
    </BaseButton>

    <!-- Content -->
    <BaseCollapse
      vertical
      :isOpen="isOpen"
      class="overflow-y-clip transition-all"
      :class="{
        'px-md': !fullWidth,
      }">
      <div
        ref="content"
        :class="[classContent, isOpen ? 'opacity-100' : 'opacity-0']"
        class="py-md pt-0 transition">
        <slot />
      </div>
    </BaseCollapse>
  </div>
</template>
