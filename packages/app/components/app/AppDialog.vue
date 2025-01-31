<script setup lang="ts">
import type { BaseDialogProps } from '@unshared/vue'

const props = defineProps<{
  title?: string
  text?: string
  icon?: string
  variant?: Variant
  disabled?: boolean
  labelConfirm?: string
  labelCancel?: string
} & BaseDialogProps>()

const { t, locale } = useI18n({ useScope: 'local' })
</script>

<template>
  <Teleport :key="locale" to="#layout" defer>
    <LazyBaseDialog
      v-bind="props"
      title=""
      :class="{
        'backdrop-brightness-50': modelValue,
        'pointer-events-none': !modelValue,
      }"
      class="
        fixed left-0 top-0 z-50 w-full h-full scale-105 bg-transparent
        inline-flex items-center justify-center backdrop:bg-transparent
        transition-all duration-100 dark
      ">

      <!-- Content -->
      <template #dialog="slots">
        <div
          class="
            rounded max-w-xl pointer-events-auto border
             transition-all duration-100 backdrop-blur-lg

            shadow-xl
            light:bg-white/10
            light:text-black
            light:border-light

            dark:shadow-2xl
            dark:border-primary-900
            dark:bg-primary-900
            dark:text-white
          "
          :class="{
            'scale-100 opacity-100 pointer-events-auto': slots.isOpen,
            'scale-95 opacity-0 pointer-events-none': !slots.isOpen,
          }">

          <!-- Title -->
          <AppDialogHeader
            :title="title"
            :isOpen="slots.isOpen"
            @close="() => slots.close()">
            <slot name="title" />
          </AppDialogHeader>

          <!-- Hint -->
          <AppDialogText
            v-if="text || $slots.text"
            :text="text"
            :icon="icon"
            :variant="variant">
            <slot name="text" />
          </AppDialogText>

          <!-- Dialog content -->
          <div class="p-4 w-full">
            <slot v-bind="slots" />
          </div>

          <!-- CTA -->
          <div class="p-4 w-full bg-primary-500/10">
            <slot name="actions" v-bind="slots">
              <AppDialogActions
                :labelCancel="labelCancel ?? t('button.cancel')"
                :labelConfirm="labelConfirm ?? t('button.confirm')"
                :variant="variant"
                :disabled="disabled"
                @close="slots.close"
                @confirm="() => slots.returnValue(true)"
              />
            </slot>
          </div>
        </div>
      </template>
    </LazyBaseDialog>
  </Teleport>
</template>

<i18n lang="yaml">
  en:
    button.cancel: Cancel
    button.confirm: Confirm
  fr:
    button.cancel: Annuler
    button.confirm: Confirmer
  de:
    button.cancel: Abbrechen
    button.confirm: Bestätigen
  es:
    button.cancel: Cancelar
    button.confirm: Confirmar
  zh:
    button.cancel: 取消
    button.confirm: 确认
  </i18n>
