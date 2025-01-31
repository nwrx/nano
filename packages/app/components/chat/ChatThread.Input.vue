<script setup lang="ts">
const emit = defineEmits<{
  'sendMessage': [string]
}>()

const value = ref<string>('')

function onTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
}

function submit() {
  emit('sendMessage', value.value)
  value.value = ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey) return
  event.preventDefault()
  submit()
}
</script>

<template>
  <div class="bg-subtle w-full max-w-thread mx-auto rd b b-app">
    <textarea
      v-model="value"
      rows="1"
      class="bg-transparent w-full p-md outline-none max-h-100 resize-none"
      placeholder="Type a message..."
      @input="(event) => onTextareaInput(event)"
      @keydown="(event) => onKeydown(event)"
    />

    <!-- Interaction -->
    <div class="flex items-center space-x-md p-md pt-0">
      <ChatThreadFab icon="i-carbon:attachment" />

      <div class="grow" />

      <!-- Submit -->
      <ChatThreadFab
        icon="i-carbon:send"
        @click="() => submit()"
      />
    </div>
  </div>
</template>
