<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import AppPageFormAction from '../app/AppPageForm.Action.vue'
import AppPageFormActions from '../app/AppPageForm.Actions.vue'
import AppPageForm from '../app/AppPageForm.vue'
import DialogRelease from './McpManagerDialogRelease.vue'
import DialogSetAddress from './McpManagerDialogSetAddress.vue'
import DialogToggle from './McpManagerDialogToggle.vue'

const props = defineProps<{
  manager: McpManagerObject
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()

const showSetAddressDialog = ref(false)
const showToggleDialog = ref(false)
const showReleaseDialog = ref(false)
const isDisabled = computed(() => props.manager.disabledAt)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class-button="button-warning"
        icon="i-carbon:network-1"
        :title="t('setAddressTitle')"
        :text="t('setAddressText')"
        :label="t('setAddressLabel')"
        @click="() => showSetAddressDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        :class-button="isDisabled ? 'button-success' : 'button-danger'"
        :icon="isDisabled ? 'i-carbon:play' : 'i-carbon:pause'"
        :title="isDisabled ? t('enableTitle') : t('disableTitle')"
        :text="isDisabled ? t('enableText') : t('disableText')"
        :label="isDisabled ? t('enableLabel') : t('disableLabel')"
        @click="() => showToggleDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :title="t('releaseTitle')"
        :text="t('releaseText')"
        :label="t('releaseLabel')"
        @click="() => showReleaseDialog = true"
      />
    </AppPageFormActions>
  </AppPageForm>

  <!-- Set address dialog -->
  <DialogSetAddress
    v-model="showSetAddressDialog"
    :manager="manager"
    @submit="() => emit('refresh')"
  />

  <!-- Enable/Disable dialog -->
  <DialogToggle
    v-model="showToggleDialog"
    :manager="manager"
    @submit="() => emit('refresh')"
  />

  <!-- Release dialog -->
  <DialogRelease
    v-model="showReleaseDialog"
    :manager="manager"
    @submit="() => emit('refresh')"
  />
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Critical operations that require careful consideration. These actions may disrupt active MCP infrastructure and affect gateway coordination. Proceed with caution.
  setAddressTitle: Change Manager Address
  setAddressText: Update the network endpoint where this MCP manager instance can be reached. This may temporarily interrupt connectivity with gateways.
  setAddressLabel: Change Address
  enableTitle: Enable Manager
  enableText: Activate this manager to coordinate gateways and accept new MCP resource assignments. The manager will become available for infrastructure orchestration.
  enableLabel: Enable Manager
  disableTitle: Disable Manager
  disableText: Temporarily deactivate this manager to prevent new gateway coordination. Active gateways will continue but no new assignments will be accepted.
  disableLabel: Disable Manager
  releaseTitle: Release Manager
  releaseText: Permanently remove this manager from your MCP infrastructure. This action cannot be undone and will terminate all gateway associations.
  releaseLabel: Release Manager
fr:
  title: Zone de Danger
  text: Opérations critiques nécessitant une attention particulière. Ces actions peuvent perturber l'infrastructure MCP active et affecter la coordination des passerelles. Procédez avec prudence.
  setAddressTitle: Changer l'Adresse du Gestionnaire
  setAddressText: Mettre à jour le point de terminaison réseau où cette instance de gestionnaire MCP peut être atteinte. Cela peut temporairement interrompre la connectivité avec les passerelles.
  setAddressLabel: Changer l'Adresse
  enableTitle: Activer le Gestionnaire
  enableText: Activer ce gestionnaire pour coordonner les passerelles et accepter de nouvelles affectations de ressources MCP. Le gestionnaire deviendra disponible pour l'orchestration d'infrastructure.
  enableLabel: Activer le Gestionnaire
  disableTitle: Désactiver le Gestionnaire
  disableText: Désactiver temporairement ce gestionnaire pour empêcher la coordination de nouvelles passerelles. Les passerelles actives continueront mais aucune nouvelle affectation ne sera acceptée.
  disableLabel: Désactiver le Gestionnaire
  releaseTitle: Libérer le Gestionnaire
  releaseText: Supprimer définitivement ce gestionnaire de votre infrastructure MCP. Cette action ne peut pas être annulée et terminera toutes les associations de passerelles.
  releaseLabel: Libérer le Gestionnaire
de:
  title: Gefahrenzone
  text: Kritische Operationen, die sorgfältige Überlegung erfordern. Diese Aktionen können die aktive MCP-Infrastruktur stören und die Gateway-Koordination beeinträchtigen. Vorsichtig vorgehen.
  setAddressTitle: Manager-Adresse Ändern
  setAddressText: Aktualisieren Sie den Netzwerk-Endpunkt, unter dem diese MCP-Manager-Instanz erreichbar ist. Dies kann die Konnektivität mit Gateways vorübergehend unterbrechen.
  setAddressLabel: Adresse Ändern
  enableTitle: Manager Aktivieren
  enableText: Aktivieren Sie diesen Manager, um Gateways zu koordinieren und neue MCP-Ressourcenzuweisungen zu akzeptieren. Der Manager wird für die Infrastruktur-Orchestrierung verfügbar.
  enableLabel: Manager Aktivieren
  disableTitle: Manager Deaktivieren
  disableText: Deaktivieren Sie diesen Manager vorübergehend, um neue Gateway-Koordination zu verhindern. Aktive Gateways werden fortgesetzt, aber keine neuen Zuweisungen werden akzeptiert.
  disableLabel: Manager Deaktivieren
  releaseTitle: Manager Freigeben
  releaseText: Entfernen Sie diesen Manager dauerhaft aus Ihrer MCP-Infrastruktur. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle Gateway-Zuordnungen.
  releaseLabel: Manager Freigeben
es:
  title: Zona de Peligro
  text: Operaciones críticas que requieren consideración cuidadosa. Estas acciones pueden interrumpir la infraestructura MCP activa y afectar la coordinación de puertas de enlace. Proceda con precaución.
  setAddressTitle: Cambiar Dirección del Administrador
  setAddressText: Actualizar el endpoint de red donde se puede alcanzar esta instancia del administrador MCP. Esto puede interrumpir temporalmente la conectividad con las puertas de enlace.
  setAddressLabel: Cambiar Dirección
  enableTitle: Habilitar Administrador
  enableText: Activar este administrador para coordinar puertas de enlace y aceptar nuevas asignaciones de recursos MCP. El administrador estará disponible para la orquestación de infraestructura.
  enableLabel: Habilitar Administrador
  disableTitle: Deshabilitar Administrador
  disableText: Desactivar temporalmente este administrador para prevenir nueva coordinación de puertas de enlace. Las puertas de enlace activas continuarán pero no se aceptarán nuevas asignaciones.
  disableLabel: Deshabilitar Administrador
  releaseTitle: Liberar Administrador
  releaseText: Eliminar permanentemente este administrador de su infraestructura MCP. Esta acción no se puede deshacer y terminará todas las asociaciones de puertas de enlace.
  releaseLabel: Liberar Administrador
zh:
  title: 危险区域
  text: 需要仔细考虑的关键操作。这些操作可能会中断活跃的MCP基础设施并影响网关协调。请谨慎操作。
  setAddressTitle: 更改管理器地址
  setAddressText: 更新可以访问此MCP管理器实例的网络端点。这可能会暂时中断与网关的连接。
  setAddressLabel: 更改地址
  enableTitle: 启用管理器
  enableText: 激活此管理器以协调网关并接受新的MCP资源分配。管理器将可用于基础设施编排。
  enableLabel: 启用管理器
  disableTitle: 禁用管理器
  disableText: 临时停用此管理器以防止新的网关协调。活动网关将继续运行，但不会接受新的分配。
  disableLabel: 禁用管理器
  releaseTitle: 释放管理器
  releaseText: 从您的MCP基础设施中永久删除此管理器。此操作无法撤消，将终止所有网关关联。
  releaseLabel: 释放管理器
</i18n>
