<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpServer } from '~/composables/useMcp'
import DialogDelete from './McpServerDialogDelete.vue'
import DialogDisable from './McpServerDialogDisable.vue'
import DialogEnable from './McpServerDialogEnable.vue'
import DialogRename from './McpServerDialogRename.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const server = useMcpServer(props)
onMounted(server.fetchServer)

// --- Flags.
const showRenameDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
const showDeleteDialog = ref(false)
const isDisabled = computed(() => server.data.disabledAt !== null)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class-button="button-warning"
        icon="i-carbon:edit"
        :title="t('renameTitle')"
        :text="t('renameText')"
        :label="t('renameLabel')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        v-if="isDisabled"
        class="border-danger"
        class-button="button-success"
        icon="i-carbon:play"
        :title="t('enableTitle')"
        :text="t('enableText')"
        :label="t('enableLabel')"
        @click="() => showEnableDialog = true"
      />
      <AppPageFormAction
        v-else
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:pause"
        :title="t('disableTitle')"
        :text="t('disableText')"
        :label="t('disableLabel')"
        @click="() => showDisableDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :title="t('deleteTitle')"
        :text="t('deleteText')"
        :label="t('deleteLabel')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>

    <!-- Rename server dialog -->
    <DialogRename
      v-model="showRenameDialog"
      :workspace="workspace"
      :pool="pool"
      :name="name"
    />

    <!-- Enable dialog -->
    <DialogEnable
      v-model="showEnableDialog"
      :workspace="workspace"
      :pool="pool"
      :name="name"
    />

    <!-- Disable dialog -->
    <DialogDisable
      v-model="showDisableDialog"
      :workspace="workspace"
      :pool="pool"
      :name="name"
    />

    <!-- Delete dialog -->
    <DialogDelete
      v-model="showDeleteDialog"
      :workspace="workspace"
      :pool="pool"
      :name="name"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Critical operations that require careful consideration. These actions may disrupt active connections and affect server availability. Proceed with caution.
  renameTitle: Rename Server
  renameText: Update the server name and endpoint URL. This may temporarily interrupt connectivity and require client reconnection.
  renameLabel: Rename
  enableTitle: Enable Server
  enableText: Activate this server to accept new connections and process requests. The server will become available for use.
  enableLabel: Enable
  disableTitle: Disable Server
  disableText: Temporarily deactivate this server to prevent new connections. Active sessions will continue but no new requests will be accepted.
  disableLabel: Disable
  deleteTitle: Delete Server
  deleteText: Permanently remove this server from your workspace. This action cannot be undone and will terminate all associated connections.
  deleteLabel: Delete
fr:
  title: Zone de Danger
  text: Opérations critiques nécessitant une attention particulière. Ces actions peuvent perturber les connexions actives et affecter la disponibilité du serveur. Procédez avec prudence.
  renameTitle: Renommer le Serveur
  renameText: Mettre à jour le nom du serveur et l'URL du point de terminaison. Cela peut temporairement interrompre la connectivité et nécessiter une reconnexion du client.
  renameLabel: Renommer
  enableTitle: Activer le Serveur
  enableText: Activer ce serveur pour accepter de nouvelles connexions et traiter les demandes. Le serveur deviendra disponible pour utilisation.
  enableLabel: Activer
  disableTitle: Désactiver le Serveur
  disableText: Désactiver temporairement ce serveur pour empêcher de nouvelles connexions. Les sessions actives continueront mais aucune nouvelle demande ne sera acceptée.
  disableLabel: Désactiver
  deleteTitle: Supprimer le Serveur
  deleteText: Supprimer définitivement ce serveur de votre espace de travail. Cette action ne peut pas être annulée et terminera toutes les connexions associées.
  deleteLabel: Supprimer
de:
  title: Gefahrenzone
  text: Kritische Operationen, die sorgfältige Überlegung erfordern. Diese Aktionen können aktive Verbindungen stören und die Serververfügbarkeit beeinträchtigen. Vorsichtig vorgehen.
  renameTitle: Server Umbenennen
  renameText: Aktualisieren Sie den Servernamen und die Endpunkt-URL. Dies kann die Konnektivität vorübergehend unterbrechen und eine Client-Wiederverbindung erfordern.
  renameLabel: Umbenennen
  enableTitle: Server Aktivieren
  enableText: Aktivieren Sie diesen Server, um neue Verbindungen zu akzeptieren und Anfragen zu verarbeiten. Der Server wird zur Nutzung verfügbar.
  enableLabel: Aktivieren
  disableTitle: Server Deaktivieren
  disableText: Deaktivieren Sie diesen Server vorübergehend, um neue Verbindungen zu verhindern. Aktive Sitzungen werden fortgesetzt, aber keine neuen Anfragen werden akzeptiert.
  disableLabel: Deaktivieren
  deleteTitle: Server Löschen
  deleteText: Entfernen Sie diesen Server dauerhaft aus Ihrem Arbeitsbereich. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle zugehörigen Verbindungen.
  deleteLabel: Löschen
es:
  title: Zona de Peligro
  text: Operaciones críticas que requieren consideración cuidadosa. Estas acciones pueden interrumpir conexiones activas y afectar la disponibilidad del servidor. Proceda con precaución.
  renameTitle: Renombrar Servidor
  renameText: Actualizar el nombre del servidor y la URL del endpoint. Esto puede interrumpir temporalmente la conectividad y requerir reconexión del cliente.
  renameLabel: Renombrar
  enableTitle: Habilitar Servidor
  enableText: Activar este servidor para aceptar nuevas conexiones y procesar solicitudes. El servidor estará disponible para su uso.
  enableLabel: Habilitar
  disableTitle: Deshabilitar Servidor
  disableText: Desactivar temporalmente este servidor para prevenir nuevas conexiones. Las sesiones activas continuarán pero no se aceptarán nuevas solicitudes.
  disableLabel: Deshabilitar
  deleteTitle: Eliminar Servidor
  deleteText: Eliminar permanentemente este servidor de su espacio de trabajo. Esta acción no se puede deshacer y terminará todas las conexiones asociadas.
  deleteLabel: Eliminar
zh:
  title: 危险区域
  text: 需要仔细考虑的关键操作。这些操作可能会中断活动连接并影响服务器可用性。请谨慎操作。
  renameTitle: 重命名服务器
  renameText: 更新服务器名称和端点URL。这可能会暂时中断连接并需要客户端重新连接。
  renameLabel: 重命名
  enableTitle: 启用服务器
  enableText: 激活此服务器以接受新连接并处理请求。服务器将可供使用。
  enableLabel: 启用
  disableTitle: 禁用服务器
  disableText: 临时停用此服务器以防止新连接。活动会话将继续，但不会接受新请求。
  disableLabel: 禁用
  deleteTitle: 删除服务器
  deleteText: 从您的工作区中永久删除此服务器。此操作无法撤消，将终止所有相关连接。
  deleteLabel: 删除
</i18n>
