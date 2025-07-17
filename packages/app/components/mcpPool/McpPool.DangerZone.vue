<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import McpPoolDialogDelete from './McpPool.DialogDelete.vue'
import McpPoolDialogRename from './McpPool.DialogRename.vue'
import McpPoolDialogToggle from './McpPool.DialogToggle.vue'

const props = defineProps<{
  pool: McpPoolObject
  workspace: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()

const showRenameDialog = ref(false)
const showToggleDialog = ref(false)
const showDeleteDialog = ref(false)
const isDisabled = computed(() => props.pool.deletedAt)
</script>

<template>
  <AppPageForm
    vertical
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
        :title="t('deleteTitle')"
        :text="t('deleteText')"
        :label="t('deleteLabel')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>

    <!-- Rename pool dialog -->
    <McpPoolDialogRename
      v-model="showRenameDialog"
      :pool="pool"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />

    <!-- Enable/Disable dialog -->
    <McpPoolDialogToggle
      v-model="showToggleDialog"
      :pool="pool"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />

    <!-- Delete dialog -->
    <McpPoolDialogDelete
      v-model="showDeleteDialog"
      :pool="pool"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />

  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Critical operations that require careful consideration. These actions may disrupt active servers and affect pool availability. Proceed with caution.
  renameTitle: Rename Pool
  renameText: Update the pool name and endpoint URL. This may temporarily interrupt server connectivity and require client reconnection.
  renameLabel: Rename Pool
  enableTitle: Enable Pool
  enableText: Activate this pool to allow new servers to be created and managed. The pool will become available for use.
  enableLabel: Enable Pool
  disableTitle: Disable Pool
  disableText: Temporarily deactivate this pool to prevent new servers from being created. Existing servers will continue to run but no new servers will be accepted.
  disableLabel: Disable Pool
  deleteTitle: Delete Pool
  deleteText: Permanently remove this pool from your workspace. This action cannot be undone and will terminate all servers in the pool.
  deleteLabel: Delete Pool
fr:
  title: Zone de Danger
  text: Opérations critiques nécessitant une attention particulière. Ces actions peuvent perturber les serveurs actifs et affecter la disponibilité du pool. Procédez avec prudence.
  renameTitle: Renommer le Pool
  renameText: Mettre à jour le nom du pool et l'URL du point de terminaison. Cela peut temporairement interrompre la connectivité des serveurs et nécessiter une reconnexion du client.
  renameLabel: Renommer le Pool
  enableTitle: Activer le Pool
  enableText: Activer ce pool pour permettre la création et la gestion de nouveaux serveurs. Le pool deviendra disponible pour utilisation.
  enableLabel: Activer le Pool
  disableTitle: Désactiver le Pool
  disableText: Désactiver temporairement ce pool pour empêcher la création de nouveaux serveurs. Les serveurs existants continueront à fonctionner mais aucun nouveau serveur ne sera accepté.
  disableLabel: Désactiver le Pool
  deleteTitle: Supprimer le Pool
  deleteText: Supprimer définitivement ce pool de votre espace de travail. Cette action ne peut pas être annulée et terminera tous les serveurs du pool.
  deleteLabel: Supprimer le Pool
de:
  title: Gefahrenzone
  text: Kritische Operationen, die sorgfältige Überlegung erfordern. Diese Aktionen können aktive Server stören und die Pool-Verfügbarkeit beeinträchtigen. Vorsichtig vorgehen.
  renameTitle: Pool Umbenennen
  renameText: Aktualisieren Sie den Pool-Namen und die Endpunkt-URL. Dies kann die Server-Konnektivität vorübergehend unterbrechen und eine Client-Wiederverbindung erfordern.
  renameLabel: Pool Umbenennen
  enableTitle: Pool Aktivieren
  enableText: Aktivieren Sie diesen Pool, um die Erstellung und Verwaltung neuer Server zu ermöglichen. Der Pool wird zur Nutzung verfügbar.
  enableLabel: Pool Aktivieren
  disableTitle: Pool Deaktivieren
  disableText: Deaktivieren Sie diesen Pool vorübergehend, um die Erstellung neuer Server zu verhindern. Bestehende Server werden weiterlaufen, aber keine neuen Server werden akzeptiert.
  disableLabel: Pool Deaktivieren
  deleteTitle: Pool Löschen
  deleteText: Entfernen Sie diesen Pool dauerhaft aus Ihrem Arbeitsbereich. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle Server im Pool.
  deleteLabel: Pool Löschen
es:
  title: Zona de Peligro
  text: Operaciones críticas que requieren consideración cuidadosa. Estas acciones pueden interrumpir servidores activos y afectar la disponibilidad del pool. Proceda con precaución.
  renameTitle: Renombrar Pool
  renameText: Actualizar el nombre del pool y la URL del endpoint. Esto puede interrumpir temporalmente la conectividad del servidor y requerir reconexión del cliente.
  renameLabel: Renombrar Pool
  enableTitle: Habilitar Pool
  enableText: Activar este pool para permitir que se creen y gestionen nuevos servidores. El pool estará disponible para su uso.
  enableLabel: Habilitar Pool
  disableTitle: Deshabilitar Pool
  disableText: Desactivar temporalmente este pool para prevenir que se creen nuevos servidores. Los servidores existentes continuarán ejecutándose pero no se aceptarán nuevos servidores.
  disableLabel: Deshabilitar Pool
  deleteTitle: Eliminar Pool
  deleteText: Eliminar permanentemente este pool de su espacio de trabajo. Esta acción no se puede deshacer y terminará todos los servidores en el pool.
  deleteLabel: Eliminar Pool
zh:
  title: 危险区域
  text: 需要仔细考虑的关键操作。这些操作可能会中断活动服务器并影响池的可用性。请谨慎操作。
  renameTitle: 重命名池
  renameText: 更新池名称和端点URL。这可能会暂时中断服务器连接并需要客户端重新连接。
  renameLabel: 重命名池
  enableTitle: 启用池
  enableText: 激活此池以允许创建和管理新服务器。池将可供使用。
  enableLabel: 启用池
  disableTitle: 禁用池
  disableText: 临时停用此池以防止创建新服务器。现有服务器将继续运行，但不会接受新服务器。
  disableLabel: 禁用池
  deleteTitle: 删除池
  deleteText: 从您的工作区中永久删除此池。此操作无法撤消，将终止池中的所有服务器。
  deleteLabel: 删除池
</i18n>
