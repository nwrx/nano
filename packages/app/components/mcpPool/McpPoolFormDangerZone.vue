<script setup lang="ts">
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpPool } from '~/composables/useMcp'
import DialogDelete from './McpPoolDialogDelete.vue'
import DialogDisable from './McpPoolDialogDisable.vue'
import DialogEnable from './McpPoolDialogEnable.vue'
import DialogRename from './McpPoolDialogRename.vue'

const props = defineProps<{
  workspace: string
  name: string
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showEnableDialog = ref(false)
const showDisableDialog = ref(false)
const showDeleteDialog = ref(false)

// --- Data.
const pool = useMcpPool(props)
onMounted(() => pool.fetchPool(true))
const isDisabled = computed(() => false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
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
        class-button="button-warning"
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

    <!-- Rename Dialog -->
    <DialogRename
      v-model="showRenameDialog"
      :workspace="workspace"
      :name="name"
    />

    <!-- Enable Dialog -->
    <DialogEnable
      v-model="showEnableDialog"
      :workspace="workspace"
      :name="name"
    />

    <!-- Disable Dialog -->
    <DialogDisable
      v-model="showDisableDialog"
      :workspace="workspace"
      :name="name"
    />

    <!-- Delete Dialog -->
    <DialogDelete
      v-model="showDeleteDialog"
      :workspace="workspace"
      :name="name"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Irreversible and destructive actions. Please be certain before proceeding with any of these operations.
  renameTitle: Rename Pool
  renameText: Change the pool name and identifier. This may affect routing to servers in this pool.
  renameLabel: Rename pool
  enableTitle: Enable Pool
  enableText: Allow new servers to be started in this pool and accept connections.
  enableLabel: Enable pool
  disableTitle: Disable Pool
  disableText: Prevent new servers from being started in this pool. Existing servers will continue running.
  disableLabel: Disable pool
  deleteTitle: Delete Pool
  deleteText: Permanently remove this pool and all its associated servers. This action cannot be undone.
  deleteLabel: Delete pool
fr:
  title: Zone de danger
  text: Actions irréversibles et destructrices. Veuillez être certain avant de procéder à l'une de ces opérations.
  renameTitle: Renommer le pool
  renameText: Changer le nom et l'identifiant du pool. Cela peut affecter le routage vers les serveurs de ce pool.
  renameLabel: Renommer le pool
  enableTitle: Activer le pool
  enableText: Permettre aux nouveaux serveurs d'être démarrés dans ce pool et d'accepter les connexions.
  enableLabel: Activer le pool
  disableTitle: Désactiver le pool
  disableText: Empêcher les nouveaux serveurs d'être démarrés dans ce pool. Les serveurs existants continueront à fonctionner.
  disableLabel: Désactiver le pool
  deleteTitle: Supprimer le pool
  deleteText: Supprimer définitivement ce pool et tous ses serveurs associés. Cette action ne peut pas être annulée.
  deleteLabel: Supprimer le pool
de:
  title: Gefahrenzone
  text: Irreversible und zerstörerische Aktionen. Bitte seien Sie sicher, bevor Sie mit einer dieser Operationen fortfahren.
  renameTitle: Pool umbenennen
  renameText: Den Pool-Namen und -Identifikator ändern. Dies kann das Routing zu Servern in diesem Pool beeinflussen.
  renameLabel: Pool umbenennen
  enableTitle: Pool aktivieren
  enableText: Neue Server in diesem Pool starten und Verbindungen akzeptieren lassen.
  enableLabel: Pool aktivieren
  disableTitle: Pool deaktivieren
  disableText: Verhindern, dass neue Server in diesem Pool gestartet werden. Bestehende Server laufen weiter.
  disableLabel: Pool deaktivieren
  deleteTitle: Pool löschen
  deleteText: Diesen Pool und alle zugehörigen Server dauerhaft entfernen. Diese Aktion kann nicht rückgängig gemacht werden.
  deleteLabel: Pool löschen
es:
  title: Zona de peligro
  text: Acciones irreversibles y destructivas. Por favor, esté seguro antes de proceder con cualquiera de estas operaciones.
  renameTitle: Renombrar pool
  renameText: Cambiar el nombre e identificador del pool. Esto puede afectar el enrutamiento a los servidores en este pool.
  renameLabel: Renombrar pool
  enableTitle: Habilitar pool
  enableText: Permitir que se inicien nuevos servidores en este pool y acepten conexiones.
  enableLabel: Habilitar pool
  disableTitle: Deshabilitar pool
  disableText: Evitar que se inicien nuevos servidores en este pool. Los servidores existentes seguirán funcionando.
  disableLabel: Deshabilitar pool
  deleteTitle: Eliminar pool
  deleteText: Eliminar permanentemente este pool y todos sus servidores asociados. Esta acción no se puede deshacer.
  deleteLabel: Eliminar pool
zh:
  title: 危险区域
  text: 不可逆转和破坏性操作。在进行任何这些操作之前，请确保您的决定。
  renameTitle: 重命名池
  renameText: 更改池名称和标识符。这可能会影响到此池中服务器的路由。
  renameLabel: 重命名池
  enableTitle: 启用池
  enableText: 允许在此池中启动新服务器并接受连接。
  enableLabel: 启用池
  disableTitle: 禁用池
  disableText: 阻止在此池中启动新服务器。现有服务器将继续运行。
  disableLabel: 禁用池
  deleteTitle: 删除池
  deleteText: 永久删除此池及其所有关联服务器。此操作无法撤消。
  deleteLabel: 删除池
</i18n>
