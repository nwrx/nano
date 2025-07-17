<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'

defineProps<{
  title?: string
  text?: string
  icon?: string
}>()
</script>

<template>
  <div
    class="
      b b-app bg-app p-md h-full
      bg-banknote-primary-100
      dark:bg-banknote-primary-900
    ">
    <slot>
      <div
        v-if="title || text"
        class="flex flex-col items-center justify-center h-full p-8">

        <!-- Icon -->
        <div class="bg-app b b-app rd p-8">
          <div class="flex items-center gap-md mb-4">
            <BaseIcon
              :icon="icon"
              class="size-6 text-app"
            />
            <h1 class="text-2xl text-app">
              {{ title }}
            </h1>
          </div>

          <!-- Text -->
          <p class="text-subtle text-sm max-w-md">
            {{ text }}
          </p>
        </div>
      </div>
    </slot>
  </div>
</template>
