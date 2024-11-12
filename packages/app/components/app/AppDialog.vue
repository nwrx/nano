<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseDialogProps } from '@unshared/vue'
import { vMarkdown, type VNode } from '#imports'

const props = defineProps<{
  title?: string
  text?: string
  icon?: string
  classHint?: string
  classContent?: string
  variant?: Variant
  disabled?: boolean
  labelConfirm?: string
  labelCancel?: string
} & BaseDialogProps>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const slots = defineSlots<{
  title: () => VNode
  text: () => VNode
  actions: () => VNode
}>()

const { t, locale } = useI18n({ useScope: 'local' })
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <Teleport :key="locale" to="#layout" defer>

    <!-- Backdrop -->
    <div
      :class="{
        'op-0': !model,
        'backdrop-brightness-80 backdrop-blur': model,
      }"
      class="
        fixed left-0 top-0 w-screen h-screen pointer-events-none
        transition duration-fast z-100
      "
      @mousedown="() => emit('close')"
    />

    <!-- Dialog -->
    <LazyBaseDialog
      v-slot="slot"
      v-model="model"
      :class="{
        'pointer-events-none': !model,
      }"
      class="
        fixed left-0 top-0 w-screen h-screen bg-transparent z-1000
        inline-flex items-center justify-center backdrop:bg-transparent
        transition duration-fast dark
      "
      @return="() => emit('confirm')"
      @close="() => emit('close')">

      <!-- Content -->
      <div
        class="
            rd max-w-xl pointer-events-auto
            border border-app bg-app text-app
            transition backdrop-blur-lg
          "
        :class="{
          'scale-100 opacity-100 pointer-events-auto': slot.isOpen,
          'scale-95 opacity-0 pointer-events-none': !slot.isOpen,
        }">

        <!-- Title -->
        <div class="flex items-center justify-between p-md">
          <slot name="title">
            <h3 v-markdown="title" />
          </slot>
          <BaseButton eager class="group p-sm absolute right-sm" @click="() => slot.close()">
            <div class="bg-danger-600 opacity-60 group-hover:opacity-100 transition rounded-full size-4" />
          </BaseButton>
        </div>

        <!-- Hint -->
        <div v-if="title || slots.title()" class="flex space-x-md p-md border-x-0 hint rd-0" :class="classHint">
          <BaseIcon v-if="icon" :icon="icon" class="size-4 shrink-0 mt-xs" />
          <slot name="text">
            <p v-markdown="text" class="text-sm" />
          </slot>
        </div>

        <!-- Dialog content -->
        <div class="p-lg w-full" :class="classContent">
          <slot v-bind="slot" />
        </div>

        <!-- CTA -->
        <div class="p-md w-full bg-emphasized">
          <slot name="actions" v-bind="slot">
            <div class="flex items-center justify-between w-full">
              <Button
                :label="labelCancel ?? t('cancel')"
                icon="i-carbon:close"
                size="sm"
                class="mr-xl"
                link
                @click="() => slot.close()"
              />
              <Button
                light
                outlined
                :variant="variant ?? 'success'"
                :label="labelConfirm ?? t('confirm')"
                icon-append="i-carbon:chevron-right"
                icon-expand
                size="sm"
                :disabled="disabled"
                @click="() => slot.returnValue(true)"
              />
            </div>
          </slot>
        </div>
      </div>
    </LazyBaseDialog>
  </Teleport>
</template>

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
