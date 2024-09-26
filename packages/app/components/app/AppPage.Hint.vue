<script setup lang="ts">
const props = defineProps<{
  title?: string
  text?: string
  type?: 'error' | 'info' | 'success' | 'warning'
}>()

const classes = computed(() => {
  const { type = 'info' } = props
  return {
    'bg-primary-50 border-primary-100 text-primary-700': type === 'info',
    'bg-success-50 border-success-200 text-success-700': type === 'success',
    'bg-warning-50 border-warning-200 text-warning-700': type === 'warning',
    'bg-danger-50 border-danger-200 text-danger-700': type === 'error',
  }
})

const icon = computed(() => {
  const { type = 'info' } = props
  if (type === 'info') return 'i-carbon:information-filled'
  if (type === 'success') return 'i-carbon:checkmark-filled'
  if (type === 'warning') return 'i-carbon:warning-filled'
  if (type === 'error') return 'i-carbon:error-filled'
})
</script>

<template>
  <div class="p-4 border rounded" :class="classes">

    <!-- Icon -->
    <div class="flex space-x-2">
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="w-4 h-4 shrink-0 mt-1 opacity-60"
      />

      <!-- Content -->
      <div>
        <h3 class="text-base font-medium opacity-80">
          <slot name="title">{{ title }}</slot>
        </h3>
        <p class="text-sm opacity-60">
          <slot>{{ text }}</slot>
        </p>
      </div>
    </div>
  </div>
</template>
