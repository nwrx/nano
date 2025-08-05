<script setup lang="ts">
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useRunner } from '~/composables/useRunner'
import DialogDisable from './RunnerDialogDisable.vue'
import DialogEnable from './RunnerDialogEnable.vue'
import DialogRelease from './RunnerDialogRelease.vue'
import DialogRename from './RunnerDialogRename.vue'
import DialogSetAddress from './RunnerDialogSetAddress.vue'

const props = defineProps<{
  name: string
}>()

const { t } = useI18n()
const runner = useRunner(props)
const showSetAddressDialog = ref(false)
const showRenameDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
const showReleaseDialog = ref(false)

onMounted(() => {
  void runner.fetch()
  void runner.subscribeToEvents()
})

onBeforeUnmount(() => {
  void runner.unsubscribeFromEvents()
})
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
        class-button="button-warning"
        icon="i-carbon:edit"
        :title="t('renameTitle')"
        :text="t('renameText')"
        :label="t('renameLabel')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        v-if="runner.data.disabledAt"
        class="border-danger"
        class-button="button-success"
        icon="i-carbon:play-outline"
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
    :name="name"
  />

  <!-- Rename dialog -->
  <DialogRename
    v-model="showRenameDialog"
    :name="name"
  />

  <!-- Enable dialog -->
  <DialogEnable
    v-model="showEnableDialog"
    :name="name"
  />

  <!-- Disable dialog -->
  <DialogDisable
    v-model="showDisableDialog"
    :name="name"
  />

  <!-- Release dialog -->
  <DialogRelease
    v-model="showReleaseDialog"
    :name="name"
  />
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Critical operations that require careful consideration. These actions may disrupt active processes and affect system availability. Proceed with caution.
  setAddressTitle: Change Runner Address
  setAddressText: Update the network endpoint where this runner instance can be reached. This may temporarily interrupt connectivity.
  setAddressLabel: Change Address
  renameTitle: Rename Runner
  renameText: Change the identifier of this runner instance. This will update references throughout the system.
  renameLabel: Rename Runner
  enableTitle: Enable Runner
  enableText: Activate this runner to accept and process new execution requests. The runner will become available for workload distribution.
  enableLabel: Enable Runner
  disableTitle: Disable Runner
  disableText: Temporarily deactivate this runner to prevent new task assignments. Active processes will continue but no new work will be accepted.
  disableLabel: Disable Runner
  releaseTitle: Release Runner
  releaseText: Permanently remove this runner from your infrastructure. This action cannot be undone and will terminate all associated processes.
  releaseLabel: Release Runner
fr:
  title: Zone de Danger
  text: Opérations critiques nécessitant une attention particulière. Ces actions peuvent perturber les processus actifs et affecter la disponibilité du système. Procédez avec prudence.
  setAddressTitle: Changer l'Adresse du Serveur d'Exécution
  setAddressText: Mettre à jour le point de terminaison réseau où cette instance de serveur d'exécution peut être atteinte. Cela peut temporairement interrompre la connectivité.
  setAddressLabel: Changer l'Adresse
  renameTitle: Renommer le Serveur d'Exécution
  renameText: Changer l'identifiant de cette instance de serveur d'exécution. Cela mettra à jour les références dans tout le système.
  renameLabel: Renommer le Serveur d'Exécution
  enableTitle: Activer le Serveur d'Exécution
  enableText: Activer ce serveur d'exécution pour accepter et traiter de nouvelles demandes d'exécution. Le serveur d'exécution deviendra disponible pour la distribution de charge de travail.
  enableLabel: Activer le Serveur d'Exécution
  disableTitle: Désactiver le Serveur d'Exécution
  disableText: Désactiver temporairement ce serveur d'exécution pour empêcher les nouvelles affectations de tâches. Les processus actifs continueront mais aucun nouveau travail ne sera accepté.
  disableLabel: Désactiver le Serveur d'Exécution
  releaseTitle: Libérer le Serveur d'Exécution
  releaseText: Supprimer définitivement ce serveur d'exécution de votre infrastructure. Cette action ne peut pas être annulée et terminera tous les processus associés.
  releaseLabel: Libérer le Serveur d'Exécution
de:
  title: Gefahrenzone
  text: Kritische Operationen, die sorgfältige Überlegung erfordern. Diese Aktionen können aktive Prozesse stören und die Systemverfügbarkeit beeinträchtigen. Vorsichtig vorgehen.
  setAddressTitle: Ausführungsserver-Adresse Ändern
  setAddressText: Aktualisieren Sie den Netzwerk-Endpunkt, unter dem diese Ausführungsserver-Instanz erreichbar ist. Dies kann die Konnektivität vorübergehend unterbrechen.
  setAddressLabel: Adresse Ändern
  renameTitle: Ausführungsserver Umbenennen
  renameText: Ändern Sie den Bezeichner dieser Ausführungsserver-Instanz. Dies wird Referenzen im gesamten System aktualisieren.
  renameLabel: Ausführungsserver Umbenennen
  enableTitle: Ausführungsserver Aktivieren
  enableText: Aktivieren Sie diesen Ausführungsserver, um neue Ausführungsanfragen zu akzeptieren und zu verarbeiten. Der Ausführungsserver wird für die Workload-Verteilung verfügbar.
  enableLabel: Ausführungsserver Aktivieren
  disableTitle: Ausführungsserver Deaktivieren
  disableText: Deaktivieren Sie diesen Ausführungsserver vorübergehend, um neue Aufgabenzuweisungen zu verhindern. Aktive Prozesse werden fortgesetzt, aber keine neue Arbeit wird akzeptiert.
  disableLabel: Ausführungsserver Deaktivieren
  releaseTitle: Ausführungsserver Freigeben
  releaseText: Entfernen Sie diesen Ausführungsserver dauerhaft aus Ihrer Infrastruktur. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle zugehörigen Prozesse.
  releaseLabel: Ausführungsserver Freigeben
es:
  title: Zona de Peligro
  text: Operaciones críticas que requieren consideración cuidadosa. Estas acciones pueden interrumpir procesos activos y afectar la disponibilidad del sistema. Proceda con precaución.
  setAddressTitle: Cambiar Dirección del Servidor de Ejecución
  setAddressText: Actualizar el endpoint de red donde se puede alcanzar esta instancia del servidor de ejecución. Esto puede interrumpir temporalmente la conectividad.
  setAddressLabel: Cambiar Dirección
  renameTitle: Renombrar Servidor de Ejecución
  renameText: Cambiar el identificador de esta instancia del servidor de ejecución. Esto actualizará las referencias en todo el sistema.
  renameLabel: Renombrar Servidor de Ejecución
  enableTitle: Habilitar Servidor de Ejecución
  enableText: Activar este servidor de ejecución para aceptar y procesar nuevas solicitudes de ejecución. El servidor de ejecución estará disponible para la distribución de carga de trabajo.
  enableLabel: Habilitar Servidor de Ejecución
  disableTitle: Deshabilitar Servidor de Ejecución
  disableText: Desactivar temporalmente este servidor de ejecución para prevenir nuevas asignaciones de tareas. Los procesos activos continuarán pero no se aceptará trabajo nuevo.
  disableLabel: Deshabilitar Servidor de Ejecución
  releaseTitle: Liberar Servidor de Ejecución
  releaseText: Eliminar permanentemente este servidor de ejecución de su infraestructura. Esta acción no se puede deshacer y terminará todos los procesos asociados.
  releaseLabel: Liberar Servidor de Ejecución
zh:
  title: 危险区域
  text: 需要仔细考虑的关键操作。这些操作可能会中断活动进程并影响系统可用性。请谨慎操作。
  setAddressTitle: 更改执行服务器地址
  setAddressText: 更新可以访问此执行服务器实例的网络端点。这可能会暂时中断连接。
  setAddressLabel: 更改地址
  renameTitle: 重命名执行服务器
  renameText: 更改此执行服务器实例的标识符。这将更新整个系统中的引用。
  renameLabel: 重命名执行服务器
  enableTitle: 启用执行服务器
  enableText: 激活此执行服务器以接受和处理新的执行请求。执行服务器将可用于工作负载分发。
  enableLabel: 启用执行服务器
  disableTitle: 禁用执行服务器
  disableText: 临时停用此执行服务器以防止新的任务分配。活动进程将继续，但不会接受新工作。
  disableLabel: 禁用执行服务器
  releaseTitle: 释放执行服务器
  releaseText: 从您的基础设施中永久删除此执行服务器。此操作无法撤消，将终止所有相关进程。
  releaseLabel: 释放执行服务器
</i18n>
