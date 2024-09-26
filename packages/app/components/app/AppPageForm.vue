<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-16 w-full">

    <!-- Title and Text -->
    <div class="sm:border-r border-black/0 sm:pr-16 col-span-2">
      <h2 class="text-2xl font-medium">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p class="text-base text-black/70 mt-4">
        <slot name="text">{{ text }}</slot>
      </p>
    </div>

    <!-- Form -->
    <form class="flex items-start flex-col gap-4 col-span-3" @submit.prevent="() => emit('submit')">
      <slot/>
      <Button
        v-if="submitLabel"
        size="md"
        filled
        variant="light"
        :label="submitLabel"
        icon-append="i-carbon:chevron-right"
        icon-expand
        class="self-end"
        type="submit"
      />
    </form>
  </div>
</template>
