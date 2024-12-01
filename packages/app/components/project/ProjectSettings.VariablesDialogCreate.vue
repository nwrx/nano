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
  title: Create new variable
  text: Create a new variable in the project **{workspace}/{project}**. Please provide a name and value for the variable.
  cancel: Cancel
  confirm: Create
  name: Enter the variable name...
  value: Enter the variable value...
  nameLabel: Variable Name
  valueLabel: Variable Value
fr:
  title: Créer une nouvelle variable
  text: Créez une nouvelle variable dans le projet **{workspace}/{project}**. Veuillez fournir un nom et une valeur pour la variable.
  cancel: Annuler
  confirm: Créer
  name: Entrez le nom de la variable...
  value: Entrez la valeur de la variable...
  nameLabel: Nom de la variable
  valueLabel: Valeur de la variable
de:
  title: Neue Variable erstellen
  text: Erstellen Sie eine neue Variable im Projekt **{workspace}/{project}**. Bitte geben Sie einen Namen und einen Wert für die Variable an.
  cancel: Abbrechen
  confirm: Erstellen
  name: Geben Sie den Variablennamen ein...
  value: Geben Sie den Variablenwert ein...
  nameLabel: Variablenname
  valueLabel: Variablenwert
es:
  title: Crear nueva variable
  text: Cree una nueva variable en el proyecto **{workspace}/{project}**. Proporcione un nombre y un valor para la variable.
  cancel: Cancelar
  confirm: Crear
  name: Introduzca el nombre de la variable...
  value: Introduzca el valor de la variable...
  nameLabel: Nombre de la variable
  valueLabel: Valor de la variable
zh:
  title: 创建新变量
  text: 在项目 **{workspace}/{project}** 中创建一个新变量。请提供变量的名称和值。
  cancel: 取消
  confirm: 创建
  name: 输入变量名称...
  value: 输入变量值...
  nameLabel: 变量名称
  valueLabel: 变量值
</i18n>
