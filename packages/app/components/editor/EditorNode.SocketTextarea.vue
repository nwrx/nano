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
  <EditorNodeSocketGroup class="relative" @click="() => textarea?.focus()">

    <!-- Label -->
    <EditorNodeSocketLabel
      :class="{ 'opacity-0': model }"
      class="absolute self-start pointer-events-none"
      :label="name"
    />

    <textarea
      ref="textarea"
      v-model="model"
      :placeholder="typeof defaultValue === 'string' ? defaultValue : undefined"
      autocapitalize="sentences"
      autocomplete="off"
      spellcheck="false"
      rows="1"
      class="
        w-full text-start outline-none p-sm
        bg-transparent appearance-none rd max-h-32 resize-none
        transition text-sm whitespace-pre-wrap
        text-editor-node font-mono
      "
      @input="(event) => onTextAreaInput(event)"
      @wheel.stop
    />
  </EditorNodeSocketGroup>
</template>
