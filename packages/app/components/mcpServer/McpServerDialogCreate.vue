<script setup lang="ts">
import type { InputText } from '#components'

const props = defineProps<{
  workspace: string
  pool: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const isOpen = defineModel({ default: false })
const client = useClient()
const alerts = useAlerts()
const name = ref('')

async function createServer() {
  await client.requestAttempt('POST /api/workspaces/:workspace/pools/:pool/servers', {
    data: {
      workspace: props.workspace,
      pool: props.pool,
      name: name.value,
    },
    onSuccess: () => {
      alerts.success(t('successMessage', { name: name.value }))
      emit('submit')
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('dialogTitle', { workspace, pool })"
    :text="t('dialogDescription', { workspace, pool })"
    :label-cancel="t('cancelButton')"
    :label-confirm="t('confirmButton')"
    :disabled="!name"
    @confirm="() => createServer()">
    <InputText
      ref="input"
      v-model="name"
      :label="t('nameLabel')"
      :placeholder="t('namePlaceholder')"
      :hint="t('nameHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  dialogTitle: Create MCP Server in **{workspace}/{pool}**
  dialogDescription: Deploy a new server instance within the **{workspace}/{pool}** pool. Each server operates in an isolated environment with dedicated resources, scaling dynamically based on demand. Servers remain active during use and enter dormant state when idle. Granular permission controls and resource limits can be configured per your requirements.
  cancelButton: Cancel
  confirmButton: Create Server
  successMessage: 'MCP server **{name}** has been created successfully'
  nameLabel: Server Name
  namePlaceholder: weather-forecast
  nameHint: Choose a descriptive name using lowercase letters, numbers, and hyphens
fr:
  dialogTitle: Créer un serveur MCP dans **{workspace}/{pool}**
  dialogDescription: Déployez une nouvelle instance de serveur dans le groupe **{workspace}/{pool}**. Chaque serveur fonctionne dans un environnement isolé avec des ressources dédiées, s'adaptant dynamiquement à la demande. Les serveurs restent actifs lors de l'utilisation et entrent en état dormant lorsqu'inactifs. Des contrôles d'autorisation granulaires et des limites de ressources peuvent être configurés selon vos exigences.
  cancelButton: Annuler
  confirmButton: Créer le serveur
  successMessage: 'Le serveur MCP **{name}** a été créé avec succès'
  nameLabel: Nom du serveur
  namePlaceholder: prevision-meteo
  nameHint: Choisissez un nom descriptif en utilisant des lettres minuscules, des chiffres et des tirets
de:
  dialogTitle: MCP-Server in **{workspace}/{pool}** erstellen
  dialogDescription: Stellen Sie eine neue Server-Instanz im Pool **{workspace}/{pool}** bereit. Jeder Server arbeitet in einer isolierten Umgebung mit dedizierten Ressourcen und skaliert dynamisch je nach Bedarf. Server bleiben bei Nutzung aktiv und wechseln in den Ruhezustand, wenn sie nicht verwendet werden. Granulare Berechtigungskontrollen und Ressourcenlimits können nach Ihren Anforderungen konfiguriert werden.
  cancelButton: Abbrechen
  confirmButton: Server erstellen
  successMessage: 'MCP-Server **{name}** wurde erfolgreich erstellt'
  nameLabel: Server-Name
  namePlaceholder: wetter-vorhersage
  nameHint: Wählen Sie einen beschreibenden Namen mit Kleinbuchstaben, Zahlen und Bindestrichen
es:
  dialogTitle: Crear servidor MCP en **{workspace}/{pool}**
  dialogDescription: Implemente una nueva instancia de servidor dentro del grupo **{workspace}/{pool}**. Cada servidor opera en un entorno aislado con recursos dedicados, escalando dinámicamente según la demanda. Los servidores permanecen activos durante el uso y entran en estado inactivo cuando no se utilizan. Se pueden configurar controles de permisos granulares y límites de recursos según sus requisitos.
  cancelButton: Cancelar
  confirmButton: Crear servidor
  successMessage: 'El servidor MCP **{name}** se ha creado con éxito'
  nameLabel: Nombre del servidor
  namePlaceholder: pronostico-del-tiempo
  nameHint: Elija un nombre descriptivo utilizando letras minúsculas, números y guiones
zh:
  dialogTitle: 在 **{workspace}/{pool}** 中创建 MCP 服务器
  dialogDescription: 在 **{workspace}/{pool}** 池中部署新的服务器实例。每个服务器在独立环境中运行，具有专用资源，根据需求动态扩展。服务器在使用时保持活跃状态，空闲时进入休眠状态。可根据您的要求配置细粒度权限控制和资源限制。
  cancelButton: 取消
  confirmButton: 创建服务器
  successMessage: 'MCP 服务器 **{name}** 已成功创建'
  nameLabel: 服务器名称
  namePlaceholder: tianqi-yubao
  nameHint: 使用小写字母、数字和连字符选择一个描述性名称
</i18n>
