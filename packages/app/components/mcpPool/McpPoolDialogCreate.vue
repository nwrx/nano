<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpPools } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
}>()

// --- State.
const { t } = useI18n()
const isOpen = defineModel({ default: false })
const pools = useMcpPools(props)
const name = ref('')
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
    @confirm="() => pools.createPool(name)">

    <!-- Set name -->
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
  dialogTitle: Create MCP Pool in **{workspace}**
  dialogDescription: Deploy a new pool within the **{workspace}** workspace. Each pool manages server instances with isolated environments, dedicated resources, and scaling based on demand. Pools define server limits, resource allocations, and idle timeout settings that apply to all servers within them.
  cancelButton: Cancel
  confirmButton: Create Pool
  successMessage: 'MCP pool **{name}** has been created successfully'
  nameLabel: Pool Name
  namePlaceholder: default-pool
  nameHint: Choose a descriptive name using lowercase letters, numbers, and hyphens
fr:
  dialogTitle: Créer un pool MCP dans **{workspace}**
  dialogDescription: Déployez un nouveau pool dans l'espace de travail **{workspace}**. Chaque pool gère des instances de serveur avec des environnements isolés, des ressources dédiées et une mise à l'échelle basée sur la demande. Les pools définissent les limites de serveur, les allocations de ressources et les paramètres de délai d'inactivité qui s'appliquent à tous les serveurs qu'ils contiennent.
  cancelButton: Annuler
  confirmButton: Créer le pool
  successMessage: 'Le pool MCP **{name}** a été créé avec succès'
  nameLabel: Nom du pool
  namePlaceholder: pool-defaut
  nameHint: Choisissez un nom descriptif en utilisant des lettres minuscules, des chiffres et des tirets
de:
  dialogTitle: MCP-Pool in **{workspace}** erstellen
  dialogDescription: Stellen Sie einen neuen Pool im Arbeitsbereich **{workspace}** bereit. Jeder Pool verwaltet Server-Instanzen mit isolierten Umgebungen, dedizierten Ressourcen und Skalierung basierend auf Nachfrage. Pools definieren Server-Limits, Ressourcenzuweisungen und Idle-Timeout-Einstellungen, die für alle Server innerhalb gelten.
  cancelButton: Abbrechen
  confirmButton: Pool erstellen
  successMessage: 'MCP-Pool **{name}** wurde erfolgreich erstellt'
  nameLabel: Pool-Name
  namePlaceholder: standard-pool
  nameHint: Wählen Sie einen beschreibenden Namen mit Kleinbuchstaben, Zahlen und Bindestrichen
es:
  dialogTitle: Crear pool MCP en **{workspace}**
  dialogDescription: Implemente un nuevo pool dentro del espacio de trabajo **{workspace}**. Cada pool gestiona instancias de servidor con entornos aislados, recursos dedicados y escalado basado en demanda. Los pools definen límites de servidor, asignaciones de recursos y configuraciones de tiempo de inactividad que se aplican a todos los servidores dentro de ellos.
  cancelButton: Cancelar
  confirmButton: Crear pool
  successMessage: 'El pool MCP **{name}** se ha creado con éxito'
  nameLabel: Nombre del pool
  namePlaceholder: pool-predeterminado
  nameHint: Elija un nombre descriptivo utilizando letras minúsculas, números y guiones
zh:
  dialogTitle: 在 **{workspace}** 中创建 MCP 池
  dialogDescription: 在 **{workspace}** 工作区中部署新池。每个池管理具有隔离环境、专用资源和基于需求扩展的服务器实例。池定义服务器限制、资源分配和空闲超时设置，适用于其中的所有服务器。
  cancelButton: 取消
  confirmButton: 创建池
  successMessage: 'MCP 池 **{name}** 已成功创建'
  nameLabel: 池名称
  namePlaceholder: 默认池
  nameHint: 使用小写字母、数字和连字符选择一个描述性名称
</i18n>
