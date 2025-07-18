<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue/BaseButton'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Collapse from './Collapse.vue'

defineProps<BaseButtonProps & {
  icon?: string
  description?: string
  classButton?: string
}>()

const model = defineModel({ default: false })
</script>

<template>
  <div>

    <!-- Header -->
    <BaseButton
      eager
      class="
        flex items-center px-md py-sm group w-full b-b b-app
        cursor-pointer select-none space-x-sm
        bg-app hover:bg-subtle
        b b-transparent b-b-app hover:b-active
      "
      :class="[classButton, { 'bg-emphasized': model }]"
      @click="() => model = !model">

      <!-- Arrow/Toggle Icon -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': model }"
        class="size-5 op-50 group-hover:op-100 transition shrink-0"
      />

      <!-- Group Icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="size-5 text-prominent shrink-0"
      />

      <!-- Title -->
      <div class="flex min-w-0 grow flex-row space-x-sm text-start">
        <span v-if="label" class="text-sm font-medium whitespace-nowrap">
          {{ label }}
        </span>

        <!-- Description -->
        <span v-if="description" class="text-sm text-subtle line-clamp-1">
          {{ description }}
        </span>
      </div>

      <!-- Spacer -->
      <div class="grow" />

      <!-- Actions -->
      <slot name="menu" />
    </BaseButton>

    <!-- Items -->
    <Collapse v-model="model">
      <slot />
    </Collapse>
  </div>
</template>
