<script setup lang="ts">
const props = defineProps<{
  name: string
  modelValue: string
  defaultValue?: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})

// --- On input on the text area element, automatically resize the height.
const textarea = ref<HTMLTextAreaElement>()
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
  <FlowEditorPortGroup class="relative" @click="() => textarea?.focus()">

    <!-- Label -->
    <FlowEditorPortLabel
      class="absolute self-start"
      :label="name"
    />

    <textarea
      ref="textarea"
      v-model="model"
      :placeholder="typeof defaultValue === 'string' ? defaultValue : undefined"
      autocapitalize="sentences"
      autocomplete="off"
      spellcheck="false"
      wrap="hard"
      rows="1"
      :style="{
        'text-indent': '5rem',
      }"
      :class="{
        'font-mono': model,
      }"
      class="
      w-full text-start outline-none py-1
      bg-transparent appearance-none rounded max-h-128 resize-none
      transition-all duration-100 text-sm
      text-black/70 placeholder-black/50
    "
      @input="(event) => onTextAreaInput(event)"
    />
  </FlowEditorPortGroup>
</template>
