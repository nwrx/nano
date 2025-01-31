<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
  vertical?: boolean
  label?: string
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <div
    :class="{
      'flex-col': vertical,
      'flex-col lg:flex-row': !vertical,
    }"
    class="
      flex gap-x-8 sm:gap-x-16 w-full
      not-first:mt-16
      not-first:pt-16
      not-first:border-t
      border-app
    ">

    <!-- Title and Text -->
    <div class="w-full" :class="{ 'lg:w-2/5 min-w-96': !vertical }">
      <h2 class="text-2xl font-medium">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p class="text-sm opacity-60 mt-1">
        <slot name="text">{{ text }}</slot>
      </p>
    </div>

    <!-- Form -->
    <form
      class="flex items-start flex-col gap-4 grow w-full mt-8"
      :class="{ 'lg:mt-0': !vertical }"
      @submit.prevent="() => emit('submit')">
      <slot/>
      <Button
        v-if="label"
        size="md"
        filled
        variant="success"
        :label="label"
        icon-prepend="i-carbon:save"
        icon-append="i-carbon:chevron-right"
        icon-expand
        class="self-end mt-2"
        type="submit"
      />
    </form>
  </div>
</template>
