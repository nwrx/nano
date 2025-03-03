<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
interface RadioOption {
  label: string
  icon?: string
  value: string
  hint?: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue: boolean
  initialValue?: any
  options: RadioOption[]
  columns?: number
}>()

const emit = defineEmits<{
  'submit': [value: string]
  'update:modelValue': [boolean]
}>()

const isOpen = useVModel(props, 'modelValue', emit)
const columns = computed(() => props.columns ?? 3)

function handleSelect(value: string) {
  emit('submit', value)
  emit('update:modelValue', false)
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    class-container="max-w-3xl">

    <template #container>
      <div class="grid overflow-hidden" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
        <div
          v-for="option in options"
          :key="option.value"
          class="
            flex flex-col items-center justify-center w-full cursor-pointer
            aspect-square b-r b-b b-app p-lg text-center
            hover:bg-subtle
          "
          @mousedown.left="() => handleSelect(option.value)">

          <!-- Icon -->
          <BaseIcon
            v-if="option.icon"
            :icon="option.icon"
            class="size-12 mb-lg"
          />

          <!-- Label -->
          <div class="text-lg">
            {{ option.label }}
          </div>

          <!-- Hint -->
          <div v-if="option.hint" class="text-sm text-subtle">
            {{ option.hint }}
          </div>
        </div>
      </div>
    </template>
  </AppDialog>
</template>
