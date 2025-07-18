<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseMenuProps } from '@unshared/vue/BaseMenu'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { BaseMenu } from '@unshared/vue/BaseMenu'

const props = defineProps<BaseMenuProps & {
  compact?: boolean
}>()
const model = defineModel({ default: false })
</script>

<template>
  <BaseMenu
    v-bind="props"
    v-model="model"
    :x="props.x ?? 'right'"
    :y="props.y ?? 'below'"
    class="children:z-10">

    <!-- User Image -->
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <BaseButton
          eager
          class="p-sm rounded hover:bg-prominent transition"
          @click="() => slotProps.toggle()">
          <BaseIcon
            icon="i-carbon:overflow-menu-vertical"
            :class="compact ? 'size-4' : 'size-6'"
          />
        </BaseButton>
      </slot>
    </template>

    <!-- Menu -->
    <template #menu="slotProps">
      <Transition
        :duration="100"
        leave-active-class="transition"
        enter-active-class="transition"
        enter-from-class="-translate-y-2 op-0"
        enter-to-class="translate-y-0 op-100"
        leave-from-class="translate-y-0 op-100"
        leave-to-class="-translate-y-2 op-0">
        <div
          v-if="slotProps.isOpen"
          :class="{ 'z-1000': slotProps.isOpen }"
          class="p-md space-y-sm w-full min-w-48 bg-app border border-app rounded cursor-auto overflow-hidden">
          <slot name="menu" v-bind="slotProps" />
        </div>
      </Transition>
    </template>
  </BaseMenu>
</template>
