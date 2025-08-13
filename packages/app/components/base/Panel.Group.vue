<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue/BaseButton'
import type { VNode } from 'vue'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Badge from './Badge.vue'
import Collapse from './Collapse.vue'

defineProps<BaseButtonProps & {
  icon?: string
  badge?: string
  description?: string
  classHeader?: string
  classBadge?: string
}>()

const slots = defineSlots<{
  default?: () => VNode[]
  header?: () => VNode[]
  menu?: () => VNode
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
        hover:bg-subtle
        b b-transparent b-b-app hover:b-active
      "
      :class="[classHeader, { 'bg-emphasized': model }]"
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
      <slot name="header">
        <div class="flex min-w-0 grow flex-row space-x-sm text-start w-full">
          <span v-if="label" class="text-sm font-medium whitespace-nowrap">
            {{ label }}
          </span>

          <!-- Description -->
          <span v-if="description" class="text-sm text-subtle line-clamp-1">
            {{ description }}
          </span>

          <!-- Badge -->
          <template v-if="badge">
            <span class="grow" />
            <Badge class="badge-sm" :class="classBadge">
              {{ badge }}
            </Badge>
          </template>
        </div>
      </slot>

      <!-- Spacer -->
      <div
        v-if="slots.menu"
        class="grow"
      />

      <!-- Actions -->
      <slot name="menu" />
    </BaseButton>

    <!-- Items -->
    <Collapse v-if="slots.default" v-model="model">
      <slot />
    </Collapse>
  </div>
</template>
