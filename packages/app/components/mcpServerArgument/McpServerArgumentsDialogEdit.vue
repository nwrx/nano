<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServerArguments } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  argument: McpServerArgumentObject
}>()

// --- Model.
const { t } = useI18n()
const args = useMcpServerArguments(props)
const value = ref<string>()

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => {
  if (!isOpen.value) return
  if (!props.argument) return
  value.value = props.argument.value
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { position: argument.position, server: name })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => args.updateArgument(argument.position, { value })">
    <InputText
      v-model="value"
      type="textarea"
      :label="t('valueLabel')"
      :placeholder="t('valuePlaceholder')"
      :hint="t('valueHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Edit the argument at **position {position}** of server **{server}**
  text: Update the name and value of this server argument. Changes will be applied immediately.
  confirm: Update argument
  cancel: Cancel changes
  success: Argument has been updated successfully.
  valueLabel: Argument value
  valuePlaceholder: Enter the argument value
  valueHint: The value of the argument, can be a string or a number.
</i18n>
