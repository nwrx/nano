<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = defineProps<{
  title?: string
  text?: string
  modelValue?: boolean
  classContent?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const content = ref<HTMLDivElement>()
const isOpen = useVModel(props, 'modelValue', emit, {
  passive: true,
})

const styleContent = ref<CSSProperties>({})
function setStyleContent() {
  if (!content.value) return {}
  styleContent.value= {
    maxHeight: isOpen.value ? `${content.value.scrollHeight}px` : '0',
    transitionProperty: 'max-height',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
  }
}

const observer = new MutationObserver(() => {
  if (!content.value) return
  setStyleContent()
})

watch(isOpen, () => {
  setStyleContent()
})

onMounted(() => {
  if (!content.value) return
  setStyleContent()
  observer.observe(content.value, { childList: true, subtree: true })
})
</script>

<template>
  <div
    class="border-t border-black/10
      bg-transparent hover:bg-primary-50/50
      opacity-80 hover:opacity-100
      transition-all duration-100
      group
    ">

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
        <p v-if="text || $slots.text" class="text-xs opacity-60">
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
    <div :style="styleContent" class="overflow-y-clip px-4">
      <div
        ref="content"
        :class="[classContent, isOpen ? 'opacity-100' : 'opacity-0']"
        class="pb-4 pt-px transition-opacity duration-200">
        <slot />
      </div>
    </div>
  </div>
</template>
