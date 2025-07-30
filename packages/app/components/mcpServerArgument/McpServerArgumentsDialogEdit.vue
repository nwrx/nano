<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServerArguments } from '~/composables/useMcp'
import McpServerArgumentCard from './McpServerArgumentCard.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  argument: McpServerArgumentObject
}>()

// --- Model.
const { t } = useI18n()
const args = useMcpServerArguments(props)
const value = ref<string>()

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => {
  if (!isOpen.value) return
  if (!props.argument) return
  value.value = props.argument.value
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { position: argument.position, server: name })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => args.updateArgument(argument.position, { value })">

    <!-- Card -->
    <McpServerArgumentCard
      :argument="argument"
      class="mb-md"
    />

    <!-- Value -->
    <InputText
      v-model="value"
      type="textarea"
      :label="t('valueLabel')"
      :placeholder="t('valuePlaceholder')"
      :hint="t('valueHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Edit the argument at **position {position}** of server **{server}**
  text: Update the name and value of this server argument. Changes will be applied immediately.
  confirm: Update argument
  cancel: Cancel changes
  success: Argument has been updated successfully.
  valueLabel: Argument value
  valuePlaceholder: Enter the argument value
  valueHint: The value of the argument, can be a string or a number.
fr:
  title: Modifier l'argument à la **position {position}** du serveur **{server}**
  text: Mettre à jour le nom et la valeur de cet argument de serveur. Les modifications seront appliquées immédiatement.
  confirm: Mettre à jour l'argument
  cancel: Annuler les modifications
  success: L'argument a été mis à jour avec succès.
  valueLabel: Valeur de l'argument
  valuePlaceholder: Entrez la valeur de l'argument
  valueHint: La valeur de l'argument, peut être une chaîne ou un nombre.
de:
  title: Argument an **Position {position}** des Servers **{server}** bearbeiten
  text: Name und Wert dieses Serverarguments aktualisieren. Änderungen werden sofort angewendet.
  confirm: Argument aktualisieren
  cancel: Änderungen abbrechen
  success: Argument wurde erfolgreich aktualisiert.
  valueLabel: Argumentwert
  valuePlaceholder: Argumentwert eingeben
  valueHint: Der Wert des Arguments, kann eine Zeichenkette oder eine Zahl sein.
es:
  title: Editar el argumento en la **posición {position}** del servidor **{server}**
  text: Actualizar el nombre y valor de este argumento del servidor. Los cambios se aplicarán inmediatamente.
  confirm: Actualizar argumento
  cancel: Cancelar cambios
  success: El argumento ha sido actualizado exitosamente.
  valueLabel: Valor del argumento
  valuePlaceholder: Ingrese el valor del argumento
  valueHint: El valor del argumento, puede ser una cadena o un número.
zh:
  title: 编辑服务器 **{server}** 的 **位置 {position}** 处的参数
  text: 更新此服务器参数的名称和值。更改将立即应用。
  confirm: 更新参数
  cancel: 取消更改
  success: 参数已成功更新。
  valueLabel: 参数值
  valuePlaceholder: 输入参数值
  valueHint: 参数的值，可以是字符串或数字。
</i18n>
