<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import VaultSearch from '~/components/vault/VaultSearch.vue'

const props = defineProps<{
  workspace: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- State.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const vault = ref('')
const name = ref('')
const value = ref('')
const isOpen = defineModel<boolean>({ default: false })

// --- Methods.
async function createVariable() {
  await client.requestAttempt(
    'POST /workspaces/:workspace/vaults/:vault/variables',
    {
      data: {
        workspace: props.workspace,
        vault: vault.value,
        name: name.value,
        value: value.value,
      },
      onSuccess: () => {
        emit('submit')
        alerts.success(t('success'))
      },
    },
  )
}

// --- Lifecycle.
watch(isOpen, () => {
  vault.value = ''
  name.value = ''
  value.value = ''
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { workspace })"
    :text="t('text', { workspace })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => createVariable()">
    <div class="space-y-4">

      <!-- Vault selector -->
      <VaultSearch
        v-model="vault"
        :workspace="workspace"
      />

      <!-- Variable name -->
      <InputText
        v-model="name"
        :placeholder="t('formNamePlaceholder')"
        :label="t('formNameLabel')"
        :hint="t('formNameHint')"
      />

      <!-- Variable value -->
      <InputText
        v-model="value"
        type="textarea"
        :placeholder="t('formValuePlaceholder')"
        :label="t('formValueLabel')"
        :hint="t('formValueHint')"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Create a new variable in the **{workspace}** workspace
  text: Create a variable to store sensitive information that can be securely used across your workspace.
  cancel: Cancel
  confirm: Create variable
  success: Variable created successfully
  formNameLabel: Variable name
  formNamePlaceholder: Enter variable name
  formNameHint: Use only alphanumeric characters, underscores, and hyphens
  formValueLabel: Variable value
  formValuePlaceholder: Enter the secret value
  formValueHint: This value will be securely stored and accessible only to authorized users
fr:
  title: Créer une nouvelle variable dans l'espace de travail **{workspace}**
  text: Créez une variable pour stocker des informations sensibles qui peuvent être utilisées en toute sécurité dans votre espace de travail.
  cancel: Annuler
  confirm: Créer la variable
  success: Variable créée avec succès
  formNameLabel: Nom de la variable
  formNamePlaceholder: Entrez le nom de la variable
  formNameHint: Utilisez uniquement des caractères alphanumériques, des traits de soulignement et des traits d'union
  formValueLabel: Valeur de la variable
  formValuePlaceholder: Entrez la valeur secrète
  formValueHint: Cette valeur sera stockée de manière sécurisée et accessible uniquement aux utilisateurs autorisés
de:
  title: Erstellen Sie eine neue Variable im Arbeitsbereich **{workspace}**
  text: Erstellen Sie eine Variable, um sensible Informationen zu speichern, die sicher in Ihrem Arbeitsbereich verwendet werden können.
  cancel: Abbrechen
  confirm: Variable erstellen
  success: Variable erfolgreich erstellt
  formNameLabel: Variablenname
  formNamePlaceholder: Variablennamen eingeben
  formNameHint: Verwenden Sie nur alphanumerische Zeichen, Unterstriche und Bindestriche
  formValueLabel: Variablenwert
  formValuePlaceholder: Geben Sie den geheimen Wert ein
  formValueHint: Dieser Wert wird sicher gespeichert und ist nur für autorisierte Benutzer zugänglich
es:
  title: Crear una nueva variable en el espacio de trabajo **{workspace}**
  text: Cree una variable para almacenar información sensible que pueda utilizarse de forma segura en su espacio de trabajo.
  cancel: Cancelar
  confirm: Crear variable
  success: Variable creada con éxito
  formNameLabel: Nombre de variable
  formNamePlaceholder: Ingrese el nombre de la variable
  formNameHint: Utilice solo caracteres alfanuméricos, guiones bajos y guiones
  formValueLabel: Valor de la variable
  formValuePlaceholder: Ingrese el valor secreto
  formValueHint: Este valor se almacenará de forma segura y solo será accesible para usuarios autorizados
zh:
  title: 在 **{workspace}** 工作区中创建新变量
  text: 创建一个变量来存储敏感信息，可以在您的工作区中安全地使用。
  cancel: 取消
  confirm: 创建变量
  success: 变量创建成功
  formNameLabel: 变量名称
  formNamePlaceholder: 输入变量名称
  formNameHint: 仅使用字母数字字符、下划线和连字符
  formValueLabel: 变量值
  formValuePlaceholder: 输入密钥值
  formValueHint: 此值将被安全存储，只有授权用户才能访问
</i18n>
