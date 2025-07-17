<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  workspace: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const name = ref('')

async function createPool() {
  await client.requestAttempt('POST /api/workspaces/:workspace/pools', {
    data: {
      workspace: props.workspace,
      name: name.value,
    },
    onSuccess: () => {
      alerts.success(t('successMessage', { name: name.value }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:folder-add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('dialogTitle', { workspace })"
    :text="t('dialogDescription', { workspace })"
    :label-cancel="t('cancelButton')"
    :label-confirm="t('confirmButton')"
    :disabled="!name"
    @confirm="() => createPool()">
    <InputText
      v-model="name"
      :label="t('nameLabel')"
      :placeholder="t('namePlaceholder')"
      :hint="t('nameHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  dialogTitle: Create pool in the **{workspace}** workspace
  dialogDescription: Set up a new MCP server pool to organize and manage your AI tools and integrations. Each pool has its own limits and permission management, making it easier to control access and usage across your workspace.
  cancelButton: Cancel
  confirmButton: Create Pool
  successMessage: 'Pool **{name}** has been created successfully'
  nameLabel: Pool Name
  namePlaceholder: data-science-tools
  nameHint: Choose a descriptive name using lowercase letters, numbers, and hyphens
fr:
  dialogTitle: Créer un groupe dans l’espace de travail **{workspace}**
  dialogDescription: Configurez un nouveau groupe de serveurs MCP pour organiser et gérer vos outils et intégrations AI. Chaque groupe dispose de ses propres limites et gestion des autorisations, facilitant le contrôle d'accès et l'utilisation dans votre espace de travail.
  cancelButton: Annuler
  confirmButton: Créer le groupe
  successMessage: 'Le groupe **{name}** a été créé avec succès'
  nameLabel: Nom du groupe
  namePlaceholder: data-science-tools
  nameHint: Choisissez un nom descriptif en utilisant des lettres minuscules, des chiffres et des tirets
de:
  dialogTitle: Erstellen eines Pools im Arbeitsbereich **{workspace}**
  dialogDescription: Richten Sie einen neuen MCP-Serverpool ein, um Ihre KI-Tools und Integrationen zu organisieren und zu verwalten. Jeder Pool hat seine eigenen Grenzen und Berechtigungsverwaltung, was die Kontrolle über den Zugriff und die Nutzung in Ihrem Arbeitsbereich erleichtert.
  cancelButton: Abbrechen
  confirmButton: Pool erstellen
  successMessage: 'Pool **{name}** wurde erfolgreich erstellt'
  nameLabel: Pool-Name
  namePlaceholder: z.B. data-science-tools
  nameHint: Wählen Sie einen beschreibenden Namen mit Kleinbuchstaben, Zahlen und Bindestrichen
es:
  dialogTitle: Crear grupo en el espacio de trabajo **{workspace}**
  dialogDescription: Configura un nuevo grupo de servidores MCP para organizar y gestionar tus herramientas e integraciones de IA. Cada grupo tiene sus propios límites y gestión de permisos, facilitando el control de acceso y uso en tu espacio de trabajo.
  cancelButton: Cancelar
  confirmButton: Crear grupo
  successMessage: 'El grupo **{name}** se ha creado con éxito'
  nameLabel: Nombre del grupo
  namePlaceholder: data-science-tools
  nameHint: Elige un nombre descriptivo usando letras minúsculas, números y guiones
zh:
  dialogTitle: 在工作区 **{workspace}** 中创建池
  dialogDescription: 设置一个新的 MCP 服务器池来组织和管理您的 AI 工具和集成。每个池都有自己的限制和权限管理，使您更容易控制工作区内的访问和使用。
  cancelButton: 取消
  confirmButton: 创建池
  successMessage: '池 **{name}** 已成功创建'
  nameLabel: 池名称
  namePlaceholder: data-science-tools
  nameHint: 使用小写字母、数字和连字符选择一个描述性名称
</i18n>
