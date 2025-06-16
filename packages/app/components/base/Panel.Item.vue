<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue/BaseButton'
import { BaseButton } from '@unshared/vue/BaseButton'

const props = defineProps<BaseButtonProps & {
  icon?: string
  description?: string
}>()

const slots = defineSlots<{
  menu?: []
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    :class="{
      'bg-subtle': isActive,
      'hover:bg-subtle': !isActive,
    }"
    class="
      flex items-center px-md py-sm space-x-sm w-full
      cursor-pointer select-none
      b-b b-app
    ">

    <!-- Icon -->
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

    <!-- Spacer -->
    <div class="grow" />

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
</template>
