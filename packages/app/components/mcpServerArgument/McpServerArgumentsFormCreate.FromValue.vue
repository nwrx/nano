<script setup lang="ts">
import Button from '~/components/base/Button.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServerArguments } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const args = useMcpServerArguments(props)
const argumentsValues = ref<string[]>([''])
const argumentsToSubmit = computed(() => argumentsValues.value
  .filter(argument => argument.trim() !== '')
  .map(argument => ({ value: argument.trim(), variable: undefined })))
</script>

<template>
  <div>
    <!-- Value Text Field -->
    <div class="p-4 space-y-4 bg-subtle rd-t">
      <div
        v-for="(value, index) in argumentsValues"
        :key="index"
        class="flex items-end gap-4">
        <InputText
          :model-value="value"
          :label="index === 0 ? t('valueLabel') : undefined"
          :text-before="`#${index + 1}`"
          :placeholder="t('valuePlaceholder')"
          @update:model-value="(value) => argumentsValues[index] = value"
        />

        <!-- Fab -->
        <Button
          :loading="false"
          icon="i-carbon:close"
          class="button-fab"
          :class="{ 'op-50 pointer-events-none': argumentsValues.length <= 1 }"
          :disabled="argumentsValues.length <= 1"
          @click="() => argumentsValues.splice(index, 1)"
        />
      </div>

      <!-- Add -->
      <Button
        :loading="false"
        icon="i-carbon:add-alt"
        :label="t('addArgument')"
        @click="() => argumentsValues.push('')"
      />
    </div>

    <div class="flex justify-end p-4 b-t b-app">
      <Button
        :loading="false"
        icon="i-carbon:add"
        class="button-success"
        :label="t('createSubmit')"
        @click="async() => {
          await args.createArguments({ arguments: argumentsToSubmit })
          argumentsValues = [''] // Reset the input after submission
        }"
      />
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  valueLabel: Argument Value
  valuePlaceholder: Enter argument value
  addArgument: Add a new argument to the list
  createSubmit: Create Argument
fr:
  valueLabel: Valeur de l'Argument
  valuePlaceholder: Entrez la valeur de l'argument
  addArgument: Ajouter un nouvel argument à la liste
  createSubmit: Créer l'Argument
de:
  valueLabel: Argumentwert
  valuePlaceholder: Geben Sie den Argumentwert ein
  addArgument: Fügen Sie der Liste ein neues Argument hinzu
  createSubmit: Argument erstellen
es:
  valueLabel: Valor del Argumento
  valuePlaceholder: Introduzca el valor del argumento
  addArgument: Añadir un nuevo argumento a la lista
  createSubmit: Crear Argumento
zh:
  valueLabel: 参数值
  valuePlaceholder: 输入参数值
  addArgument: 添加新参数到列表
  createSubmit: 创建参数
</i18n>
