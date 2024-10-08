<i18n lang="yaml">
en:
  cancel: Cancel
  confirm: Confirm
fr:
  cancel: Annuler
  confirm: Confirmer
de:
  cancel: Abbrechen
  confirm: Bestätigen
es:
  cancel: Cancelar
  confirm: Confirmar
zh:
  cancel: 取消
  confirm: 确认
</i18n>

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
        'backdrop-brightness-40': modelValue,
        'pointer-events-none': !modelValue,
      }"
      class="
        fixed left-0 top-0 z-50 w-full h-full scale-105 bg-transparent
        inline-flex items-center justify-center backdrop:bg-transparent
        transition-all duration-200 p-0 dark
      ">

      <!-- Content -->
      <template #dialog="slots">
        <div
          class="
            rounded-lg max-w-xl pointer-events-auto
            bg-white dark:bg-primary-900
            text-black dark:text-white
            transition-all duration-100
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
                :labelCancel="labelCancel ?? t('cancel')"
                :labelConfirm="labelConfirm ?? t('confirm')"
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
