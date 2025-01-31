<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'

defineProps<{
  project: ProjectObject
  selectedFlow?: string
  isSelected?: boolean
}>()

const emit = defineEmits<{
  select: [flow: string]
}>()

const isOpen = ref(true)
</script>

<template>
  <div class="b-app b-b">
    <BaseButton
      eager
      class="
        flex items-center px-md py-sm group w-full
        cursor-pointer transition-colors bg-app hover:bg-subtle select-none
      "
      @click="() => isOpen = !isOpen">

      <!-- Arrow when hover -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': isOpen }"
        class="size-6 op-50 group-hover:op-100 transition shrink-0 mr-sm"
      />

      <!-- Project title -->
      <p class="text-sm font-medium">
        {{ project.title }}
      </p>

      <!-- Selector dot -->
      <BaseIcon
        v-if="isSelected"
        icon="i-carbon:dot-mark"
        class="size-3 text-success shrink-0 ml-auto"
      />
    </BaseButton>

    <!-- Items -->
    <BaseCollapse
      vertical
      :is-open="isOpen"
      :duration="300"
      :class="{ 'op-0 pointer-events-none': isOpen !== true }"
      class="transition-all overflow-hidden">

      <MonitoringItem
        v-for="flow in project.flows"
        :key="flow.name"
        icon="i-carbon:dot-mark"
        :title="flow.title"
        :text="`${project.name}/${flow.name}`"
        :is-selected="flow.name === selectedFlow"
        @click="() => emit('select', flow.name)"
      />
    </BaseCollapse>
  </div>
</template>
