<script setup lang="ts">
const props = defineProps<{
  name?: string
  description?: string
  placeholderName?: string
  placeholderDescription?: string
  isReadonly?: boolean
}>()

const emit = defineEmits<{
  'update:name': [name: string]
  'update:description': [description: string]
}>()

const name = useVModel(props, 'name', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })
const textarea = ref<HTMLTextAreaElement>()

/**
 * When the description textarea input event is triggered, resize the textarea
 * to fit the content. This will make the textarea grow as the user types.
 *
 * @param event The input event.
 */
function onTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
}

// --- When the component is mounted, resize the textarea to fit the content.
watch(description, async() => {
  if (!textarea.value) return
  await nextTick()
  textarea.value.style.height = 'auto'
  textarea.value.style.height = `${textarea.value.scrollHeight + 2}px`
}, { immediate: true })
</script>

<template>
  <div class="pb-4 px-4">
    <input
      v-model="name"
      :placeholder="placeholderName"
      :readonly="isReadonly"
      class="text-xl font-medium outline-none bg-transparent w-full"
    />
    <textarea
      v-model="description"
      :placeholder="placeholderDescription"
      :readonly="isReadonly"
      class="text-sm outline-none bg-transparent w-full resize-none opacity-70"
      @input="(event) => onTextareaInput(event)"
    />
  </div>
</template>
