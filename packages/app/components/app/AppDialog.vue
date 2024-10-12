<script setup lang="ts">
import type { BaseDialogProps } from '@unshared/vue'
import { vMarkdown } from '#imports'

const props = defineProps<{
  title?: string
  text?: string
  icon?: string
  classHint?: string
  variant?: Variant
  disabled?: boolean
  labelConfirm?: string
  labelCancel?: string
} & BaseDialogProps>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const { t, locale } = useI18n({ useScope: 'local' })
</script>

<template>
  <Teleport :key="locale" to="#layout" defer>
    <LazyBaseDialog
      v-bind="props"
      title=""
      :class="{
        'backdrop-contrast-90 backdrop-brightness-50': modelValue,
        'pointer-events-none': !modelValue,
      }"
      class="
        fixed left-0 top-0 z-9999 w-screen h-screen scale-105 bg-transparent
        inline-flex items-center justify-center backdrop:bg-transparent
        transition dark
      "
      @return="() => emit('confirm')"
      @close="() => emit('close')">

      <!-- Content -->
      <template #dialog="slots">
        <div
          class="
            rd max-w-xl pointer-events-auto
            border border-app bg-app text-app
            transition backdrop-blur-lg
          "
          :class="{
            'scale-100 opacity-100 pointer-events-auto': slots.isOpen,
            'scale-95 opacity-0 pointer-events-none': !slots.isOpen,
          }">

          <!-- Title -->
          <div class="flex items-center justify-between p-md">
            <slot name="title">
              <h3 v-markdown="title"/>
            </slot>
            <BaseButton eager class="group p-sm absolute right-sm" @click="() => slots.close()">
              <div class="bg-danger-600 opacity-60 group-hover:opacity-100 transition rounded-full size-4"/>
            </BaseButton>
          </div>

          <!-- Hint -->
          <div v-if="title || $slots.title" class="flex space-x-md p-md border-x-0 hint rd-0" :class="classHint">
            <BaseIcon v-if="icon" :icon="icon" class="size-4 shrink-0 mt-xs"/>
            <slot name="text">
              <p v-markdown="text" class="text-sm"/>
            </slot>
          </div>

          <!-- Dialog content -->
          <div class="p-lg w-full">
            <slot v-bind="slots" />
          </div>

          <!-- CTA -->
          <div class="p-md w-full bg-layout-emphasized">
            <slot name="actions" v-bind="slots">
              <div class="flex items-center justify-between w-full">
                <Button
                  :label="labelCancel ?? t('button.cancel')"
                  icon="i-carbon:close"
                  size="sm"
                  class="mr-xl"
                  link
                  @click="() => slots.close()"
                />
                <Button
                  light
                  outlined
                  :variant="variant ?? 'success'"
                  :label="labelConfirm ?? t('button.confirm')"
                  icon-append="i-carbon:chevron-right"
                  icon-expand
                  size="sm"
                  :disabled="disabled"
                  @click="() => slots.returnValue(true)"
                />
              </div>
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
