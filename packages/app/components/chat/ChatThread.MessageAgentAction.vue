<script setup lang="ts">
import { vMarkdown } from '@unshared/vue/vMarkdown'

const props = defineProps<{
  name?: string
  actions?: Array<{
    title: string
    text: string
    state: 'DONE' | 'ERROR' | 'PROCESSING'
  }>
}>()

function getActionIcon(action: { state: string }) {
  if (action.state === 'DONE') return 'i-carbon:checkmark'
  if (action.state === 'ERROR') return 'i-carbon:error-filled'
  return 'i-line-md:loading-loop'
}

function getActionIconClass(action: { state: string }) {
  if (action.state === 'DONE') return 'text-success'
  if (action.state === 'ERROR') return 'text-danger'
  return 'text-app'
}

const isOpen = ref(false)
</script>

<template>
  <div class="rd w-2xl b b-app bg-subtle">

    <!-- Action -->
    <BaseButton
      eager
      class="flex items-center w-full px-md py-sm cursor-pointer rd-t"
      @click="() => isOpen = !isOpen">

      <!-- Action name -->
      <div class="grow text-start font-bold text-sm">
        {{ name }}
      </div>

      <!-- Open icon -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        class="text-lg transform transition-transform"
        :class="{ 'transform rotate-180': isOpen }"
      />
    </BaseButton>

    <!-- Summary & State icons -->
    <BaseCollapse
      vertical
      :is-open="isOpen"
      class="overflow-hidden transition-all rd-b">

      <!-- Actions -->
      <div class="w-full space-y-md py-md px-md b-t b-app">
        <div
          v-for="action in actions"
          :key="action.title"
          class="flex items-start space-x-sm">

          <!-- Action state icon -->
          <BaseIcon
            class="size-6"
            :icon="getActionIcon(action)"
            :class="getActionIconClass(action)"
          />

          <!-- Action text -->
          <div class="w-full">
            <div class="text-sm">
              {{ action.title }}
            </div>
            <div
              v-if="action.text"
              v-markdown="action.text"
              class="text-sm text-subtle bg-app w-full p-sm mt-sm rd b b-app"
            />
          </div>
        </div>
      </div>
    </BaseCollapse>
  </div>
</template>
