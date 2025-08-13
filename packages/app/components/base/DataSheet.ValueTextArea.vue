<script setup lang="ts">
defineProps<{
  placeholder?: string
}>()

const { t } = useI18n()
const model = defineModel<string>()
const element = ref<HTMLTextAreaElement>()

// --- Compute the rows based on the content length.
function computeHeight() {
  if (!element.value) return
  element.value.style.height = 'auto'
  const scrollHeight = element.value.scrollHeight
  const maxHeight = 200
  if (scrollHeight > maxHeight) {
    element.value.style.height = `${maxHeight}px`
    element.value.style.overflowY = 'auto'
  }
  else {
    element.value.style.height = `${scrollHeight}px`
    element.value.style.overflowY = 'hidden'
  }
}

onMounted(() => {
  if (!element.value) return
  element.value.style.height = 'auto'
  element.value.style.overflowY = 'hidden'
  computeHeight()
})
</script>

<template>
  <textarea
    ref="element"
    v-model="model"
    :placeholder="placeholder ?? t('placeholder')"
    :rows="1"
    class="
      px-sm py-sm line-clamp-1 font-mono outline-none
      transition grow bg-transparent w-full h-full resize-none
    "
    @change="() => computeHeight()"
    @input="() => computeHeight()"
    @focus="() => computeHeight()"
    @blur="() => computeHeight()"
    @cut="() => computeHeight()"
    @paste="() => computeHeight()"
    @keydown="() => computeHeight()"
  />
</template>
