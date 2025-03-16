<script setup lang="ts">
defineProps<{
  placeholderName?: string
  placeholderDescription?: string
  isReadonly?: boolean
}>()

const name = defineModel('name', { default: '' })
const description = defineModel('description', { default: '' })
const textarea = ref<HTMLTextAreaElement>()

async function resizeTextarea() {
  const target = textarea.value
  if (!target) return
  await nextTick()
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
}

onMounted(resizeTextarea)
</script>

<template>
  <div class="py-4 px-4">

    <!-- Name -->
    <input
      v-model="name"
      :placeholder="placeholderName"
      :readonly="isReadonly"
      class="text-xl font-medium outline-none bg-transparent w-full">

    <!-- Description -->
    <textarea
      ref="textarea"
      v-model="description"
      :placeholder="placeholderDescription"
      :readonly="isReadonly"
      rows="1"
      :class="{ italic: !description }"
      class="text-sm outline-none bg-transparent w-full resize-none opacity-70 h-auto"
      @input="() => resizeTextarea()"
    />
  </div>
</template>
