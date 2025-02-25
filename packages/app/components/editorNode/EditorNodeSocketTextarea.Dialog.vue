<script setup lang="ts">
import { vMarkdown } from '#imports'

const props = defineProps<{
  name: string
  description?: string
  modelValue?: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:isOpen': [value: boolean]
}>()

const { t } = useI18n()
const settings = useLocalSettings()
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const model = ref('')

watch(() => props.isOpen, () => {
  model.value = props.modelValue ?? ''
}, { immediate: true })

function onTextAreaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  model.value = target.value
}

function confirm() {
  isOpen.value = false
  emit('update:modelValue', model.value)
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    teleport="#editor"
    class-container="
      flex flex-col !w-full h-full max-w-page max-h-4xl cursor-auto
      pointer-events-auto b b-editor text-app !bg-editor-node bg-op-80 overflow-hidden rd
    ">

    <!-- Content -->
    <template #container>
      <div class="flex items-center b-b b-editor p-sm space-x-sm">
        <EditorNodeSocketTextareaDialogButton
          icon="i-carbon:close"
          @click="() => isOpen = false"
        />
        <span class="text-base font-medium ml-md select-text">
          {{ name }}
        </span>
        <!-- Divider -->
        <BaseIcon icon="i-carbon:dot-mark" class="size-3" />
        <!-- Description -->
        <span class="text-subtle text-sm select-text">
          {{ description }}
        </span>
        <!-- Spacer -->
        <div class="flex-1" />
        <!-- Preview -->
        <EditorNodeSocketTextareaDialogButton
          icon="i-carbon:text-long-paragraph"
          :label="t('preview')"
          :is-active="settings.editorNodeTextareaShowPreview"
          @click="() => settings.editorNodeTextareaShowPreview = !settings.editorNodeTextareaShowPreview"
        />
      </div>

      <!-- Text and Preview -->
      <div class="flex grow overflow-hidden w-full h-full relative">
        <textarea
          v-model="model"
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
            :key="model"
            v-markdown="model"
            class="
                markdown w-1/2 h-full b-l b-editor p-lg text-app
                overflow-y-auto transition absolute select-text
              "
          />
        </div>
      </div>

      <!-- Confirm -->
      <div class="flex items-center justify-end b-t b-editor p-sm space-x-sm">
        <Hyperlink
          :label="t('cancel')"
          icon-append="i-carbon:close"
          class="text-sm ml-sm"
          @click="() => isOpen = false"
        />
        <div class="grow" />
        <Button
          :label="t('confirm')"
          class="button-success"
          icon-append="i-carbon:checkmark"
          @click="() => confirm()"
        />
      </div>
    </template>
  </AppDialog>
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
