<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T">
import type { BaseDialogProps, BaseDialogSlotProps } from '@unshared/vue/BaseDialog'
import type { VNode } from '#imports'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseDialog } from '@unshared/vue/BaseDialog'
import { vMarkdown } from '#imports'
import Hyperlink from '~/components/base/Hyperlink.vue'

defineProps<BaseDialogProps<T> & {
  title?: string
  text?: string
  icon?: string
  classHint?: string
  classContent?: string
  classContainer?: string
  classButton?: string
  disabled?: boolean
  labelConfirm?: string
  labelCancel?: string
  persistent?: boolean
  teleport?: string
  onConfirm?: () => any
}>()

const emit = defineEmits<{
  open: []
  close: []
  confirm: []
}>()

defineSlots<{
  default: (slot: BaseDialogSlotProps<T>) => VNode
  actions: (slot: BaseDialogSlotProps<T>) => VNode
  container: (slot: BaseDialogSlotProps<T>) => VNode
}>()

const { t } = useI18n()
const isOpen = defineModel({ default: false })

// Quick fix to emit `open` event when dialog is opened
watch(isOpen, value => value && emit('open'))
</script>

<template>
  <Teleport :to="teleport ?? '#layout'" defer>

    <!-- Backdrop -->
    <div
      :class="{
        'pointer-events-none op-0': !isOpen,
        'pointer-events-auto backdrop-brightness-80 backdrop-blur': isOpen,
      }"
      class="
        fixed inset-0 w-screen h-screen z-10
        transition duration-fast cursor-pointer
      "
      @mousedown="() => isOpen = false"
    />

    <!-- Dialog -->
    <BaseDialog
      v-slot="slot"
      v-model="isOpen"
      as="div"
      :class="{
        'pointer-events-none': !isOpen,
      }"
      class="
        fixed inset-0 bg-transparent z-10 p-2xl
        inline-flex items-center justify-center backdrop:bg-transparent
        transition duration-fast dark pointer-events-none
      "
      @open="() => emit('open')"
      @return="() => emit('confirm')"
      @close="() => emit('close')">

      <div
        class="
          rd w-xl pointer-events-auto
          border border-app bg-app text-app
          transition backdrop-blur-lg
        "
        :class="[classContainer, {
          'scale-100 opacity-100 pointer-events-auto': slot.isOpen,
          'scale-95 opacity-0 pointer-events-none': !slot.isOpen,
        }]">

        <!-- Content -->
        <slot name="container" v-bind="slot">
          <div class="flex items-center justify-between p-md">
            <h3 v-markdown="title" />
            <BaseButton eager class="group p-sm absolute right-sm" @click="() => slot.close()">
              <div class="bg-danger-600 opacity-60 group-hover:opacity-100 transition rounded-full size-4" />
            </BaseButton>
          </div>

          <!-- Hint -->
          <div v-if="title" class="flex space-x-md p-md border-x-0 hint rd-0" :class="classHint">
            <BaseIcon v-if="icon" :icon="icon" class="size-4 shrink-0 mt-xs" />
            <p v-markdown="text" class="text-sm" />
          </div>

          <!-- Dialog content -->
          <div class="p-lg w-full" :class="classContent">
            <slot v-bind="slot" />
          </div>

          <!-- CTA -->
          <div class="p-md w-full bg-emphasized">
            <slot name="actions" v-bind="slot">
              <div class="flex items-center justify-between w-full">
                <Hyperlink
                  :label="labelCancel ?? t('cancel')"
                  icon="i-carbon:close"
                  class="text-sm mr-xl"
                  @click="() => slot.close()"
                />
                <Button
                  :class="classButton ?? 'button-success'"
                  :label="labelConfirm ?? t('confirm')"
                  icon-append="i-carbon:chevron-right"
                  icon-expand
                  :disabled="disabled"
                  @click="async() => {
                    if (!onConfirm) return slot.returnValue(true)
                    await onConfirm()
                    slot.close()
                  }"
                />
              </div>
            </slot>
          </div>
        </slot>
      </div>
    </BaseDialog>
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
