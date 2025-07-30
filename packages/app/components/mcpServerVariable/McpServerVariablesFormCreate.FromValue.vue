<script setup lang="ts">
import Button from '~/components/base/Button.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServerVariables } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const variables = useMcpServerVariables(props)
const variableName = ref<string>('')
const variableValue = ref<string>('')
const mountAtPath = ref<string>('')
const canSubmit = computed(() =>
  variableName.value.trim() !== ''
  && variableValue.value.trim() !== '')

async function createVariable() {
  await variables.createVariable({
    variables: [{
      variable: undefined,
      name: variableName.value.trim(),
      value: variableValue.value.trim(),
      mountAtPath: mountAtPath.value.trim() || undefined,
    }],
  })

  // Reset form
  variableName.value = ''
  variableValue.value = ''
  mountAtPath.value = ''
}
</script>

<template>
  <div>
    <!-- Variable Form -->
    <div class="p-md space-y-md bg-subtle rd-t">
      <InputText
        v-model="variableName"
        :label="t('nameLabel')"
        :placeholder="t('namePlaceholder')"
      />

      <InputText
        v-model="variableValue"
        type="textarea"
        :label="t('valueLabel')"
        :placeholder="t('valuePlaceholder')"
      />

      <InputText
        v-model="mountAtPath"
        :label="t('mountAtPathLabel')"
        :placeholder="t('mountAtPathPlaceholder')"
      />
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end p-4 b-t b-app">
      <Button
        :loading="false"
        icon="i-carbon:add"
        class="button-success"
        :label="t('createSubmit')"
        :disabled="!canSubmit"
        @click="() => createVariable()"
      />
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  nameLabel: Variable Name
  namePlaceholder: Enter variable name (e.g., API_KEY, DATABASE_URL)
  nameHint: Environment variable name for the server process.
  valueLabel: Variable Value
  valuePlaceholder: Enter the variable value
  valueHint: Value of the environment variable.
  mountAtPathLabel: Mount at path
  mountAtPathPlaceholder: /path/to/mount (optional)
  mountAtPathHint: Optional container mount path.
  createSubmit: Create Variable
fr:
  nameLabel: Nom de la Variable
  namePlaceholder: 'Entrez le nom de la variable (ex: API_KEY, DATABASE_URL)'
  nameHint: Nom de la variable d'environnement pour le processus du serveur.
  valueLabel: Valeur de la Variable
  valuePlaceholder: Entrez la valeur de la variable
  valueHint: Valeur de la variable d'environnement.
  mountAtPathLabel: Monter au chemin
  mountAtPathPlaceholder: /chemin/vers/montage (optionnel)
  mountAtPathHint: Chemin de montage optionnel du conteneur.
  createSubmit: Créer la Variable
de:
  nameLabel: Variablenname
  namePlaceholder: Geben Sie den Variablennamen ein (z.B. API_KEY, DATABASE_URL)
  nameHint: Umgebungsvariablenname für den Serverprozess.
  valueLabel: Variablenwert
  valuePlaceholder: Geben Sie den Variablenwert ein
  valueHint: Wert der Umgebungsvariable.
  mountAtPathLabel: Bei Pfad mounten
  mountAtPathPlaceholder: /pfad/zum/mounten (optional)
  mountAtPathHint: Optionaler Container-Mount-Pfad.
  createSubmit: Variable erstellen
es:
  nameLabel: Nombre de la Variable
  namePlaceholder: 'Introduzca el nombre de la variable (ej: API_KEY, DATABASE_URL)'
  nameHint: Nombre de la variable de entorno para el proceso del servidor.
  valueLabel: Valor de la Variable
  valuePlaceholder: Introduzca el valor de la variable
  valueHint: Valor de la variable de entorno.
  mountAtPathLabel: Montar en ruta
  mountAtPathPlaceholder: /ruta/para/montar (opcional)
  mountAtPathHint: Ruta de montaje opcional del contenedor.
  createSubmit: Crear Variable
zh:
  nameLabel: 变量名称
  namePlaceholder: 输入变量名称（例如：API_KEY、DATABASE_URL）
  nameHint: 服务器进程的环境变量名称。
  valueLabel: 变量值
  valuePlaceholder: 输入变量值
  valueHint: 环境变量的值。
  mountAtPathLabel: 挂载路径
  mountAtPathPlaceholder: /path/to/mount（可选）
  mountAtPathHint: 可选的容器挂载路径。
  createSubmit: 创建变量
</i18n>
