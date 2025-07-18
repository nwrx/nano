<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServerVariables } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  variable: McpServerVariableObject
}>()

// --- Model.
const { t } = useI18n()
const variables = useMcpServerVariables(props)
const value = ref<string>()
const mountAtPath = ref<string>()

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => {
  if (!isOpen.value) return
  if (!props.variable) return
  value.value = props.variable.value
  mountAtPath.value = props.variable.mountAtPath
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name: variable.name, server: name })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => {
      variables.updateVariable(variable.name, {
        value,
        mountAtPath,
      })
    }">

    <!-- Value field -->
    <div class="space-y-4">
      <InputText
        v-model="value"
        type="textarea"
        :label="t('valueLabel')"
        :placeholder="t('valuePlaceholder')"
        :hint="t('valueHint')"
      />

      <!-- Mount Path field -->
      <InputText
        v-model="mountAtPath"
        :label="t('mountAtPathLabel')"
        :placeholder="t('mountAtPathPlaceholder')"
        :hint="t('mountAtPathHint')"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Edit variable **{name}** of server **{server}**
  text: Update the value and mount path of this environment variable. Changes will be applied immediately.
  confirm: Update variable
  cancel: Cancel changes
  success: Variable has been updated successfully.
  valueLabel: Variable value
  valuePlaceholder: Enter the variable value
  valueHint: The value of the environment variable, can be a string or a number.
  mountAtPathLabel: Mount at path
  mountAtPathPlaceholder: /path/to/mount (optional)
  mountAtPathHint: Optional path where the variable should be mounted in the container.
fr:
  title: Modifier la variable **{name}** du serveur **{server}**
  text: Mettre à jour la valeur et le chemin de montage de cette variable d'environnement. Les modifications seront appliquées immédiatement.
  confirm: Mettre à jour la variable
  cancel: Annuler les modifications
  success: La variable a été mise à jour avec succès.
  valueLabel: Valeur de la variable
  valuePlaceholder: Entrez la valeur de la variable
  valueHint: La valeur de la variable d'environnement, peut être une chaîne ou un nombre.
  mountAtPathLabel: Monter au chemin
  mountAtPathPlaceholder: /chemin/vers/montage (optionnel)
  mountAtPathHint: Chemin optionnel où la variable doit être montée dans le conteneur.
de:
  title: Variable **{name}** des Servers **{server}** bearbeiten
  text: Aktualisieren Sie den Wert und Mountpfad dieser Umgebungsvariable. Änderungen werden sofort angewendet.
  confirm: Variable aktualisieren
  cancel: Änderungen abbrechen
  success: Variable wurde erfolgreich aktualisiert.
  valueLabel: Variablenwert
  valuePlaceholder: Geben Sie den Variablenwert ein
  valueHint: Der Wert der Umgebungsvariable, kann eine Zeichenkette oder eine Zahl sein.
  mountAtPathLabel: Bei Pfad mounten
  mountAtPathPlaceholder: /pfad/zum/mounten (optional)
  mountAtPathHint: Optionaler Pfad, wo die Variable im Container gemountet werden soll.
es:
  title: Editar variable **{name}** del servidor **{server}**
  text: Actualizar el valor y la ruta de montaje de esta variable de entorno. Los cambios se aplicarán inmediatamente.
  confirm: Actualizar variable
  cancel: Cancelar cambios
  success: La variable se ha actualizado exitosamente.
  valueLabel: Valor de la variable
  valuePlaceholder: Introduzca el valor de la variable
  valueHint: El valor de la variable de entorno, puede ser una cadena o un número.
  mountAtPathLabel: Montar en ruta
  mountAtPathPlaceholder: /ruta/para/montar (opcional)
  mountAtPathHint: Ruta opcional donde la variable debe montarse en el contenedor.
zh:
  title: 编辑服务器 **{server}** 的变量 **{name}**
  text: 更新此环境变量的值和挂载路径。更改将立即应用。
  confirm: 更新变量
  cancel: 取消更改
  success: 变量已成功更新。
  valueLabel: 变量值
  valuePlaceholder: 输入变量值
  valueHint: 环境变量的值，可以是字符串或数字。
  mountAtPathLabel: 挂载路径
  mountAtPathPlaceholder: /path/to/mount（可选）
  mountAtPathHint: 变量应在容器中挂载的可选路径。
</i18n>
