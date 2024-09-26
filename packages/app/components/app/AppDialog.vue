<script setup lang="ts">
import type { BaseDialogProps } from '@unshared/vue'

const props = defineProps<{
  title?: string
  text?: string
} & BaseDialogProps>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <Teleport to="#app" defer>
    <LazyBaseDialog
      v-bind="props"
      :class="{
        'backdrop-contrast-80': props.modelValue,
        'pointer-events-none': !props.modelValue,
      }"
      class="
          fixed left-0 top-0 z-50 w-full h-full scale-105 bg-transparent
          inline-flex items-center justify-center backdrop:bg-transparent
          transition-all duration-200 p-0
        ">

      <!-- Content -->
      <template #dialog="slots">
        <div

          class="
              rounded max-w-xl pointer-events-auto
              bg-white dark:bg-primary-900
              border border-primary-500/20 shadow-2xl shadow-black/10
              transition-all duration-200
            "
          :class="{
            'scale-100 opacity-100 pointer-events-auto': slots.isOpen,
            'scale-95 opacity-0 pointer-events-none': !slots.isOpen,
          }">

          <!-- Title -->
          <div class="flex items-start justify-between border-b border-black/10 p-4">
            <div class="-space-y-1">
              <h2 class="text-base font-medium">
                <slot name="title">{{ props.title }}</slot>
              </h2>
              <p class="text-sm opacity-60">
                <slot name="text">{{ props.text }}</slot>
              </p>
            </div>
            <Button
              eager
              light
              variant="primary"
              icon="i-carbon:close"
              class="!p-1"
              @click="() => slots.close()"
            />
          </div>

          <!-- Dialog content -->
          <div class="p-8 w-full" v-bind="$attrs">
            <slot v-bind="slots" />
          </div>

          <!-- CTA -->
          <div v-if="$slots.cta" class="p-4 w-full bg-black/5">
            <slot name="cta" v-bind="slots" />
          </div>
        </div>
      </template>
    </LazyBaseDialog>
  </Teleport>
</template>
