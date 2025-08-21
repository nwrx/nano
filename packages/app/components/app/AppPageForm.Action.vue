<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'
import { vMarkdown } from '@unshared/vue/vMarkdown'

defineProps<BaseButtonProps & {
  title: string
  text: string
  icon?: string
  classButton?: string
}>()

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <div
    class="
      flex items-start md:items-center
      flex-col md:flex-row
      space-y-md md:space-y-0 md:space-x-md
      b-t first:b-t-0 p-md
    ">

    <!-- Title & Description -->
    <div class="grow">
      <h3 class="text-base font-medium">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <p class="text-sm text-subtle">
        <slot name="text">
          <span
            v-markdown.html="text"
            class="markdown"
          />
        </slot>
      </p>
    </div>

    <!-- CTA -->
    <Button
      eager
      :label="label"
      :icon-append="icon"
      :class="classButton"
      class="ml-auto shrink-0"
      @click="() => emit('click')"
    />
  </div>
</template>
