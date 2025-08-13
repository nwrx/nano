<script setup lang="ts">
import type { ThreadInputObject, ThreadInputValue } from '@nwrx/nano'
import { useFlow } from '~/composables/useFlow'
import Hint from '../base/Hint.vue'
import ThreadInputsSingle from './ThreadInputs.Single.vue'

const props = defineProps<{
  workspace: string
  project: string
  name: string
}>()

const emit = defineEmits<{
  'submit': [ThreadInputObject]
}>()

const { t } = useI18n()
const flow = useFlow(props)
const model = defineModel<ThreadInputObject>({ default: () => ({}) })

onMounted(async() => {
  await flow.fetchSchema()
})

function setValue(name: string, value: ThreadInputValue | undefined): void {
  if (!flow.schema.inputs.some(input => input.id === name)) return
  if (value === undefined) delete model.value[name]
  else model.value[name] = value
}

function getValue(name: string): ThreadInputValue | undefined {
  return model.value[name]
}
</script>

<template>
  <div class="flex flex-col items-start w-full select-auto space-y-md">

    <!-- If there are no inputs, display a message -->
    <Hint
      v-if="flow.schema.inputs.length === 0"
      class="b-app text-subtle select-text"
      :text="t('noInputs')"
      icon="i-carbon:warning-alt"
    />

    <!-- If there is a single input of type "string", display a ChatGPT like textarea -->
    <ThreadInputsSingle
      v-if="flow.schema.inputs.length === 1 && flow.schema.inputs[0].type === 'string'"
      v-model="model"
      :schema="flow.schema"
    />

    <!-- For each input field in the schema -->
    <template v-else>
      <DataSheet>
        <DataSheetRow
          v-for="field in flow.schema.inputs"
          :key="field.id"
          :name="field.label"
          :placeholder="field.description"
          :is-editable="true"
          :is-text-area="true"
          :model-value="getValue(field.name)"
          @update:model-value="(value) => setValue(field.name, value)"
        />
      </DataSheet>
    </template>

    <!-- Button -->
    <div class="flex justify-end w-full">
      <Button
        class="button-success"
        icon-expand
        icon-append="i-carbon:chevron-right"
        :label="t('submit')"
        :disabled="flow.schema.inputs.length === 0"
        @click="() => emit('submit', model)"
      />
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  submit: Submit
  noInputs: This flow currently doesn't have any configured input fields. You can enhance its functionality by adding an Input component in the flow definition to enable user interaction and data processing capabilities.
fr:
  submit: Envoyer
  noInputs: Ce flux ne possède actuellement aucun champ d'entrée configuré. Vous pouvez améliorer sa fonctionnalité en ajoutant un composant d'Entrée dans la définition du flux pour permettre l'interaction utilisateur et les capacités de traitement de données.
de:
  submit: Absenden
  noInputs: Dieser Flow verfügt derzeit über keine konfigurierten Eingabefelder. Sie können seine Funktionalität erweitern, indem Sie eine Eingabekomponente in der Flow-Definition hinzufügen, um Benutzerinteraktion und Datenverarbeitungsfunktionen zu ermöglichen.
es:
  submit: Enviar
  noInputs: Este flujo actualmente no tiene campos de entrada configurados. Puede mejorar su funcionalidad añadiendo un componente de Entrada en la definición del flujo para habilitar la interacción del usuario y capacidades de procesamiento de datos.
zh:
  submit: 提交
  noInputs: 此流程目前没有配置任何输入字段。您可以通过在流程定义中添加输入组件来增强其功能，从而启用用户交互和数据处理能力。
</i18n>
