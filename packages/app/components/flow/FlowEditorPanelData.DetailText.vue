<script setup lang="ts">
import { vMarkdown } from '#imports'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

const asRaw = ref(false)
</script>

<template>
  <!-- Text -->
  <div
    class="
      w-full p-sm max-h-100
      overflow-y-auto overflow-x-hidden
      group
    ">

    <!-- Raw Text -->
    <div
      v-if="asRaw"
      class="font-mono whitespace-break-spaces p-sm text-xs"
      v-text="model"
    />

    <!-- Markdown -->
    <div
      v-else
      v-markdown="model"
      class="markdown p-sm"
    />

    <!-- Switch button -->
    <BaseButton
      v-if="model && model.length > 0"
      eager
      class="
        absolute bottom-sm right-sm
        p-xs text-xs text-white bg-primary-500/50
        rd op-0 group-hover:op-100
      "
      @click="() => asRaw = !asRaw">
      {{ asRaw ? 'Markdown' : 'Raw Text' }}
    </BaseButton>
  </div>
</template>
