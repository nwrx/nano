<script setup lang="ts">
const props = defineProps<{
  workspace: string
  variable: string
  vault: string
}>()
const emit = defineEmits<{
  'submit': []
}>()

const isOpen = defineModel<boolean>({ default: false })

// --- State.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const value = ref('')

// --- Methods.
async function updateVariable() {
  await client.requestAttempt(
    'PUT /workspaces/:workspace/vaults/:vault/variables/:variable',
    {
      data: {
        workspace: props.workspace,
        variable: props.variable,
        vault: props.vault,
        value: value.value,
      },
      onSuccess: () => {
        emit('submit')
        alerts.success(t('success', { ...props }))
        isOpen.value = false
      },
    },
  )
}

// --- Lifecycle.
watch(isOpen, () => value.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { ...props })"
    :text="t('text', { ...props })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => updateVariable()">

    <!-- Update value field -->
    <InputText
      v-model="value"
      type="textarea"
      :placeholder="t('valuePlaceholder')"
      :hint="t('valueHint')"
      class-input="h-48"
      required
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Update the value of the **{workspace}/{vault}/{variable}** variable
  text: You can update the value of this variable. Keep in mind that this action is irreversible and will affect all flows that depend on this variable.
  cancel: Keep the current value
  confirm: Update variable value
  success: The value of the **{workspace}/{vault}/{variable}** variable has been updated successfully
  infoVariable: Variable name
  infoVault: Vault
  valuePlaceholder: Enter the new value for this variable
  valueHint: This value will replace the current value of the variable
fr:
  title: Mettre à jour la valeur de la variable **{workspace}/{vault}/{variable}**
  text: Vous pouvez mettre à jour la valeur de cette variable. Gardez à l'esprit que cette action est irréversible et affectera tous les flux qui dépendent de cette variable.
  cancel: Conserver la valeur actuelle
  confirm: Mettre à jour la valeur de la variable
  success: La valeur de la variable **{workspace}/{vault}/{variable}** a été mise à jour avec succès
  infoVariable: Nom de la variable
  infoVault: Coffre-fort
  valuePlaceholder: Entrez la nouvelle valeur pour cette variable
  valueHint: Cette valeur remplacera la valeur actuelle de la variable
de:
  title: Aktualisieren Sie den Wert der Variablen **{workspace}/{vault}/{variable}**
  text: Sie können den Wert dieser Variablen aktualisieren. Beachten Sie, dass diese Aktion irreversibel ist und alle Flows beeinflusst, die von dieser Variablen abhängen.
  cancel: Aktuellen Wert beibehalten
  confirm: Variablenwert aktualisieren
  success: Der Wert der Variablen **{workspace}/{vault}/{variable}** wurde erfolgreich aktualisiert
  infoVariable: Variablenname
  infoVault: Tresor
  valuePlaceholder: Geben Sie den neuen Wert für diese Variable ein
  valueHint: Dieser Wert ersetzt den aktuellen Wert der Variablen
es:
  title: Actualizar el valor de la variable **{workspace}/{vault}/{variable}**
  text: Puede actualizar el valor de esta variable. Tenga en cuenta que esta acción es irreversible y afectará a todos los flujos que dependen de esta variable.
  cancel: Mantener el valor actual
  confirm: Actualizar valor de variable
  success: El valor de la variable **{workspace}/{vault}/{variable}** se ha actualizado correctamente
  infoVariable: Nombre de variable
  infoVault: Bóveda
  valuePlaceholder: Ingrese el nuevo valor para esta variable
  valueHint: Este valor reemplazará el valor actual de la variable
zh:
  title: 更新变量 **{workspace}/{vault}/{variable}** 的值
  text: 您可以更新此变量的值。请记住，此操作不可逆，并且会影响依赖于此变量的所有流程。
  cancel: 保留当前值
  confirm: 更新变量值
  success: 变量 **{workspace}/{vault}/{variable}** 的值已成功更新
  infoVariable: 变量名称
  infoVault: 保险库
  valuePlaceholder: 输入此变量的新值
  valueHint: 此值将替换变量的当前值
</i18n>
