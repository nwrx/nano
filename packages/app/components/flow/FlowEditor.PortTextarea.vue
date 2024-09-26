<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  name: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})

const textarea = ref<HTMLTextAreaElement>()

// --- On input on the text area element, automatically resize the height.
function onTextAreaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
}

// --- On mounted, set the height of the text area to the scroll height.
onMounted(() => {
  if (!textarea.value) return
  const target = textarea.value
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
})
</script>

<template>
  <textarea
    ref="textarea"
    v-model="model"
    :placeholder="name"
    autocapitalize="sentences"
    autocomplete="off"
    spellcheck="false"
    wrap="hard"
    rows="1"
    :class="{ 'font-mono': model }"
    class="
      w-full text-start px-2 py-1 outline-none
      bg-transparent  border
      appearance-none rounded max-h-128 resize-none
      transition-all duration-100

      hover:bg-white
      focus:bg-white

      border-transparent
      focus:border-primary-500

      text-black/70
      placeholder-black/50

    "
    @input="(event) => onTextAreaInput(event)"
  />
</template>
