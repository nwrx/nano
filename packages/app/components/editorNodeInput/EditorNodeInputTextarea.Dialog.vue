<script setup lang="ts">
import { vMarkdown } from '@unshared/vue/vMarkdown'
import EditorDialogButton from '../editor/EditorDialog.Button.vue'
import EditorDialog from '../editor/EditorDialog.vue'

const props = defineProps<{
  name?: string
  description?: string
  modelValue?: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const settings = useLocalSettings()
const show = defineModel('show', { default: false })
const value = ref('')

watch(show, () => {
  value.value = typeof props.modelValue === 'string'
    ? props.modelValue
    : ''
})

function onTextAreaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  value.value = target.value
}

function confirm() {
  show.value = false
  emit('update:modelValue', value.value)
}
</script>

<template>
  <EditorDialog
    v-model="show"
    :title="name"
    :description="description">

    <!-- Content -->
    <template #menu>
      <EditorDialogButton
        icon="i-carbon:text-long-paragraph"
        :label="t('preview')"
        :is-active="settings.editorNodeTextareaShowPreview"
        @click="() => settings.editorNodeTextareaShowPreview = !settings.editorNodeTextareaShowPreview"
      />
    </template>

    <!-- Text and Preview -->
    <template #default>
      <textarea
        v-model="value"
        spellcheck="false"
        class="flex-1 h-full p-lg resize-none bg-transparent outline-none font-mono text-sm"
        rows="10"
        @input="event => onTextAreaInput(event)"
      />

      <!-- Preview -->
      <div
        :class="{
          'op-0 w-0': !settings.editorNodeTextareaShowPreview,
          'op-100 w-1/2': settings.editorNodeTextareaShowPreview,
        }"
        class="overflow-hidden transition-all duration-slow">
        <div
          :key="value"
          v-markdown="value"
          class="
            markdown w-1/2 h-full b-l b-app p-lg text-app
            overflow-y-auto transition absolute select-text
          "
        />
      </div>
    </template>

    <!-- Confirm -->
    <template #actions>
      <Hyperlink
        :label="t('cancel')"
        icon-append="i-carbon:close"
        class="text-sm ml-sm"
        @click="() => show = false"
      />
      <div class="grow" />
      <Button
        :label="t('confirm')"
        class="button-success"
        icon-append="i-carbon:checkmark"
        @click="() => confirm()"
      />
    </template>
  </EditorDialog>
</template>

<i18n lang="yaml">
en:
  preview: Preview
  confirm: Confirm changes
  cancel: Cancel changes
fr:
  preview: Aperçu
  confirm: Confirmer les modifications
  cancel: Annuler les modifications
de:
  preview: Vorschau
  confirm: Änderungen bestätigen
  cancel: Änderungen abbrechen
es:
  preview: Vista previa
  confirm: Confirmar cambios
  cancel: Cancelar cambios
zh:
  preview: 预览
  confirm: 确认更改
  cancel: 取消更改
</i18n>
