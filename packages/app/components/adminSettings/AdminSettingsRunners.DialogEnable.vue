<script setup lang="ts">
const props = defineProps<{
  address: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <Dialog
    v-model="model"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:checkmark"
    :title="t('dialog.enable.title')"
    :text="t('dialog.enable.text')"
    :label-cancel="t('dialog.enable.cancel')"
    :label-confirm="t('dialog.enable.confirm')"
    @confirm="() => emit('submit')">
    <div class="flex items-center space-x-sm">
      <Badge
        size="small"
        :label="address"
        class="font-normal badge-soft badge-primary"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  dialog:
    enable:
      title: Enable Thread Runner
      text: This will enable the runner server and allow it to accept new tasks.
      confirm: Enable Server
      cancel: Keep Disabled
fr:
  dialog:
    enable:
      title: Activer le Runner
      text: Cela activera le serveur runner et lui permettra d'accepter de nouvelles tâches.
      confirm: Activer le Serveur
      cancel: Garder Désactivé
</i18n>
