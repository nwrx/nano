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
      flex gap-x-lg lg:gap-x-xl w-full
      not-first:mt-xl not-first:pt-xl
      not-first:border-t border-app
    ">

    <!-- Title and Text -->
    <div class="w-full" :class="{ 'lg:basis-1/3': !vertical }">
      <h2 class="text-2xl font-medium">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <p class="text-sm text-subtle mt-1">
        <slot name="text">
          {{ text }}
        </slot>
      </p>
    </div>

    <!-- Form -->
    <form
      class="flex items-start flex-col gap-md grow lg:basis-2/3 mt-lg"
      :class="{ 'lg:mt-0': !vertical }"
      @submit.prevent="() => emit('submit')">
      <slot />
      <Button
        v-if="label"
        size="md"
        :label="label"
        icon-prepend="i-carbon:save"
        icon-append="i-carbon:chevron-right"
        icon-expand
        class="button-success self-end mt-2"
        type="submit"
      />
    </form>
  </div>
</template>
