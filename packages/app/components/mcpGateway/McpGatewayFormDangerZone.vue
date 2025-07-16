<script setup lang="ts">
import type { McpGatewayObject } from '@nwrx/nano-api'
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import DialogDisable from './McpGatewayDialogDisable.vue'
import DialogEnable from './McpGatewayDialogEnable.vue'
import DialogRemove from './McpGatewayDialogRemove.vue'

defineProps<{
  gateway: McpGatewayObject
  manager: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const showRemoveDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        v-if="gateway.disabledAt"
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
        :title="t('removeTitle')"
        :text="t('removeText')"
        :label="t('removeLabel')"
        @click="() => showRemoveDialog = true"
      />
    </AppPageFormActions>
  </AppPageForm>

  <!-- Enable/Disable dialog -->
  <DialogEnable
    v-model="showEnableDialog"
    :gateway="gateway"
    :manager="manager"
    @submit="() => emit('refresh')"
  />

  <!--  Disable dialog -->
  <DialogDisable
    v-model="showDisableDialog"
    :gateway="gateway"
    :manager="manager"
    @submit="() => emit('refresh')"
  />

  <!-- Remove dialog -->
  <DialogRemove
    v-model="showRemoveDialog"
    :gateway="gateway"
    :manager="manager"
    @submit="() => emit('refresh')"
  />
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Critical operations that require careful consideration. These actions may disrupt active MCP server connections and affect gateway functionality. Proceed with caution.
  enableTitle: Enable Gateway
  enableText: Activate this gateway to accept and process MCP server connections. The gateway will become available for handling protocol communication.
  enableLabel: Enable Gateway
  disableTitle: Disable Gateway
  disableText: Temporarily deactivate this gateway to prevent new server connections. Active connections will continue but no new connections will be accepted.
  disableLabel: Disable Gateway
  removeTitle: Remove Gateway
  removeText: Remove this gateway from the manager. This will unassign the gateway but not delete it from the system. Active connections will be terminated.
  removeLabel: Remove Gateway
fr:
  title: Zone de Danger
  text: Opérations critiques nécessitant une attention particulière. Ces actions peuvent perturber les connexions actives des serveurs MCP et affecter la fonctionnalité de la passerelle. Procédez avec prudence.
  enableTitle: Activer la Passerelle
  enableText: Activer cette passerelle pour accepter et traiter les connexions de serveur MCP. La passerelle deviendra disponible pour gérer la communication de protocole.
  enableLabel: Activer la Passerelle
  disableTitle: Désactiver la Passerelle
  disableText: Désactiver temporairement cette passerelle pour empêcher de nouvelles connexions de serveur. Les connexions actives continueront mais aucune nouvelle connexion ne sera acceptée.
  disableLabel: Désactiver la Passerelle
  removeTitle: Supprimer la Passerelle
  removeText: Supprimer cette passerelle du gestionnaire. Cela désassignera la passerelle mais ne la supprimera pas du système. Les connexions actives seront terminées.
  removeLabel: Supprimer la Passerelle
de:
  title: Gefahrenzone
  text: Kritische Operationen, die sorgfältige Überlegung erfordern. Diese Aktionen können aktive MCP-Server-Verbindungen stören und die Gateway-Funktionalität beeinträchtigen. Vorsichtig vorgehen.
  enableTitle: Gateway Aktivieren
  enableText: Aktivieren Sie dieses Gateway, um MCP-Server-Verbindungen zu akzeptieren und zu verarbeiten. Das Gateway wird für die Behandlung der Protokollkommunikation verfügbar.
  enableLabel: Gateway Aktivieren
  disableTitle: Gateway Deaktivieren
  disableText: Deaktivieren Sie dieses Gateway vorübergehend, um neue Server-Verbindungen zu verhindern. Aktive Verbindungen werden fortgesetzt, aber keine neuen Verbindungen werden akzeptiert.
  disableLabel: Gateway Deaktivieren
  removeTitle: Gateway Entfernen
  removeText: Entfernen Sie dieses Gateway vom Manager. Dies wird das Gateway nicht zuweisen, aber nicht aus dem System löschen. Aktive Verbindungen werden beendet.
  removeLabel: Gateway Entfernen
es:
  title: Zona de Peligro
  text: Operaciones críticas que requieren consideración cuidadosa. Estas acciones pueden interrumpir las conexiones activas del servidor MCP y afectar la funcionalidad de la puerta de enlace. Proceda con precaución.
  enableTitle: Habilitar Puerta de Enlace
  enableText: Activar esta puerta de enlace para aceptar y procesar conexiones de servidor MCP. La puerta de enlace estará disponible para manejar la comunicación de protocolo.
  enableLabel: Habilitar Puerta de Enlace
  disableTitle: Deshabilitar Puerta de Enlace
  disableText: Desactivar temporalmente esta puerta de enlace para prevenir nuevas conexiones de servidor. Las conexiones activas continuarán pero no se aceptarán nuevas conexiones.
  disableLabel: Deshabilitar Puerta de Enlace
  removeTitle: Eliminar Puerta de Enlace
  removeText: Eliminar esta puerta de enlace del administrador. Esto desasignará la puerta de enlace pero no la eliminará del sistema. Las conexiones activas serán terminadas.
  removeLabel: Eliminar Puerta de Enlace
zh:
  title: 危险区域
  text: 需要仔细考虑的关键操作。这些操作可能会中断活跃的MCP服务器连接并影响网关功能。请谨慎操作。
  enableTitle: 启用网关
  enableText: 激活此网关以接受和处理MCP服务器连接。网关将可用于处理协议通信。
  enableLabel: 启用网关
  disableTitle: 禁用网关
  disableText: 临时停用此网关以防止新的服务器连接。活动连接将继续，但不会接受新连接。
  disableLabel: 禁用网关
  removeTitle: 移除网关
  removeText: 从管理器中移除此网关。这将取消分配网关但不会从系统中删除它。活动连接将被终止。
  removeLabel: 移除网关
</i18n>
