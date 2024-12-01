<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
}>()

const emit = defineEmits<{
  'submit': [name: string, value: string]
}>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const newName = ref('')
const newValue = ref('')

function submit() {
  emit('submit', newName.value, newValue.value)
  newName.value = ''
  newValue.value = ''
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title')"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => submit()">

    <!-- Name input -->
    <InputText
      v-model="newName"
      class="mt-2"
      :placeholder="t('name')"
      :label="t('nameLabel')"
    />

    <!-- Value input -->
    <InputText
      v-model="newValue"
      type="textarea"
      class="mt-2 font-mono"
      :placeholder="t('value')"
      :label="t('valueLabel')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Create new secret
  text: Create a new secret in the project **{workspace}/{project}**. Please provide a name and value for the secret.
  cancel: Cancel
  confirm: Create
  name: SECRET_NAME
  value: Enter the secret value...
  nameLabel: Secret Name
  valueLabel: Secret Value
fr:
  title: Créer un nouveau secret
  text: Créez un nouveau secret dans le projet **{workspace}/{project}**. Veuillez fournir un nom et une valeur pour le secret.
  cancel: Annuler
  confirm: Créer
  name: NOM_DU_SECRET
  value: Entrez la valeur du secret...
  nameLabel: Nom du secret
  valueLabel: Valeur du secret
de:
  title: Neues Geheimnis erstellen
  text: Erstellen Sie ein neues Geheimnis im Projekt **{workspace}/{project}**. Bitte geben Sie einen Namen und einen Wert für das Geheimnis an.
  cancel: Abbrechen
  confirm: Erstellen
  name: GEHEIMNISNAME
  value: Geben Sie den Geheimniswert ein...
  nameLabel: Geheimnisname
  valueLabel: Geheimniswert
es:
  title: Crear nuevo secreto
  text: Cree un nuevo secreto en el proyecto **{workspace}/{project}**. Proporcione un nombre y un valor para el secreto.
  cancel: Cancelar
  confirm: Crear
  name: NOMBRE_DEL_SECRETO
  value: Introduzca el valor del secreto...
  nameLabel: Nombre del secreto
  valueLabel: Valor del secreto
zh:
  title: 创建新秘密
  text: 在项目 **{workspace}/{project}** 中创建一个新秘密。请提供秘密的名称和值。
  cancel: 取消
  confirm: 创建
  name: MI_MI_MING_CHENG
  value: 输入秘密值...
  nameLabel: 秘密名称
  valueLabel: 秘密值
</i18n>
