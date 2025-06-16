<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue/BaseButton'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Collapse from './Collapse.vue'
import ContextMenu from './ContextMenu.vue'

defineProps<BaseButtonProps & {
  icon?: string
  description?: string
}>()

const slots = defineSlots<{
  default?: []
  menu?: []
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
        cursor-pointer select-none
        bg-app hover:bg-subtle
      "
      :class="{ 'bg-emphasized': model }"
      @click="() => model = !model">

      <!-- Arrow/Toggle Icon -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': model }"
        class="size-5 op-50 group-hover:op-100 transition shrink-0 mr-sm"
      />

      <!-- Group Icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="size-5 text-prominent shrink-0 mr-sm"
      />

      <!-- Title -->
      <div class="flex min-w-0 grow flex-row space-x-sm">
        <p class="text-sm line-clamp-1 text-start font-medium">
          {{ label }}
        </p>

        <!-- Description -->
        <p v-if="description" class="text-sm text-subtle line-clamp-1 text-start">
          {{ description }}
        </p>
      </div>

      <!-- Actions -->
      <div v-if="slots.menu" class="flex items-center space-x-xs">
        <ContextMenu x="left" y="above">
          <template #default="{ open }">
            <BaseIcon
              icon="i-carbon:overflow-menu-vertical"
              class="size-5 hover:text-prominent transition"
              @click.stop="() => open()"
            />
          </template>
          <template #menu>
            <slot name="menu" />
          </template>
        </ContextMenu>
      </div>
    </BaseButton>

    <!-- Items -->
    <Collapse v-model="model">
      <slot />
    </Collapse>
  </div>
</template>
