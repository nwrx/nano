<script setup lang="ts">
import Button from '~/components/base/Button.vue'
import VariableSearch from '~/components/vaultVariable/VariableSearch.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
const argumentsValues = ref<string[]>([''])
const argumentsToSubmit = computed(() => argumentsValues.value
  .filter(variable => variable.trim() !== '')
  .map(variable => ({ value: undefined, variable })))
</script>

<template>
  <div>
    <!-- Variable Selector -->
    <div class="p-4 space-y-4 bg-subtle rd-t">
      <div
        v-for="(variable, index) in argumentsValues"
        :key="index"
        class="flex items-end gap-4">
        <VariableSearch
          :model-value="variable"
          :workspace="workspace"
          :label="index === 0 ? t('variableLabel') : undefined"
          :placeholder="t('variablePlaceholder')"
          @update:model-value="(value) => argumentsValues[index] = value"
        />

        <!-- Remove Button -->
        <Button
          :loading="false"
          icon="i-carbon:close"
          class="button-fab"
          :class="{ 'op-50 pointer-events-none': argumentsValues.length <= 1 }"
          :disabled="argumentsValues.length <= 1"
          @click="() => argumentsValues.splice(index, 1)"
        />
      </div>

      <!-- Add Another Button -->
      <Button
        :loading="false"
        icon="i-carbon:add-alt"
        :label="t('addArgument')"
        @click="() => argumentsValues.push('')"
      />
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end p-4 b-t b-app">
      <Button
        :loading="false"
        icon="i-carbon:add"
        class="button-success"
        :label="t('createSubmit')"
        @click="async() => {
          await server.createArguments({ arguments: argumentsToSubmit })
          argumentsValues = [''] // Reset the input after submission
        }"
      />
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  addArgument: Add another
  variableLabel: Variable
  variablePlaceholder: Select a vault variable
  createSubmit: Link Argument
  createSuccess: Argument linked successfully
fr:
  addArgument: Ajouter un autre
  variableLabel: Variable
  variablePlaceholder: Sélectionner une variable de coffre-fort
  createSubmit: Lier l'argument
  createSuccess: Argument lié avec succès
de:
  addArgument: Einen weiteren hinzufügen
  variableLabel: Variable
  variablePlaceholder: Tresorvariable auswählen
  createSubmit: Argument verknüpfen
  createSuccess: Argument erfolgreich verknüpft
es:
  addArgument: Añadir otro
  variableLabel: Variable
  variablePlaceholder: Seleccionar una variable de bóveda
  createSubmit: Vincular argumento
  createSuccess: Argumento vinculado con éxito
zh:
  addArgument: 添加另一个
  variableLabel: 变量
  variablePlaceholder: 选择保险库变量
  createSubmit: 链接参数
  createSuccess: 参数链接成功
</i18n>
