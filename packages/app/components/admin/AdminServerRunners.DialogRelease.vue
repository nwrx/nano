<script setup lang="ts">
const props = defineProps<{
  address: string
  identity: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-danger"
    class-button="button-danger"
    icon="i-carbon:trash-can"
    :title="t('title')"
    :text="t('text')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== address"
    @confirm="() => emit('submit')">
    <div class="flex items-center space-x-sm">
      <Badge
        size="small"
        :label="address"
        class="font-normal badge-soft badge-primary"
      />
    </div>

    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      :label="t('message')"
      :placeholder="address"
      class="mt-4"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Release the {identity} runner
  text: This will permanently remove the runner from the system. Any running tasks will be interrupted. This action cannot be undone.
  message: Confirm by typing the runner address below
  confirm: Release Runner
  cancel: Keep Runner
fr:
  title: Libérer le runner {identity}
  text: Cela supprimera définitivement le runner du système. Toutes les tâches en cours seront interrompues. Cette action ne peut pas être annulée.
  message: Confirmez en tapant l'adresse du runner ci-dessous
  confirm: Libérer le Runner
  cancel: Garder le Runner
</i18n>
