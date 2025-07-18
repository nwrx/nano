<script setup lang="ts">
import Button from '~/components/base/Button.vue'
import InputText from '~/components/base/InputText.vue'
import VariableSearch from '~/components/vaultVariable/VariableSearch.vue'
import { useMcpServerVariables } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const variables = useMcpServerVariables(props)
const variableName = ref<string>('')
const selectedVariable = ref<string>('')
const mountAtPath = ref<string>('')

// --- Computed.
const canSubmit = computed(() => selectedVariable.value.trim() !== '')
const variableNamePlaceholder = computed(() => (
  selectedVariable.value
    ? selectedVariable.value.split('/').pop() ?? t('namePlaceholder')
    : t('namePlaceholder')),
)

async function createVariable() {
  await variables.createVariable({
    variables: [{
      variable: selectedVariable.value,
      name: variableName.value.trim() || selectedVariable.value.split('/').pop()!,
      value: undefined, // No value for linked variables
      mountAtPath: mountAtPath.value.trim() || undefined,
    }],
  })

  // Reset form
  variableName.value = ''
  selectedVariable.value = ''
  mountAtPath.value = ''
}
</script>

<template>
  <div>
    <!-- Variable Form -->
    <div class="p-4 space-y-4 bg-subtle rd-t">
      <VariableSearch
        v-model="selectedVariable"
        :workspace="workspace"
        :label="t('variableLabel')"
        :placeholder="t('variablePlaceholder')"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          v-model="variableName"
          :label="t('nameLabel')"
          :placeholder="variableNamePlaceholder"
          :hint="t('nameHint')"
        />

        <InputText
          v-model="mountAtPath"
          :label="t('mountAtPathLabel')"
          :placeholder="t('mountAtPathPlaceholder')"
          :hint="t('mountAtPathHint')"
        />
      </div>
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
  nameLabel: Variable Name (optional)
  namePlaceholder: Auto-generated from vault variable
  nameHint: Optional custom name. Uses vault variable name if empty.
  variableLabel: Vault Variable
  variablePlaceholder: Select a vault variable
  mountAtPathLabel: Mount at path
  mountAtPathPlaceholder: /path/to/mount (optional)
  mountAtPathHint: Optional container mount path.
  createSubmit: Link Variable
fr:
  nameLabel: Nom de la Variable (optionnel)
  namePlaceholder: Auto-généré à partir de la variable de coffre-fort
  nameHint: Nom personnalisé optionnel. Utilise le nom de la variable de coffre-fort si vide.
  variableLabel: Variable de Coffre-fort
  variablePlaceholder: Sélectionner une variable de coffre-fort
  mountAtPathLabel: Monter au chemin
  mountAtPathPlaceholder: /chemin/vers/montage (optionnel)
  mountAtPathHint: Chemin de montage optionnel du conteneur.
  createSubmit: Lier la Variable
de:
  nameLabel: Variablenname (optional)
  namePlaceholder: Automatisch generiert aus Tresor-Variable
  nameHint: Optionaler benutzerdefinierter Name. Verwendet Tresor-Variablenname wenn leer.
  variableLabel: Tresor-Variable
  variablePlaceholder: Tresor-Variable auswählen
  mountAtPathLabel: Bei Pfad mounten
  mountAtPathPlaceholder: /pfad/zum/mounten (optional)
  mountAtPathHint: Optionaler Container-Mount-Pfad.
  createSubmit: Variable verknüpfen
es:
  nameLabel: Nombre de la Variable (opcional)
  namePlaceholder: Auto-generado desde variable de bóveda
  nameHint: Nombre personalizado opcional. Usa el nombre de la variable de bóveda si está vacío.
  variableLabel: Variable de Bóveda
  variablePlaceholder: Seleccionar una variable de bóveda
  mountAtPathLabel: Montar en ruta
  mountAtPathPlaceholder: /ruta/para/montar (opcional)
  mountAtPathHint: Ruta de montaje opcional del contenedor.
  createSubmit: Vincular Variable
zh:
  nameLabel: 变量名称（可选）
  namePlaceholder: 从保险库变量自动生成
  nameHint: 可选的自定义名称。如果为空则使用保险库变量名称。
  variableLabel: 保险库变量
  variablePlaceholder: 选择保险库变量
  mountAtPathLabel: 挂载路径
  mountAtPathPlaceholder: /path/to/mount（可选）
  mountAtPathHint: 可选的容器挂载路径。
  createSubmit: 链接变量
</i18n>
